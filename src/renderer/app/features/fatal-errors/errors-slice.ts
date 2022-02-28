import * as tg from 'generic-type-guard';
import { createAction, createSlice } from '@reduxjs/toolkit';

const isError = new tg.IsInterface()
  .withProperty('message', tg.isString)
  .withOptionalProperty('stack', tg.isMissing(tg.isString))
  .get();
// eslint-disable-next-line @typescript-eslint/no-type-alias
export type ErrorsState = null | tg.GuardedType<typeof isError>;

const initialState = null as ErrorsState;

export const setFatalError = createAction<unknown>('setFatalError');

const slice = createSlice({
  name: 'fatal-error',
  initialState,
  reducers: {},
  extraReducers: (builder) =>
    builder.addCase(setFatalError, (_state, { payload: error }): tg.GuardedType<typeof isError> => {
      if (error instanceof Error) {
        return error;
      } else {
        return new Error(`${error}`);
      }
    }),
});

export default slice.reducer;
