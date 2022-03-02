import type { AppUpdater, UpdateCheckResult } from 'electron-updater';
import { inject, injectable, unmanaged } from 'inversify';
import { autoUpdater } from 'electron-updater';
import { DevTools } from '~main/services/DevTools';
import log from 'electron-log';
import type { OnReadyHandler } from '~main/interfaces/OnReadyHandler';

@injectable()
export class UpdatesProvider implements OnReadyHandler {
  public constructor(
    @inject(DevTools) private readonly devtools: DevTools,
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
    // this.updater.autoDownload = false;
    if (!this.devtools.isDev || 'FORCE_CHECK_UPDATES' in process.env) {
      this._checkResults = this.updater.checkForUpdates();
    }
  };
}
