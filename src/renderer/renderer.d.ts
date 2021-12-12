export interface CdkEditorApi {
  readonly getCspNonce: () => Promise<string>;
  readonly isDev: Promise<boolean>;
}

declare global {
  interface Window {
    cdkEditor: CdkEditorApi;
    // eslint-disable-next-line @typescript-eslint/consistent-type-imports
    log: import('electron-log').LogFunctions;
  }
}
