/* eslint-disable @typescript-eslint/consistent-type-imports */

import { FolderConfiguration } from './model';
import { OpenDialogReturnValue } from 'electron';

declare global {
  export interface EditorApi {
    readonly getCspNonce: () => Promise<string>;
    readonly isCspEnabled: Promise<boolean>;
    readonly isDev: Promise<boolean>;
    readonly listNoteFiles: () => Promise<FolderConfiguration>;
    readonly openSelectFolderDialog: () => Promise<OpenDialogReturnValue>;
    readonly addFolder: (name: string, localPath: string) => Promise<void>;
    readonly deleteFolder: (uuid: string) => Promise<void>;

    readonly on: {
      // eslint-disable-next-line @typescript-eslint/prefer-function-type
      (event: 'files-updated', handler: (files: FolderConfiguration) => void): void;
    };
    readonly off: {
      // eslint-disable-next-line @typescript-eslint/prefer-function-type
      (event: 'files-updated', handler: (files: FolderConfiguration) => void): void;
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
