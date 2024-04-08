import * as tg from 'generic-type-guard';
import { createAction, createSlice } from '@reduxjs/toolkit';

const isError = new tg.IsInterface()
	.withProperty('name', tg.isString)
	.withProperty('message', tg.isString)
	.withOptionalProperty('stack', tg.isMissing(tg.isString))
	.get();
// eslint-disable-next-line @typescript-eslint/no-type-alias
export type ErrorsState = { err?: tg.GuardedType<typeof isError> };

const initialState: ErrorsState = {};

export const setFatalError = createAction<unknown>('setFatalError');

const slice = createSlice({
	name: 'fatal-error',
	initialState,
	reducers: {},
	extraReducers: (builder) =>
		builder.addCase(setFatalError, (state, { payload: err }): void => {
			if (isError(err)) {
				state.err = err;
			} else {
				state.err = new Error(`${err}`);
			}
		}),
});

export default slice.reducer;
