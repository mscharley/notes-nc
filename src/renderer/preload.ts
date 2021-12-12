import { contextBridge, ipcRenderer } from 'electron/renderer';
import type { CdkEditorApi } from './renderer';
import type log from 'electron-log';

const cdkEditorApi: CdkEditorApi = {
  getCspNonce: async () => ipcRenderer.invoke('csp-nonce') as Promise<string>,
};

const logFns: log.LogFunctions = {
  error: (...params) => ipcRenderer.send('log', 'debug', ...params),
  warn: (...params) => ipcRenderer.send('log', 'warn', ...params),
  info: (...params) => ipcRenderer.send('log', 'info', ...params),
  verbose: (...params) => ipcRenderer.send('log', 'verbose', ...params),
  debug: (...params) => ipcRenderer.send('log', 'debug', ...params),
  silly: (...params) => ipcRenderer.send('log', 'silly', ...params),
  log: (...params) => ipcRenderer.send('log', 'log', ...params),
};

contextBridge.exposeInMainWorld('cdkEditor', cdkEditorApi);
contextBridge.exposeInMainWorld('log', logFns);
