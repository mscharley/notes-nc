/* eng-disable PROTOCOL_HANDLER_JS_CHECK */

import type { CategoryListing, FileDescription, FileListing } from '../shared/model';
import { v4 as createUuid } from 'uuid';
import type { CustomProtocolProvider } from './interfaces/CustomProtocolProvider';
import { ElectronApp } from '../inversify/tokens';
import { injectable } from 'inversify';
import { injectToken } from 'inversify-token';
import { ipcMain } from 'electron/main';
import log from 'electron-log';
import type { OnReadyHandler } from './interfaces/OnReadyHandler';
import path from 'path';
import type { ProtocolResponse } from 'electron/main';
import { readdir } from 'fs/promises';

@injectable()
export class FileSystem implements CustomProtocolProvider, OnReadyHandler {
  private readonly appBasePath: string;
  private readonly errorBasePath: string;

  private readonly directories: Record<
    string,
    {
      name: string;
      localPath: string;
    }
  >;

  public constructor(@injectToken(ElectronApp) application: ElectronApp) {
    this.appBasePath = path.join(application.getAppPath(), 'ts-build');
    this.errorBasePath = path.join(application.getAppPath(), 'static');
    // TODO: Load this from a configuration file somewhere.
    this.directories = {
      [createUuid()]: { name: 'Nextcloud', localPath: path.join(application.getPath('home'), 'Nextcloud/Notes') },
    };
  }

  public readonly privilegedSchemes: Electron.CustomScheme[] = [
    {
      scheme: 'app',
      privileges: {
        standard: true,
        secure: true,
      },
    },
    {
      scheme: 'editor',
      privileges: {
        standard: true,
        secure: true,
        supportFetchAPI: true,
      },
    },
  ];

  public registerProtocols = (session: Electron.Session): void => {
    log.debug('Registering the app:// scheme.');
    session.protocol.registerFileProtocol('app', (request, cb) => {
      const url = new URL(request.url);
      if (!['renderer'].includes(url.hostname)) {
        return cb({
          statusCode: 404,
          path: path.join(this.errorBasePath, '404.txt'),
        });
      }
      if (request.method === 'GET') {
        return cb(
          this.serveLocalFile(path.join(this.appBasePath, url.hostname), decodeURIComponent(url.pathname), request.url),
        );
      } else {
        return cb({
          statusCode: 400,
          path: path.join(this.errorBasePath, '400.txt'),
        });
      }
    });
    log.debug('Registering the editor:// scheme.');
    session.protocol.registerFileProtocol('editor', (request, cb): void => {
      const url = new URL(request.url);
      const dir = this.directories[url.hostname];

      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (dir == null) {
        return cb({
          statusCode: 400,
          path: path.join(this.errorBasePath, '400.txt'),
        });
      }

      switch (request.method) {
        case 'GET':
          return cb(this.serveLocalFile(dir.localPath, decodeURIComponent(url.pathname), request.url));
        default:
          return cb({
            statusCode: 500,
            path: path.join(this.errorBasePath, '500.txt'),
          });
      }
    });
  };

  public onAppReady = (): void | Promise<void> => {
    ipcMain.handle('files-updated', async (): Promise<FileListing> => {
      return Object.fromEntries(
        await Promise.all(
          Object.entries(this.directories).map(async ([uuid, { name, localPath }]) => [
            name,
            await this.generateFolder(uuid, localPath, ''),
          ]),
        ),
      );
    });
  };

  private readonly generateFolder = async (
    folder: string,
    basePath: string,
    category: string,
  ): Promise<CategoryListing> => {
    const dir = await readdir(path.join(basePath, category), {
      withFileTypes: true,
    });

    const files = dir
      .filter((f) => f.isFile() && f.name.match(/\.(?:md|markdown)$/u) != null)
      .map(
        (f): FileDescription => ({
          name: f.name,
          url: `editor://${folder}/${category}/${f.name}`,
        }),
      );

    const subfolders = (
      await Promise.all(
        dir
          .filter((f) => f.isDirectory())
          .map(async (f) => this.generateFolder(folder, basePath, path.join(category, f.name))),
      )
    )
      .map((f) => Object.entries(f))
      .flat();

    return Object.fromEntries([[category === '' ? 'Uncategorised' : category, files], ...subfolders]);
  };

  private serveLocalFile(basepath: string, filepath: string, url: string): string | ProtocolResponse {
    const file = path.join(basepath, filepath);
    if (!file.startsWith(basepath)) {
      // Don't allow malicious URL's that try to span the file system.
      log.warn(`Invalid request for ${url}`);
      return {
        statusCode: 400,
        path: path.join(this.errorBasePath, '400.txt'),
      };
    } else {
      log.verbose(`${url} => ${file}`);
      return {
        statusCode: 200,
        headers: {
          'cache-control': 'no-cache, no-store',
        },
        path: file,
      };
    }
  }
}
