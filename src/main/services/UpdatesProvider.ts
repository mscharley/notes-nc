import type { AppUpdater, UpdateCheckResult } from 'electron-updater';
import { inject, injectable, unmanaged } from 'inversify';
import { autoUpdater } from 'electron-updater';
import { DevTools } from '~main/services/DevTools';
import { ElectronIpcMain } from '~main/inversify/tokens';
import { injectToken } from 'inversify-token';
import log from 'electron-log';
import { MainWindow } from '~main/MainWindow';
import type { OnReadyHandler } from '~main/interfaces/OnReadyHandler';
import type { UpdateStatus } from '~shared/model';

// eslint-disable-next-line @typescript-eslint/no-magic-numbers
export const ONE_WEEK_IN_MILLISECONDS = 7 * 24 * 60 * 60 * 1000;

@injectable()
export class UpdatesProvider implements OnReadyHandler {
  public constructor(
    @inject(DevTools) private readonly devtools: DevTools,
    @inject(MainWindow) private readonly mainWindow: MainWindow,
    @injectToken(ElectronIpcMain) private readonly ipcMain: ElectronIpcMain,
    @unmanaged() private readonly updater: AppUpdater = autoUpdater,
  ) {
    this.updater.logger = log;
  }

  private _checkResults: Promise<UpdateCheckResult | null> = Promise.resolve(null);
  public get checkResults(): Promise<UpdateCheckResult | null> {
    return this._checkResults;
  }

  public readonly onAppReady = (): void => {
    this.updateStatus({
      canCheckForUpdates: false,
      checkingForUpdate: false,
      updateDownloaded: false,
      updateExists: false,
    });
    // TODO: make this configurable.
    this.updater.autoDownload = true;
    if (!this.devtools.isDev || 'FORCE_CHECK_UPDATES' in process.env) {
      this.ipcMain.on('check-updates', this.doSingleUpdateRun);
      setInterval(this.doSingleUpdateRun, ONE_WEEK_IN_MILLISECONDS);
    }
  };

  private readonly doSingleUpdateRun = (): void => {
    this.updateStatus({
      canCheckForUpdates: true,
      checkingForUpdate: true,
      updateDownloaded: false,
      updateExists: false,
    });
    this._checkResults = this.updater
      .checkForUpdates()
      .then((update) => {
        if (update?.downloadPromise != null) {
          this.updateStatus({
            canCheckForUpdates: true,
            checkingForUpdate: false,
            updateDownloaded: false,
            updateExists: true,
            updateVersion: update.updateInfo.version,
          });
          update.downloadPromise
            .then(() => {
              this.updateStatus({
                canCheckForUpdates: true,
                checkingForUpdate: false,
                updateDownloaded: true,
                updateExists: true,
                updateVersion: update.updateInfo.version,
              });
            })
            .catch((e) => {
              log.error(e);
            });
        } else {
          this.updateStatus({
            canCheckForUpdates: update != null,
            checkingForUpdate: false,
            updateDownloaded: false,
            updateExists: false,
          });
        }

        return update;
      })
      .catch((_e) => {
        // Don't bother logging here, electron-updater already logs the error.
        return null;
      });
  };

  private readonly updateStatus = (status: UpdateStatus): void => {
    this.mainWindow.send('update-status', status);
  };
}
