import { ElectronApp, ElectronIpcMain } from '~main/dot/tokens';
import type { AppConfiguration } from '~shared/model';
import EventEmitter from 'events';
import { v4 as generateUuid } from 'uuid';
import { injectable } from '@mscharley/dot';
import { LinuxIntegration } from './LinuxIntegration';
import { MainWindow } from '~main/MainWindow';
import type { ReadyHandler } from '~main/dot/tokens';
import type { Schema } from 'electron-store';
import Store from 'electron-store';

interface ConfigurationFile {
  folders: Array<{
    uuid: string;
    name: string;
    localPath: string;
  }>;
  lastFolder?: string;
  lastFile?: string;
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
  lastFolder: {
    default: undefined,
    type: 'string',
  },
  lastFile: {
    default: undefined,
    type: 'string',
  },
};

const CONFIG_CHANGE = 'config-change';

@injectable(ElectronApp, ElectronIpcMain, LinuxIntegration, MainWindow)
export class Configuration implements ReadyHandler {
  private readonly store: Store<ConfigurationFile>;
  private readonly events: EventEmitter;

  public constructor(
    private readonly application: ElectronApp,
    private readonly ipcMain: ElectronIpcMain,
    private readonly linux: LinuxIntegration,
    private readonly window: MainWindow,
  ) {
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

  public readonly onAppReady = (): void => {
    this.ipcMain.handle('get-configuration', () => this.asAppConfiguration());
    this.ipcMain.handle('set-last-folder', (_ev, uuid: string) => this.store.set('lastFolder', uuid));
    this.ipcMain.handle('set-last-file', (_ev, url: string) => this.store.set('lastFile', url));
    this.onChange(() => {
      this.window.send('configuration', this.asAppConfiguration());
    });
  };

  public readonly onChange = (fn: () => void): EventEmitter => this.events.on(CONFIG_CHANGE, fn);
  public readonly onceChange = (fn: () => void): EventEmitter => this.events.once(CONFIG_CHANGE, fn);
  public readonly offChange = (fn: () => void): EventEmitter => this.events.off(CONFIG_CHANGE, fn);

  public get foldersByUuid(): Readonly<Record<string, { readonly name: string; readonly localPath: string }>> {
    return Object.fromEntries(this.store.get('folders').map((f) => [f.uuid, f]));
  }

  public get folderPrefixes(): Array<[string, string]> {
    return [[this.application.getPath('home'), '~']];
  }

  public readonly setFolders = (folders: Array<{ uuid: string; name: string; localPath: string }>): void => {
    this.store.set('folders', folders);
  };

  public readonly addFolder = (name: string, localPath: string): void => {
    this.setFolders(
      this.store.get('folders').concat([
        {
          uuid: generateUuid(),
          name,
          localPath,
        },
      ]),
    );
  };

  public readonly deleteFolder = (uuid: string): void => {
    this.setFolders(this.store.get('folders').filter((f) => f.uuid !== uuid));
  };

  private readonly asAppConfiguration = (): AppConfiguration => ({
    isAppImage: this.linux.isAppImage,
    layout: 'two-column',
    lastFile: this.store.get('lastFile'),
    lastFolder: this.store.get('lastFolder'),
  });
}
