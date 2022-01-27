import { createAction, createSlice } from '@reduxjs/toolkit';
import type { FileListing } from '../../../../shared/model';

export type FilesState =
  | { loading: true }
  | {
      loading: false;
      folders: FileListing;
    };

// Unfortunately, typescript is too smart for it's own good here and infers the very specific loading type for the slice.
// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
const initialState = { loading: true } as FilesState;

export const setFileListing = createAction<FileListing>('setFileListing');

const slice = createSlice({
  name: 'files',
  initialState,
  reducers: {},
  extraReducers: (builder) =>
    builder.addCase(setFileListing, (_state, action) => ({
      loading: false,
      folders: action.payload,
    })),
});

export default slice.reducer;
