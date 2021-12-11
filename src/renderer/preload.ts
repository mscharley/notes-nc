import { contextBridge, ipcRenderer } from 'electron/renderer';
import type { CdkEditorApi } from './renderer';

const cdkEditorApi: CdkEditorApi = {
  getCspNonce: async () => ipcRenderer.invoke('csp-nonce') as Promise<string>,
};

contextBridge.exposeInMainWorld('cdkEditor', cdkEditorApi);
