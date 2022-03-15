/* eng-disable REMOTE_MODULE_JS_CHECK */

import { CustomProtocol, ElectronApp, ReadyHandler } from '~main/inversify/tokens';
import { inject, injectable } from 'inversify';
import { injectToken, multiInjectToken } from 'inversify-token';
import log from 'electron-log';
import { MainWindow } from '~main/MainWindow';
import { protocol } from 'electron/main';

@injectable()
export class Entrypoint {
  public constructor(
    @injectToken(ElectronApp) private readonly application: ElectronApp,
    @inject(MainWindow) private readonly mainWindow: MainWindow,
    @multiInjectToken(CustomProtocol)
    private readonly customProtocols: CustomProtocol[],
    @multiInjectToken(ReadyHandler)
    private readonly onReadyHandlers: ReadyHandler[],
  ) {
    log.debug(`Config directory: ${application.getPath('userData')}`);
    log.debug(`Log directory: ${application.getPath('logs')}`);
  }

  public readonly start = (): void => {
    // Check we're the first instance of this application.
    if (!this.application.requestSingleInstanceLock()) {
      this.application.quit();
    }

    const privSchemes = this.customProtocols.map((p) => p.privilegedSchemes).flat();
    log.verbose(
      'Registering schemes as privileged:',
      privSchemes.map((s) => s.scheme),
    );
    protocol.registerSchemesAsPrivileged(privSchemes);

    this.application.on('second-instance', this.onSecondInstance);
    this.application.on('window-all-closed', this.onWindowAllClosed);

    this.application.whenReady().then(this.onReady).catch(this.onFatalError);
  };

  private readonly onSecondInstance = (
    _event: Electron.Event,
    _argv: string[],
    _workingDirectory: string,
    _additionalData: unknown,
  ): void => {
    this.mainWindow.bringWindowToTop();
  };

  private readonly onReady = (): void => {
    this.customProtocols.forEach((p) => p.registerProtocols(protocol));
    this.onReadyHandlers
      .reduce<Promise<void>>(async (acc, handler) => acc.then(handler.onAppReady), Promise.resolve())
      .then(async () => this.mainWindow.initialise())
      .catch(this.onFatalError);
  };

  private readonly onWindowAllClosed = (): void => {
    this.application.quit();
  };

  private readonly onFatalError = (error: unknown): never => {
    log.error(error);
    // eslint-disable-next-line no-process-exit
    process.exit(1);
  };
}
