import { v4 as createUuid } from 'uuid';
import { ElectronApp } from './inversify/tokens';
import { injectable } from 'inversify';
import { injectToken } from 'inversify-token';
import path from 'path';

@injectable()
export class Configuration {
  public constructor(@injectToken(ElectronApp) private readonly application: ElectronApp) {}

  public get Directories(): Record<string, { name: string; localPath: string }> {
    // TODO: Load this from a configuration file somewhere.
    return {
      [createUuid()]: { name: 'Nextcloud', localPath: path.join(this.application.getPath('home'), 'Nextcloud/Notes') },
      [createUuid()]: {
        name: 'Family',
        localPath: path.join(this.application.getPath('home'), 'Nextcloud/Family/Notes'),
      },
    };
  }
}
