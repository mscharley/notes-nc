import { ElectronApp, ElectronIpcMain } from '~main/inversify/tokens';
import { rename, writeFile } from 'fs/promises';
import { injectable } from 'inversify';
import { injectToken } from 'inversify-token';
import type { LinuxInstallOptions } from '~shared/model/LinuxInstallOptions';
import log from 'electron-log';
import type { OnReadyHandler } from '~main/interfaces/OnReadyHandler';
import { resolve } from 'path';

@injectable()
export class LinuxIntegration implements OnReadyHandler {
  private readonly XDG_CONFIG_HOME: string;
  private readonly XDG_CACHE_HOME: string;
  private readonly XDG_BIN_HOME: string;
  private readonly XDG_DATA_HOME: string;

  private readonly ICONS_DIR: string;
  private readonly APPLICATIONS_DIR: string;
  private readonly BIN_DIR: string;

  private readonly APPIMAGE?: string;
  private readonly installedAppImage: string;
  private readonly isInstalled: boolean;

  public constructor(
    @injectToken(ElectronApp) app: ElectronApp,
    @injectToken(ElectronIpcMain) private readonly ipcMain: ElectronIpcMain,
  ) {
    const HOME = app.getPath('home');

    this.XDG_CONFIG_HOME = process.env.XDG_CONFIG_HOME ?? resolve(HOME, '.config');
    this.XDG_CACHE_HOME = process.env.XDG_CACHE_HOME ?? resolve(HOME, '.cache');
    this.XDG_BIN_HOME = process.env.XDG_BIN_HOME ?? resolve(HOME, '.local/bin');
    this.XDG_DATA_HOME = process.env.XDG_DATA_HOME ?? resolve(HOME, '.local/share');

    this.ICONS_DIR = resolve(this.XDG_DATA_HOME, 'icons');
    this.APPLICATIONS_DIR = resolve(this.XDG_DATA_HOME, 'applications');
    this.BIN_DIR = this.XDG_BIN_HOME;

    this.APPIMAGE = process.env.APPIMAGE;
    this.installedAppImage = resolve(this.XDG_BIN_HOME, 'Notes.AppImage');
    this.isInstalled = this.APPIMAGE === this.installedAppImage;
  }

  public readonly onAppReady = (): void => {
    // eslint-disable-next-line @typescript-eslint/require-await
    this.ipcMain.handle('check-linux-install', async (): Promise<boolean> => {
      if (this.APPIMAGE != null) {
        this.ipcMain.handleOnce('linux-install', this.doInstallation);
        return true;
      }

      return false;
    });
  };

  private readonly doInstallation = async (
    _ev: unknown,
    { createDesktopEntry, moveAppImage }: LinuxInstallOptions,
  ): Promise<void> => {
    if (this.APPIMAGE == null) {
      return;
    }

    log.info('Running Linux installation.');
    const appImage = moveAppImage ? this.installedAppImage : this.APPIMAGE;
    if (moveAppImage) {
      await rename(this.APPIMAGE, appImage);
    }

    if (createDesktopEntry) {
      await writeFile(resolve(this.APPLICATIONS_DIR, 'note-nc.desktop'), this.generateDesktopEntry(appImage));
    }
  };

  private readonly generateDesktopEntry = (appImage: string): string => `[Desktop Entry]

Type=Application
Name=Notes
Comment=Notes for Nextcloud
Terminal=false
Categories="Utility;"
Exec=${appImage}
`;
}
