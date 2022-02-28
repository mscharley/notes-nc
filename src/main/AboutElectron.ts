import { ElectronApp, ElectronIpcMain } from './inversify/tokens';
import type { AboutDetails } from '../shared/model/AboutDetails';
import { DevTools } from './DevTools';
import { injectable } from 'inversify';
import { injectToken } from 'inversify-token';
import type { OnReadyHandler } from './interfaces/OnReadyHandler';

@injectable()
export class AboutElectron implements OnReadyHandler {
  public constructor(
    @injectToken(ElectronApp) private readonly app: ElectronApp,
    @injectToken(ElectronIpcMain) private readonly ipcMain: ElectronIpcMain,
    private readonly devtools: DevTools,
  ) {}

  public readonly onAppReady = (): void => {
    // eslint-disable-next-line @typescript-eslint/require-await
    this.ipcMain.handle('about-details', async (): Promise<AboutDetails> => {
      return {
        electronVersion: process.versions.electron,
        version: this.app.getVersion(),
        isDevBuild: this.devtools.isDev,
        osName: process.platform,
        osVersion: process.getSystemVersion(),
      };
    });
  };
}
