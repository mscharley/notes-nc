/* eslint-disable @typescript-eslint/consistent-type-imports */

import { AboutDetails, FileDescription, FolderConfiguration, LinuxInstallOptions } from './model';
import { OpenDialogReturnValue } from 'electron';

declare global {
  export interface EditorApi {
    readonly aboutDetails: Promise<AboutDetails>;
    readonly addFolder: (name: string, localPath: string) => Promise<void>;
    readonly checkLinuxInstallation: () => Promise<boolean>;
    readonly deleteFolder: (uuid: string) => Promise<void>;
    readonly doLinuxInstallation: (options: LinuxInstallOptions) => Promise<void>;
    readonly getCspNonce: () => Promise<string>;
    readonly isCspEnabled: Promise<boolean>;
    readonly isDev: Promise<boolean>;
    readonly listNoteFiles: () => Promise<FolderConfiguration>;
    readonly openSelectFolderDialog: () => Promise<OpenDialogReturnValue>;
    readonly renameNoteFile: (file: FileDescription, title: string) => Promise<null | FileDescription>;

    readonly on: {
      // eslint-disable-next-line @typescript-eslint/prefer-function-type
      (event: 'files-updated', handler: (files: FolderConfiguration) => void): number;
    };
    readonly off: {
      // eslint-disable-next-line @typescript-eslint/prefer-function-type
      (event: 'files-updated', handler: number): void;
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
