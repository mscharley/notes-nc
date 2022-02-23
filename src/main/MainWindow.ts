import { ElectronDialog, ElectronIpcMain } from './inversify/tokens';
import { BrowserWindow } from 'electron/main';
import { DevTools } from './DevTools';
import { injectable } from 'inversify';
import { injectToken } from 'inversify-token';
import log from 'electron-log';
import type { OnReadyHandler } from './interfaces/OnReadyHandler';
import path from 'path';
import { shell } from 'electron/common';

@injectable()
export class MainWindow implements OnReadyHandler {
  public constructor(
    private readonly devtools: DevTools,
    @injectToken(ElectronIpcMain) private readonly ipcMain: ElectronIpcMain,
    @injectToken(ElectronDialog) private readonly dialog: ElectronDialog,
  ) {}

  private _window?: Electron.BrowserWindow;
  public get window(): Electron.BrowserWindow | undefined {
    return this._window;
  }

  public readonly initialise = async (): Promise<void> => {
    if (this.devtools.isDev) {
      await this.devtools.installDevExtensions();
    }

    this._window = new BrowserWindow({
      width: this.devtools.isDev ? 1524 : 1024,
      height: 768,
      webPreferences: {
        contextIsolation: true,
        disableBlinkFeatures: 'Auxclick',
        nodeIntegration: false,
        nodeIntegrationInWorker: false,
        /* eng-disable PRELOAD_JS_CHECK */ preload: path.join(__dirname, './preload.js'),
        sandbox: true,
      },
    });
    this._window.webContents.on('will-navigate', (event, url) => {
      if (!this.isAllowedInternalNavigationUrl(url)) {
        event.preventDefault();
        log.warn('Loading external URL:', url);
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

    if (this.devtools.isDev) {
      await this._window.loadURL(`http://localhost:${process.env.VITE_PORT ?? 5000}/index.html`);
      this._window.webContents.openDevTools();
    } else {
      await this._window.loadURL('app://renderer/index.html');
    }
  };

  public readonly onAppReady = (): void => {
    this.ipcMain.handle('open-select-folder', async () =>
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this.dialog.showOpenDialog(this.window!, {
        properties: ['openDirectory', 'createDirectory'],
      }),
    );
  };

  private readonly isAllowedInternalNavigationUrl = (url: string): boolean => {
    const parsed = new URL(url);

    if (this.devtools.isDev) {
      return parsed.hostname === 'localhost';
    }

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
