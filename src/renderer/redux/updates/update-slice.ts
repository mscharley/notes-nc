import { createAction, createSlice } from '@reduxjs/toolkit';
import type { UpdateStatus } from '~shared/model/index.js';

export type UpdateSlice = { loading: false; status?: undefined } | { loading: true; status: UpdateStatus };

// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
const initialState = { loading: true } as UpdateSlice;

export const setUpdateStatus = createAction<UpdateStatus>('setUpdateDownloaded');

const slice = createSlice({
	name: 'about-details',
	initialState,
	reducers: {},
	extraReducers: (builder) =>
		builder.addCase(setUpdateStatus, (state, { payload: status }) => {
			state.loading = true;
			state.status = status;
		}),
});

export default slice.reducer;
