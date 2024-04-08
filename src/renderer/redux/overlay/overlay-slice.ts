import { createAction, createSlice } from '@reduxjs/toolkit';
import type { FileDescription } from '~shared/model';

export type Overlays = 'about' | 'configuration' | 'delete';
export interface OverlayConfig {
	activeOverlay: null | Overlays;
	currentFileDeletion?: FileDescription;
}

// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
const initialState = { activeOverlay: null } as OverlayConfig;

export const setActiveOverlay = createAction<Overlays>('setActiveOverlay');
export const closeOverlay = createAction<Overlays>('closeOverlay');
export const overrideActiveOverlay = createAction<null | Overlays>('overrideActiveOverlay');
export const confirmDelete = createAction<FileDescription>('confirmDelete');

const slice = createSlice({
	name: 'overlay',
	initialState,
	reducers: {},
	extraReducers: (builder) =>
		builder
			.addCase(setActiveOverlay, (state, { payload: overlay }) => {
				if (state.activeOverlay == null) {
					state.activeOverlay = overlay;
				}
			})
			.addCase(closeOverlay, (state, { payload: overlay }) => {
				if (state.activeOverlay === overlay) {
					state.activeOverlay = null;
				}
			})
			.addCase(overrideActiveOverlay, (state, { payload: overlay }): void => {
				state.activeOverlay = overlay;
			})
			.addCase(confirmDelete, (state, { payload: file }) => {
				state.activeOverlay = 'delete';
				state.currentFileDeletion = file;
			}),
});

export default slice.reducer;
