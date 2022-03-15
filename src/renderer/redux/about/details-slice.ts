import { createAction, createSlice } from '@reduxjs/toolkit';
import type { AboutDetails } from '~shared/model/AboutDetails';

export type AboutSlice = { loading: false; details?: undefined } | { loading: true; details: AboutDetails };

// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
const initialState = { loading: false } as AboutSlice;

export const setAboutDetails = createAction<AboutDetails>('setAboutDetails');
export const setUpdateDownloaded = createAction<boolean>('setUpdateDownloaded');

const slice = createSlice({
  name: 'about-details',
  initialState,
  reducers: {},
  extraReducers: (builder) =>
    builder
      .addCase(setAboutDetails, (state, { payload: details }): void => {
        state.loading = false;
        state.details = details;
      })
      .addCase(setUpdateDownloaded, (state, { payload }) => {
        if (state.details != null) {
          state.details.updateDownloaded = payload;
        }
      }),
});

export default slice.reducer;
