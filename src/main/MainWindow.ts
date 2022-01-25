import { attemptInstallDevTools } from './attemptInstallDevTools';
import { BrowserWindow } from 'electron/main';
import { injectable } from 'inversify';
import path from 'path';

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
        nodeIntegration: false,
        nodeIntegrationInWorker: false,
        /* eng-disable PRELOAD_JS_CHECK */ preload: path.join(__dirname, '../renderer/preload.js'),
        sandbox: true,
      },
    });
    this._window.on('closed', this.onClose);

    await this._window.loadURL('app://renderer/index.html');
  };

  private readonly onClose = (): void => {
    this._window = undefined;
  };
}
