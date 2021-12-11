import { contextBridge, ipcRenderer } from 'electron/renderer';
import type { CdkEditorApi } from './renderer';
import type log from 'electron-log';

const cdkEditorApi: CdkEditorApi = {
  getCspNonce: async () => ipcRenderer.invoke('csp-nonce') as Promise<string>,
};

const logFns: log.LogFunctions = {
  error: async (...params) => ipcRenderer.invoke('log', 'debug', ...params),
  warn: async (...params) => ipcRenderer.invoke('log', 'warn', ...params),
  info: async (...params) => ipcRenderer.invoke('log', 'info', ...params),
  verbose: async (...params) => ipcRenderer.invoke('log', 'verbose', ...params),
  debug: async (...params) => ipcRenderer.invoke('log', 'debug', ...params),
  silly: async (...params) => ipcRenderer.invoke('log', 'silly', ...params),
  log: async (...params) => ipcRenderer.invoke('log', 'log', ...params),
};

contextBridge.exposeInMainWorld('cdkEditor', cdkEditorApi);
contextBridge.exposeInMainWorld('log', logFns);
