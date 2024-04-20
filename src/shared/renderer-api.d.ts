/* eslint-disable @typescript-eslint/consistent-type-imports */

import {
	AboutDetails,
	AppConfiguration,
	FileDescription,
	FolderConfiguration,
	LinuxInstallOptions,
	UpdateStatus,
} from './model/index.js';
import { OpenDialogReturnValue } from 'electron';

declare global {
	export interface EditorApi {
		readonly aboutDetails: Promise<AboutDetails>;
		readonly addCategory: (folderUuid: string, category: string) => Promise<void>;
		readonly addFolder: (name: string, localPath: string) => Promise<void>;
		readonly checkForUpdates: () => void;
		readonly cspNonce: Promise<string>;
		readonly deleteCategory: (folderUuid: string, categoryPath: string) => Promise<void>;
		readonly deleteFolder: (uuid: string) => Promise<void>;
		readonly doLinuxInstallation: (options: LinuxInstallOptions) => Promise<void>;
		readonly getAppConfiguration: () => Promise<AppConfiguration>;
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
			(event: 'update-status', handler: (status: UpdateStatus) => void): number;
		};
		readonly off: (event: 'configuration' | 'files-updated' | 'update-status', handler: number) => void;
	}

	export interface EditorGlobalApi {
		editorApi: EditorApi;
		log: import('electron-log').LogFunctions;
	}

	interface Window extends EditorGlobalApi {}
}

export default global;
