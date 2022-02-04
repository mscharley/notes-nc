import { attemptInstallDevTools } from './dev/attemptInstallDevTools';
import { BrowserWindow } from 'electron/main';
import { injectable } from 'inversify';
import log from 'electron-log';
import path from 'path';
import { shell } from 'electron/common';

@injectable()
export class MainWindow {
  private _window?: Electron.BrowserWindow;
  public get window(): Electron.BrowserWindow | unknown {
    return this._window;
  }

  public readonly initialise = async (): Promise<void> => {
    await attemptInstallDevTools();

    this._window = new BrowserWindow({
      width: 1024,
      height: 768,
      webPreferences: {
        contextIsolation: true,
        disableBlinkFeatures: 'Auxclick',
        nodeIntegration: false,
        nodeIntegrationInWorker: false,
        /* eng-disable PRELOAD_JS_CHECK */ preload: path.join(__dirname, '../renderer/preload.js'),
        sandbox: true,
      },
    });
    this._window.webContents.on('will-navigate', (event, url) => {
      if (!this.isAllowedInternalNavigationUrl(url)) {
        event.preventDefault();
        this.tryExternalNavigation(url);
      }
    });
    this._window.webContents.setWindowOpenHandler((details) => {
      if (this.isAllowedInternalNavigationUrl(details.url)) {
        return { action: 'allow' };
      } else {
        this.tryExternalNavigation(details.url);
        return { action: 'deny' };
      }
    });
    this._window.on('closed', this.onClose);

    await this._window.loadURL('app://renderer/index.html');
  };

  private readonly isAllowedInternalNavigationUrl = (url: string): boolean => {
    const parsed = new URL(url);

    return parsed.protocol === 'app:';
  };

  private readonly tryExternalNavigation = (url: string): void => {
    const parsed = new URL(url);

    if (['http:', 'https:', 'mailto:'].includes(parsed.protocol)) {
      /* eng-disable OPEN_EXTERNAL_JS_CHECK */ shell.openExternal(url).catch((e) => log.error(e));
    } else {
      log.warn(`Invalid external URL attempted to open: ${url}`);
    }
  };

  private readonly onClose = (): void => {
    this._window = undefined;
  };
}
