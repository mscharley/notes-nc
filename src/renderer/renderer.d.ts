export interface EditorApi {
  readonly getCspNonce: () => Promise<string>;
  readonly isDev: Promise<boolean>;
}

/* eslint-disable @typescript-eslint/consistent-type-imports */

declare global {
  interface Window {
    editor: EditorApi;
    log: import('electron-log').LogFunctions;
  }
}
