import { ElectronApp, ReadyHandler } from './tokens';
import { injectToken, multiInjectToken } from 'inversify-token';
import { BrowserWindow } from 'electron/main';
import { injectable } from 'inversify';
import path from 'path';

@injectable()
export class Main {
  private _mainWindow?: Electron.BrowserWindow;
  public get mainWindow(): Electron.BrowserWindow | unknown {
    return this._mainWindow;
  }

  public constructor(
    @injectToken(ElectronApp) public readonly application: ElectronApp,
    @multiInjectToken(ReadyHandler)
    private readonly onReadyHandlers: ReadyHandler[],
  ) {
    this.onReadyHandlers.push(this);
  }

  public readonly start = (): void => {
    this.application.on('window-all-closed', this.onWindowAllClosed);
    this.application.on('ready', this.onReady);
  };

  private readonly onWindowAllClosed = (): void => {
    if (process.platform !== 'darwin') {
      this.application.quit();
    }
  };

  private readonly onClose = (): void => {
    this._mainWindow = undefined;
  };

  private readonly onReady = (): void => {
    this.onReadyHandlers
      .reduce<Promise<void>>(
        async (acc, handler) => acc.then(handler.onAppReady),
        Promise.resolve(),
      )
      .catch(this.onFatalError);
  };

  public readonly onAppReady = (): void => {
    this._mainWindow = new BrowserWindow({
      width: 1024,
      height: 768,
      webPreferences: {
        nodeIntegration: false,
        nodeIntegrationInWorker: false,
        contextIsolation: true,
        preload: path.join(__dirname, '../renderer/preload.js'),
      },
    });
    this._mainWindow.on('closed', this.onClose);
    this._mainWindow
      .loadURL(`file://${path.join(__dirname, '../renderer/index.html')}`)
      .catch(this.onFatalError);
  };

  private readonly onFatalError = (error: unknown): never => {
    // eslint-disable-next-line no-console
    console.error(error);
    // eslint-disable-next-line no-process-exit
    process.exit(1);
  };
}
