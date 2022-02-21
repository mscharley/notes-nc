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

exposeBridge({
  editorApi: {
    listNoteFiles: async () => ipcRenderer.invoke('files-updated') as ReturnType<EditorApi['listNoteFiles']>,
    getCspNonce: async () => ipcRenderer.invoke('csp-nonce') as Promise<string>,
    isCspEnabled: ipcRenderer.invoke('is-csp-enabled') as Promise<boolean>,
    isDev: ipcRenderer.invoke('is-dev') as Promise<boolean>,
    on: (event, handler) => {
      ipcRenderer.on(event, (_ev, value) => handler(value));
      ipcRenderer.invoke(event).then(handler).catch(log.error.bind(log));
    },
  },
  log,
});
