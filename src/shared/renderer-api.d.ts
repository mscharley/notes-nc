/* eslint-disable @typescript-eslint/consistent-type-imports */

import { FileListing } from './model';

declare global {
  export interface EditorApi {
    readonly getCspNonce: () => Promise<string>;
    readonly isCspEnabled: Promise<boolean>;
    readonly isDev: Promise<boolean>;
    readonly listNoteFiles: () => Promise<FileListing>;

    readonly on: {
      // eslint-disable-next-line @typescript-eslint/prefer-function-type
      (event: 'files-updated', handler: (files: FileListing) => void): void;
    };
    readonly off: {
      // eslint-disable-next-line @typescript-eslint/prefer-function-type
      (event: 'files-updated', handler: (files: FileListing) => void): void;
    };
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
