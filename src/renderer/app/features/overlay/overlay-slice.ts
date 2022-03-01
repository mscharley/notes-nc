import { createAction, createSlice } from '@reduxjs/toolkit';

export type Overlays = 'about' | 'configuration';
export interface OverlayConfig {
  activeOverlay: null | Overlays;
}

// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
const initialState = { activeOverlay: null } as OverlayConfig;

export const setActiveOverlay = createAction<Overlays>('setActiveOverlay');
export const closeOverlay = createAction<Overlays>('closeOverlay');
export const overrideActiveOverlay = createAction<null | Overlays>('overrideActiveOverlay');

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
      }),
});

export default slice.reducer;
