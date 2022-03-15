/* eslint-disable @typescript-eslint/consistent-type-imports */

import { AboutDetails, AppConfiguration, FileDescription, FolderConfiguration, LinuxInstallOptions } from './model';
import { OpenDialogReturnValue } from 'electron';

declare global {
  export interface EditorApi {
    readonly aboutDetails: Promise<AboutDetails>;
    readonly addFolder: (name: string, localPath: string) => Promise<void>;
    readonly deleteFolder: (uuid: string) => Promise<void>;
    readonly doLinuxInstallation: (options: LinuxInstallOptions) => Promise<void>;
    readonly getAppConfiguration: () => Promise<AppConfiguration>;
    readonly getCspNonce: () => Promise<string>;
    readonly isCspEnabled: Promise<boolean>;
    readonly isDev: Promise<boolean>;
    readonly listNoteFiles: () => Promise<FolderConfiguration>;
    readonly openSelectFolderDialog: () => Promise<OpenDialogReturnValue>;
    readonly renameNoteFile: (file: FileDescription, title: string) => Promise<null | FileDescription>;
    readonly setLastFile: (url: string) => Promise<void>;
    readonly setLastFolder: (uuid: string) => Promise<void>;

    readonly on: {
      (event: 'configuration', handler: (config: AppConfiguration) => void): number;
      (event: 'files-updated', handler: (files: FolderConfiguration) => void): number;
      (event: 'update-downloaded', handler: (completed: boolean) => void): number;
    };
    readonly off: (event: 'configuration' | 'files-updated' | 'update-downloaded', handler: number) => void;
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
