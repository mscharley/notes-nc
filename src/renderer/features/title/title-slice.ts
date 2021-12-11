import { createAction, createSlice } from '@reduxjs/toolkit';

export interface TitleState {
  currentFile?: string;
  prefix: string;
}

const initialState: TitleState = {
  prefix: 'CDK Editor',
};

export const setCurrentFile = createAction<string>('setCurrentFile');
export const closeCurrentFile = createAction('closeCurrentFile');

const slice = createSlice({
  name: 'title',
  initialState,
  reducers: {},
  extraReducers: (builder) =>
    builder
      .addCase(setCurrentFile, (state, action) => {
        state.currentFile = action.payload;
      })
      .addCase(closeCurrentFile, (state) => {
        state.currentFile = undefined;
      }),
});

export default slice.reducer;
