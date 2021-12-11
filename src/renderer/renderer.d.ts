export interface CdkEditorApi {
  helloWorld: () => void;
}

declare global {
  interface Window {
    cdkEditor: CdkEditorApi;
  }
}
