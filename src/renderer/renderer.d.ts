export interface CdkEditorApi {
  getCspNonce: () => Promise<string>;
}

declare global {
  interface Window {
    cdkEditor: CdkEditorApi;
  }
}
