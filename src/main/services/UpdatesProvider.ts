import type { AppUpdater, UpdateCheckResult } from 'electron-updater';
import { inject, injectable, unmanaged } from 'inversify';
import { autoUpdater } from 'electron-updater';
import { DevTools } from '~main/services/DevTools';
import log from 'electron-log';
import { MainWindow } from '~main/MainWindow';
import type { OnReadyHandler } from '~main/interfaces/OnReadyHandler';

// eslint-disable-next-line @typescript-eslint/no-magic-numbers
export const ONE_WEEK_IN_MILLISECONDS = 7 * 24 * 60 * 60 * 1000;

@injectable()
export class UpdatesProvider implements OnReadyHandler {
  public constructor(
    @inject(DevTools) private readonly devtools: DevTools,
    @inject(MainWindow) private readonly mainWindow: MainWindow,
    @unmanaged() private readonly updater: AppUpdater = autoUpdater,
  ) {
    this.updater.logger = log;
  }

  private _checkResults: Promise<UpdateCheckResult | null> = Promise.resolve(null);
  public get checkResults(): Promise<UpdateCheckResult | null> {
    return this._checkResults;
  }

  public readonly onAppReady = (): void => {
    // TODO: make this configurable.
    this.updater.autoDownload = true;
    if (!this.devtools.isDev || 'FORCE_CHECK_UPDATES' in process.env) {
      this.doSingleUpdateRun();
      setInterval(this.doSingleUpdateRun, ONE_WEEK_IN_MILLISECONDS);
    }
  };

  private readonly doSingleUpdateRun = (): void => {
    this._checkResults = this.updater
      .checkForUpdates()
      .then((update) => {
        update.downloadPromise
          ?.then(() => {
            this.mainWindow.send('update-downloaded', true);
          })
          .catch((e) => {
            log.error(e);
          });

        return update;
      })
      .catch((_e) => {
        // Don't bother logging here, electron-updater already logs the error.
        return null;
      });
  };
}
