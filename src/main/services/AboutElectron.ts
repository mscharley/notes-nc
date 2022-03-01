import { ElectronApp, ElectronIpcMain } from '../inversify/tokens';
import type { AboutDetails } from '../../shared/model/AboutDetails';
import { DevTools } from './DevTools';
import { injectable } from 'inversify';
import { injectToken } from 'inversify-token';
import type { OnReadyHandler } from '../interfaces/OnReadyHandler';
import { UpdatesProvider } from './UpdatesProvider';

@injectable()
export class AboutElectron implements OnReadyHandler {
  public constructor(
    @injectToken(ElectronApp) private readonly app: ElectronApp,
    @injectToken(ElectronIpcMain) private readonly ipcMain: ElectronIpcMain,
    private readonly updates: UpdatesProvider,
    private readonly devtools: DevTools,
  ) {}

  public readonly onAppReady = (): void => {
    this.ipcMain.handle('about-details', async (): Promise<AboutDetails> => {
      const updateCheckResults = await this.updates.checkResults;

      return {
        electronVersion: process.versions.electron,
        version: this.app.getVersion(),
        isDevBuild: this.devtools.isDev,

        updateExists: updateCheckResults?.updateInfo.version != null,
        updateVersion: updateCheckResults?.updateInfo.version,

        osName: process.platform,
        osVersion: process.getSystemVersion(),
      };
    });
  };
}
