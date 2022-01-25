/* eslint-disable @typescript-eslint/consistent-type-imports */

declare global {
  export interface EditorApi {
    readonly getCspNonce: () => Promise<string>;
    readonly isDev: Promise<boolean>;
  }

  export interface EditorGlobalApi {
    editorApi: EditorApi;
    log: import('electron-log').LogFunctions;
  }

  export const editorApi: EditorApi;
  export const log: import('electron-log').LogFunctions;

  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface Window extends EditorGlobalApi {}
}

export default global;
