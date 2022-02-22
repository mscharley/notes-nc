import { ElectronApp } from './inversify/tokens';
import EventEmitter from 'events';
import { injectable } from 'inversify';
import { injectToken } from 'inversify-token';
import type { Schema } from 'electron-store';
import Store from 'electron-store';

interface ConfigurationFile {
  folders: Array<{
    uuid: string;
    name: string;
    localPath: string;
  }>;
}

const schema: Schema<ConfigurationFile> = {
  folders: {
    default: [],
    type: 'array',
    items: {
      type: 'object',
      required: ['uuid', 'name', 'localPath'],
      properties: {
        uuid: { type: 'string' },
        name: { type: 'string' },
        localPath: { type: 'string' },
      },
    },
  },
};

const CONFIG_CHANGE = 'config-change';

@injectable()
export class Configuration {
  private readonly store: Store<ConfigurationFile>;
  private readonly events: EventEmitter;

  public constructor(@injectToken(ElectronApp) private readonly application: ElectronApp) {
    this.events = new EventEmitter();
    this.store = new Store({
      clearInvalidConfig: true,
      schema,
      watch: true,
    });
    this.store.onDidAnyChange(() => {
      this.events.emit(CONFIG_CHANGE);
    });
  }

  public readonly onChange = (fn: () => void): EventEmitter => this.events.on(CONFIG_CHANGE, fn);
  public readonly onceChange = (fn: () => void): EventEmitter => this.events.once(CONFIG_CHANGE, fn);
  public readonly offChange = (fn: () => void): EventEmitter => this.events.off(CONFIG_CHANGE, fn);

  public get foldersByUuid(): Readonly<Record<string, { readonly name: string; readonly localPath: string }>> {
    return Object.fromEntries(this.store.get('folders').map((f) => [f.uuid, f]));
  }

  public readonly setFolders = (folders: Array<{ uuid: string; name: string; localPath: string }>): void => {
    this.store.set<'folders'>('folders', folders);
  };
}
