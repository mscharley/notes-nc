/* eng-disable REMOTE_MODULE_JS_CHECK */

import { CustomProtocol, ElectronApp, ReadyHandler } from '../inversify/tokens';
import { injectToken, multiInjectToken } from 'inversify-token';
import { protocol, session } from 'electron/main';
import { injectable } from 'inversify';
import log from 'electron-log';
import { MainWindow } from './MainWindow';

@injectable()
export class Main {
  public constructor(
    @injectToken(ElectronApp) private readonly application: ElectronApp,
    private readonly mainWindow: MainWindow,
    @multiInjectToken(CustomProtocol)
    private readonly customProtocols: CustomProtocol[],
    @multiInjectToken(ReadyHandler)
    private readonly onReadyHandlers: ReadyHandler[],
  ) {
    log.debug(`Config directory: ${application.getPath('userData')}`);
    log.debug(`Log directory: ${application.getPath('logs')}`);
  }

  public readonly start = (): void => {
    const privSchemes = this.customProtocols.map((p) => p.privilegedSchemes).flat();
    log.verbose(
      'Registering schemes as privileged:',
      privSchemes.map((s) => s.scheme),
    );
    protocol.registerSchemesAsPrivileged(privSchemes);

    this.application.on('window-all-closed', this.onWindowAllClosed);

    // Signal to Electron that we're ready to go when it is.
    this.application.on('ready', this.onReady);
  };

  private readonly onWindowAllClosed = (): void => {
    if (process.platform !== 'darwin') {
      this.application.quit();
    }
  };

  private readonly onReady = (): void => {
    this.customProtocols.forEach((p) => p.registerProtocols(session.defaultSession));
    this.onReadyHandlers
      .reduce<Promise<void>>(async (acc, handler) => acc.then(handler.onAppReady), Promise.resolve())
      .then(async () => this.mainWindow.initialise())
      .catch(this.onFatalError);
  };

  private readonly onFatalError = (error: unknown): never => {
    log.error(error);
    // eslint-disable-next-line no-process-exit
    process.exit(1);
  };
}
