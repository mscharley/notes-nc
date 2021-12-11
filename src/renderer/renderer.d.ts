export interface CdkEditorApi {
  getCspNonce: () => Promise<string>;
}

declare global {
  interface Window {
    cdkEditor: CdkEditorApi;
    // eslint-disable-next-line @typescript-eslint/consistent-type-imports
    log: import('electron-log').LogFunctions;
  }
}
