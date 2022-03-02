import { ElectronApp, ElectronIpcMain } from '~main/inversify/tokens';
import { injectable, unmanaged } from 'inversify';
import type { AboutDetails } from '~shared/model/AboutDetails';
import { compare } from 'compare-versions';
import { DevTools } from './DevTools';
import { injectToken } from 'inversify-token';
import type { OnReadyHandler } from '~main/interfaces/OnReadyHandler';
import { UpdatesProvider } from './UpdatesProvider';

@injectable()
export class AboutElectron implements OnReadyHandler {
  public constructor(
    @injectToken(ElectronApp) private readonly app: ElectronApp,
    @injectToken(ElectronIpcMain) private readonly ipcMain: ElectronIpcMain,
    private readonly updates: UpdatesProvider,
    private readonly devtools: DevTools,
    @unmanaged() private readonly process: NodeJS.Process = globalThis.process,
  ) {}

  public readonly onAppReady = (): void => {
    this.ipcMain.handle('about-details', async (): Promise<AboutDetails> => {
      const updateCheckResults = await this.updates.checkResults;
      const version = this.app.getVersion();

      return {
        electronVersion: this.process.versions.electron,
        version,
        isDevBuild: this.devtools.isDev,

        updateExists: compare(updateCheckResults?.updateInfo.version ?? '0.0.0', version, '>'),
        updateVersion: updateCheckResults?.updateInfo.version,

        osName: this.process.platform,
        osVersion: this.process.getSystemVersion(),
      };
    });
  };
}
