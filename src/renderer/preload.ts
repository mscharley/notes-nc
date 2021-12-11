import { contextBridge, ipcRenderer } from 'electron/renderer';
import type { CdkEditorApi } from './renderer';

const cdkEditorApi: CdkEditorApi = {
  helloWorld: () => {
    ipcRenderer.invoke('hello-world').catch((e) => console.error(e));
  },
};

contextBridge.exposeInMainWorld('cdkEditor', cdkEditorApi);
