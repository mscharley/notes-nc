import { contextBridge, ipcRenderer } from 'electron/renderer';
import type ElectronLog from 'electron-log';

const exposeBridge = (exports: EditorGlobalApi): void => {
  Object.entries(exports).forEach(([name, value]) => {
    contextBridge.exposeInMainWorld(name, value);
  });
};

const log: ElectronLog.LogFunctions = {
  error: (...params) => ipcRenderer.send('log', 'debug', ...params),
  warn: (...params) => ipcRenderer.send('log', 'warn', ...params),
  info: (...params) => ipcRenderer.send('log', 'info', ...params),
  verbose: (...params) => ipcRenderer.send('log', 'verbose', ...params),
  debug: (...params) => ipcRenderer.send('log', 'debug', ...params),
  silly: (...params) => ipcRenderer.send('log', 'silly', ...params),
  log: (...params) => ipcRenderer.send('log', 'log', ...params),
};

/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
class EditorApiImpl implements EditorApi {
  public readonly isCspEnabled: EditorApi['isCspEnabled'];
  public readonly isDev: EditorApi['isDev'];

  // eslint-disable-next-line @typescript-eslint/ban-types
  private readonly cache: Record<number, undefined | Function> = [];

  public constructor() {
    this.isCspEnabled = ipcRenderer.invoke('is-csp-enabled');
    this.isDev = ipcRenderer.invoke('is-dev');
  }

  public readonly aboutDetails: EditorApi['aboutDetails'] = ipcRenderer.invoke('about-details');
  public readonly listNoteFiles: EditorApi['listNoteFiles'] = async () => ipcRenderer.invoke('list-files');
  public readonly getCspNonce: EditorApi['getCspNonce'] = async () => ipcRenderer.invoke('csp-nonce');
  public readonly addFolder: EditorApi['addFolder'] = async (name: string, localPath: string) =>
    ipcRenderer.invoke('add-folder', name, localPath);
  public readonly deleteFolder: EditorApi['deleteFolder'] = async (uuid: string) =>
    ipcRenderer.invoke('delete-folder', uuid);
  public readonly openSelectFolderDialog: EditorApi['openSelectFolderDialog'] = async () =>
    ipcRenderer.invoke('open-select-folder');

  /* eslint-disable @typescript-eslint/no-explicit-any */
  public readonly on: globalThis.EditorApi['on'] = (event, handler: (...args: any[]) => void) => {
    const wrapped = (_ev: unknown, ...args: any[]): void => handler(...args);
    const index = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
    this.cache[index] = wrapped;

    ipcRenderer.on(event, wrapped);

    return index;
  };
  public readonly off: globalThis.EditorApi['off'] = (event, handler) => {
    const wrapped = this.cache[handler];
    if (wrapped == null) {
      log.warn(`Invalid call to .off() for function which was never registered. event: ${event}`);
      return;
    }
    ipcRenderer.off(event, wrapped as any);
  };
  /* eslint-enable @typescript-eslint/no-explicit-any */
}
/* eslint-enable @typescript-eslint/no-unsafe-return */
/* eslint-enable @typescript-eslint/no-unsafe-assignment */

exposeBridge({
  editorApi: new EditorApiImpl(),
  log,
});
