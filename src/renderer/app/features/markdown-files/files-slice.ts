import { createAction, createSlice } from '@reduxjs/toolkit';
import type { FileDescription, FileListing } from '../../../../shared/model';

export type FilesState =
  | { loading: true; folders?: undefined; currentFile?: undefined }
  | {
      loading: false;
      folders: FileListing;
      currentFile?: FileDescription;
    };

// Unfortunately, typescript is too smart for it's own good here and infers the very specific loading type for the slice.
// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
const initialState = { loading: true } as FilesState;

export const setFileListing = createAction<FileListing>('setFileListing');
export const setCurrentFile = createAction<FileDescription>('setCurrentFile');
export const closeCurrentFile = createAction('closeCurrentFile');

const slice = createSlice({
  name: 'files',
  initialState,
  reducers: {},
  extraReducers: (builder) =>
    builder
      .addCase(setFileListing, (state, { payload: folders }) => {
        if (state.loading) {
          return { loading: false, folders };
        }

        state.folders = folders;

        return state;
      })
      .addCase(setCurrentFile, (state, { payload: currentFile }) => {
        if (state.loading) {
          return;
        }

        state.currentFile = currentFile;
      })
      .addCase(closeCurrentFile, (state) => {
        if (state.loading) {
          return;
        }

        state.currentFile = undefined;
      }),
});

export default slice.reducer;
