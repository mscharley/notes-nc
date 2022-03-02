/* eng-disable PROTOCOL_HANDLER_JS_CHECK */

import * as http from '~shared/http';
import type { CategoryDescription, FileDescription, FolderConfiguration, FolderDescription } from '~shared/model';
import { ElectronApp, ElectronIpcMain } from '~main/inversify/tokens';
import { inject, injectable } from 'inversify';
import type { Protocol, ProtocolResponse } from 'electron/main';
import { readdir, rename, writeFile } from 'fs/promises';
import { Configuration } from '~main/services/Configuration';
import type { CustomProtocolProvider } from '~main/interfaces/CustomProtocolProvider';
import { injectToken } from 'inversify-token';
import log from 'electron-log';
import { MainWindow } from '~main/MainWindow';
import type { OnReadyHandler } from '~main/interfaces/OnReadyHandler';
import path from 'path';

@injectable()
export class FileSystem implements CustomProtocolProvider, OnReadyHandler {
  private readonly appBasePath: string;
  private readonly errorBasePath: string;
  private readonly folderPrefixes: Array<[string, string]>;
  private folders: Record<string, { name: string; localPath: string }>;

  public constructor(
    @injectToken(ElectronApp) application: ElectronApp,
    @injectToken(ElectronIpcMain) private readonly ipcMain: ElectronIpcMain,
    @inject(MainWindow) private readonly mainWindow: MainWindow,
    @inject(Configuration) private readonly configuration: Configuration,
  ) {
    this.appBasePath = path.join(application.getAppPath(), 'ts-build');
    this.errorBasePath = path.join(application.getAppPath(), 'share/static');
    this.folderPrefixes = [...configuration.folderPrefixes];
    this.folderPrefixes.sort(([a], [b]) => b.length - a.length);

    this.folders = configuration.foldersByUuid;
    configuration.onChange(() => {
      (async (): Promise<void> => {
        this.folders = configuration.foldersByUuid;
        await this.republishFileList();
      })().catch((e) => {
        log.error(e);
      });
    });
  }

  public readonly privilegedSchemes: Electron.CustomScheme[] = [
    {
      scheme: 'app',
      privileges: {
        bypassCSP: true,
        standard: true,
        secure: true,
      },
    },
    {
      scheme: 'editor',
      privileges: {
        bypassCSP: true,
        standard: true,
        secure: true,
        supportFetchAPI: true,
      },
    },
  ];

  public readonly registerProtocols = (protocol: Protocol): void => {
    log.debug('Registering the app:// scheme.');
    protocol.registerFileProtocol('app', (request, cb) => {
      const url = new URL(request.url);
      if (!['renderer'].includes(url.hostname)) {
        return cb({
          statusCode: http.NOT_FOUND,
          path: path.join(this.errorBasePath, '404.txt'),
        });
      }
      if (request.method === 'GET') {
        return cb(
          this.serveLocalFile(path.join(this.appBasePath, url.hostname), decodeURIComponent(url.pathname), request.url),
        );
      } else {
        return cb({
          statusCode: http.BAD_REQUEST,
          path: path.join(this.errorBasePath, '400.txt'),
        });
      }
    });
    log.debug('Registering the editor:// scheme.');
    protocol.registerFileProtocol('editor', (request, cb): void => {
      (async (): Promise<void> => {
        const url = new URL(request.url);
        const dir = this.folders[url.hostname];

        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (dir == null) {
          return cb({
            statusCode: http.BAD_REQUEST,
            path: path.join(this.errorBasePath, '400.txt'),
          });
        }

        switch (request.method) {
          case 'GET':
            return cb(this.serveLocalFile(dir.localPath, decodeURIComponent(url.pathname), request.url));
          default:
            if (request.uploadData == null) {
              return cb({
                statusCode: http.BAD_REQUEST,
                path: path.join(this.errorBasePath, '400.txt'),
              });
            }

            return cb(
              await this.saveLocalFile(
                dir.localPath,
                decodeURI(url.pathname),
                request.url,
                request.uploadData[0].bytes.toString('utf-8'),
              ),
            );
        }
      })().catch((e) => log.error(e));
    });
  };

