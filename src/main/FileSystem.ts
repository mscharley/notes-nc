import { ElectronApp } from './tokens';
import { injectable } from 'inversify';
import { injectToken } from 'inversify-token';
import { ipcMain } from 'electron';
import type { OnReadyHandler } from './OnReadyHandler';
import path from 'path';
import { readdir } from 'fs/promises';

@injectable()
export class FileSystem implements OnReadyHandler {
  public constructor(
    @injectToken(ElectronApp) public readonly application: ElectronApp,
  ) {}

  public onAppReady = (): void | Promise<void> => {
    ipcMain.handle(
      'files-updated',
      async (): Promise<Record<string, string[]>> => {
        return this.generateCategories(
          path.join(this.application.getPath('home'), 'Nextcloud/Notes'),
          '',
        );
      },
    );
  };

  private readonly generateCategories = async (
    basePath: string,
    category: string,
  ): Promise<Record<string, string[]>> => {
    const dir = await readdir(path.join(basePath, category), {
      withFileTypes: true,
    });

    const files = dir
      .filter((f) => f.isFile() && f.name.match(/\.(?:md|markdown)$/u) != null)
      .map((f) => f.name);

    const subfolders = (
      await Promise.all(
        dir
          .filter((f) => f.isDirectory())
          .map(async (f) =>
            this.generateCategories(basePath, path.join(category, f.name)),
          ),
      )
    )
      .map((f) => Object.entries(f))
      .reduce((acc, v) => acc.concat(v), []);

    return Object.fromEntries([[category, files], ...subfolders]);
  };
}
