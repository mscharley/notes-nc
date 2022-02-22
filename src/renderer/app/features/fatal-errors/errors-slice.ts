import { createAction, createSlice } from '@reduxjs/toolkit';

export type ErrorsState = null | Error;

const initialState = null as ErrorsState;

export const setFatalError = createAction<unknown>('setFatalError');

const slice = createSlice({
  name: 'fatal-error',
  initialState,
  reducers: {},
  extraReducers: (builder) =>
    builder.addCase(setFatalError, (_state, { payload: error }) => {
      if (error instanceof Error) {
        return error;
      } else {
        return new Error(`${error}`);
      }
    }),
});

export default slice.reducer;
