import { createAction, createSlice } from '@reduxjs/toolkit';
import type { FileDescription, FolderConfiguration, FolderDescription } from '~shared/model/index.js';

export type FilesState =
	| {
		loading: true;
		folders?: undefined;
		currentFile?: undefined;
		currentFolder?: undefined;
	}
	| {
		loading: false;
		folders: FolderConfiguration;
		currentFile?: FileDescription;
		currentFolder?: string;
	};

// Unfortunately, typescript is too smart for it's own good here and infers the very specific loading type for the slice.
// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
const initialState = { loading: true } as FilesState;

export const setFileListing = createAction<FolderConfiguration>('setFileListing');
export const setCurrentFile = createAction<FileDescription>('setCurrentFile');
export const closeCurrentFile = createAction('closeCurrentFile');
export const setCurrentFolder = createAction<string>('setCurrentFolder');

const slice = createSlice({
	name: 'files',
	initialState,
	reducers: {},
	extraReducers: (builder) =>
		builder
			.addCase(setFileListing, (state, { payload: folders }) => {
				if (state.loading) {
					const firstFolder: FolderDescription | undefined = Object.values(folders)[0];

					// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
					return { loading: false, folders, currentFolder: firstFolder?.uuid };
				}

				state.folders = folders;

				return state;
			})
			.addCase(setCurrentFile, (state, { payload: currentFile }) => {
				if (state.loading) {
					return;
				}

				window.editorApi.setLastFile(currentFile.url).catch((e) => window.log.error(e));

				state.currentFile = currentFile;
			})
			.addCase(closeCurrentFile, (state) => {
				if (state.loading) {
					return;
				}

				state.currentFile = undefined;
			})
			.addCase(setCurrentFolder, (state, { payload: currentFolder }) => {
				if (state.loading) {
					return;
				}

				window.editorApi.setLastFolder(currentFolder).catch((e) => window.log.error(e));

				state.currentFolder = currentFolder;
			}),
});

export default slice.reducer;