  public readonly onAppReady = (): void | Promise<void> => {
    this.ipcMain.handle('list-files', this.listFiles);
    this.ipcMain.handle('rename-file', this.renameFile);
    // eslint-disable-next-line @typescript-eslint/require-await
    this.ipcMain.handle('add-folder', async (_ev, name: string, localPath: string): Promise<void> => {
      this.configuration.addFolder(name, localPath);
    });
    // eslint-disable-next-line @typescript-eslint/require-await
    this.ipcMain.handle('delete-folder', async (_ev, uuid: string): Promise<void> => {
      this.configuration.deleteFolder(uuid);
    });
  };

  private readonly listFiles = async (): Promise<FolderConfiguration> =>
    Object.fromEntries(
      await Promise.all(
        Object.entries(this.folders).map(
          async ([uuid, { name, localPath }]): Promise<[string, FolderDescription]> => [
            name,
            {
              uuid,
              name,
              localPath: localPath,
              displayPath: this.generateDisplayPath(localPath),
              baseUrl: `editor://${uuid}`,
              categories: await this.generateFolder(uuid, localPath, ''),
            },
          ],
        ),
      ),
    );

  private readonly renameFile = async (
    _ev: unknown,
    file: FileDescription,
    displayName: string,
  ): Promise<null | FileDescription> => {
    if (file.displayName === displayName) {
      return file;
    }

    // otherwise...
    const url = new URL(file.url);
    const dir = this.folders[url.hostname];
    const oldFileName = path.join(dir.localPath, decodeURIComponent(url.pathname));
    const newFileName = path.resolve(oldFileName, `../${displayName}.md`);
    log.debug(`RENAME ${oldFileName} => ${newFileName}`);
    await rename(oldFileName, newFileName);
    await this.republishFileList();
    url.pathname = path.resolve(url.pathname, `../${displayName}.md`);

    return {
      displayName,
      name: `${displayName}.md`,
      url: url.toString(),
    };
  };

  public readonly generateFolder = async (
    uuid: string,
    basePath: string,
    category: string,
  ): Promise<CategoryDescription[]> => {
    const dir = await readdir(path.join(basePath, category), {
      withFileTypes: true,
    });

    const files: FileDescription[] = dir
      .filter((f) => f.isFile() && f.name.match(/\.(?:md|markdown)$/u) != null)
      .map((f) => ({
        name: f.name,
        displayName: f.name.replace(/\.md$/u, ''),
        url: `editor://${uuid}/${category}/${f.name}`,
      }));

    const subfolders: CategoryDescription[] = (
      await Promise.all(
        dir
          .filter((f) => f.isDirectory())
          .map(async (f) => this.generateFolder(uuid, basePath, path.join(category, f.name))),
      )
    ).flat();

    const description: CategoryDescription =
      category === ''
        ? { files, name: 'Uncategorised', path: `/${category}` }
        : { files, name: category, path: `/${category}` };
    return [description, ...subfolders];
  };

  private readonly republishFileList = async (): Promise<void> => {
    const files = await this.listFiles();
    this.mainWindow.window?.webContents.send('files-updated', files);
  };

  private readonly serveLocalFile = (basepath: string, filepath: string, url: string): string | ProtocolResponse => {
    const file = path.join(basepath, filepath);
    if (!file.startsWith(basepath)) {
      // Don't allow malicious URL's that try to span the file system.
      log.warn(`Invalid GET request for ${url}`);
      return {
        statusCode: http.BAD_REQUEST,
        path: path.join(this.errorBasePath, '400.txt'),
      };
    } else {
      log.verbose(`GET ${url} => ${file}`);
      return {
        statusCode: http.OK,
        headers: {
          'cache-control': 'no-cache, no-store',
        },
        path: file,
      };
    }
  };

  private readonly saveLocalFile = async (
    basepath: string,
    filepath: string,
    url: string,
    content: string,
  ): Promise<string | ProtocolResponse> => {
    const file = path.join(basepath, filepath);
    if (!file.startsWith(basepath)) {
      // Don't allow malicious URL's that try to span the file system.
      log.warn(`Invalid PUT request for ${url}`);
      return {
        statusCode: http.BAD_REQUEST,
        path: path.join(this.errorBasePath, '400.txt'),
      };
    } else {
      log.verbose(`PUT ${url} => ${file}`);
      await writeFile(file, content);
      return {
        statusCode: http.OK,
        path: path.join(this.errorBasePath, '200.txt'),
      };
    }
  };

  public readonly generateDisplayPath = (localPath: string): string => {
    for (const [prefix, replacement] of this.folderPrefixes) {
      if (localPath.startsWith(prefix)) {
        return `${replacement}${localPath.substring(prefix.length)}`;
      }
    }

    return localPath;
  };
}
