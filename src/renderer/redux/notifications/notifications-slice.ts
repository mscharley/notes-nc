import { createAction, createSlice } from '@reduxjs/toolkit';

export interface NotificationsState {
	saving: boolean;
}

const initialState = { saving: false };

export const setSaving = createAction<boolean>('setSaving');

const slice = createSlice({
	name: 'notifications',
	initialState,
	reducers: {},
	extraReducers: (builder) =>
		builder.addCase(setSaving, (state, { payload: saving }) => {
			state.saving = saving;
		}),
});

export default slice.reducer;
