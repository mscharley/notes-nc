/* eng-disable REMOTE_MODULE_JS_CHECK */

import { ElectronApp, ReadyHandler } from './tokens';
import { injectToken, multiInjectToken } from 'inversify-token';
import { injectable } from 'inversify';
import log from 'electron-log';
import { MainWindow } from './MainWindow';

@injectable()
export class Main {
  public constructor(
    @injectToken(ElectronApp) public readonly application: ElectronApp,
    private readonly mainWindow: MainWindow,
    @multiInjectToken(ReadyHandler)
    private readonly onReadyHandlers: ReadyHandler[],
  ) {}

  public readonly start = (): void => {
    this.application.on('window-all-closed', this.onWindowAllClosed);
    this.application.on('ready', this.onReady);
  };

  private readonly onWindowAllClosed = (): void => {
    if (process.platform !== 'darwin') {
      this.application.quit();
    }
  };

  private readonly onReady = (): void => {
    this.onReadyHandlers
      .reduce<Promise<void>>(
        async (acc, handler) => acc.then(handler.onAppReady),
        Promise.resolve(),
      )
      .then(async () => this.mainWindow.initialise())
      .catch(this.onFatalError);
  };

  private readonly onFatalError = (error: unknown): never => {
    log.error(error);
    // eslint-disable-next-line no-process-exit
    process.exit(1);
  };
}
