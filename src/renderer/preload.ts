import { contextBridge, ipcRenderer } from 'electron/renderer';

const exposeBridge = (exports: EditorGlobalApi): void => {
  Object.entries(exports).forEach(([name, value]) => {
    contextBridge.exposeInMainWorld(name, value);
  });
};

exposeBridge({
  editorApi: {
    getCspNonce: async () => ipcRenderer.invoke('csp-nonce') as Promise<string>,
    isDev: ipcRenderer.invoke('is-dev') as Promise<boolean>,
  },
  log: {
    error: (...params) => ipcRenderer.send('log', 'debug', ...params),
    warn: (...params) => ipcRenderer.send('log', 'warn', ...params),
    info: (...params) => ipcRenderer.send('log', 'info', ...params),
    verbose: (...params) => ipcRenderer.send('log', 'verbose', ...params),
    debug: (...params) => ipcRenderer.send('log', 'debug', ...params),
    silly: (...params) => ipcRenderer.send('log', 'silly', ...params),
    log: (...params) => ipcRenderer.send('log', 'log', ...params),
  },
});
