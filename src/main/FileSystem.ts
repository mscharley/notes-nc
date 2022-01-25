import type { CustomProtocolProvider } from './CustomProtocolProvider';
import { ElectronApp } from './tokens';
import { injectable } from 'inversify';
import { injectToken } from 'inversify-token';
import { ipcMain } from 'electron';
import log from 'electron-log';
import type { OnReadyHandler } from './OnReadyHandler';
import path from 'path';
import { readdir } from 'fs/promises';

@injectable()
export class FileSystem implements CustomProtocolProvider, OnReadyHandler {
  private readonly appBasePath: string;

  public constructor(@injectToken(ElectronApp) private readonly application: ElectronApp) {
    this.appBasePath = path.join(application.getAppPath(), 'ts-build');
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
      const file = path.join(this.appBasePath, url.hostname, url.pathname);
      log.debug(`${request.url} => ${file}`);
      cb(file);
    });
    log.debug('Registering the editor:// scheme.');
    session.protocol.registerFileProtocol('editor', (_request, _cb) => {
      log.debug(_request);
      _cb('/nonexistent');
    });
  };

  public onAppReady = (): void | Promise<void> => {
    ipcMain.handle('files-updated', async (): Promise<Record<string, string[]>> => {
      return this.generateCategories(path.join(this.application.getPath('home'), 'Nextcloud/Notes'), '');
    });
  };

  private readonly generateCategories = async (
    basePath: string,
    category: string,
  ): Promise<Record<string, string[]>> => {
    const dir = await readdir(path.join(basePath, category), {
      withFileTypes: true,
    });

    const files = dir.filter((f) => f.isFile() && f.name.match(/\.(?:md|markdown)$/u) != null).map((f) => f.name);

    const subfolders = (
      await Promise.all(
        dir
          .filter((f) => f.isDirectory())
          .map(async (f) => this.generateCategories(basePath, path.join(category, f.name))),
      )
    )
      .map((f) => Object.entries(f))
      .flat();

    return Object.fromEntries([[category, files], ...subfolders]);
  };
}
