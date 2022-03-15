import { ElectronApp, ElectronIpcMain } from '~main/inversify/tokens';
import { inject, injectable, unmanaged } from 'inversify';
import type { AboutDetails } from '~shared/model/AboutDetails';
import { DevTools } from '~main/services/DevTools';
import { injectToken } from 'inversify-token';
import type { OnReadyHandler } from '~main/interfaces/OnReadyHandler';

@injectable()
export class AboutElectron implements OnReadyHandler {
  public constructor(
    @injectToken(ElectronApp) private readonly app: ElectronApp,
    @injectToken(ElectronIpcMain) private readonly ipcMain: ElectronIpcMain,
    @inject(DevTools) private readonly devtools: DevTools,
    @unmanaged() private readonly process: NodeJS.Process = globalThis.process,
  ) {}

  public readonly onAppReady = (): void => {
    // eslint-disable-next-line @typescript-eslint/require-await
    this.ipcMain.handle('about-details', async (): Promise<AboutDetails> => {
      const version = this.app.getVersion();

      return {
        electronVersion: this.process.versions.electron,
        version,
        isDevBuild: this.devtools.isDev,

        osName: this.process.platform,
        osVersion: this.process.getSystemVersion(),
      };
    });
  };
}
