import { createAction, createSlice } from '@reduxjs/toolkit';
import type { AboutDetails } from '~shared/model';

export type AboutSlice = { loading: true; details?: undefined } | { loading: false; details: AboutDetails };

// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
const initialState = { loading: true } as AboutSlice;

export const setAboutDetails = createAction<AboutDetails>('setAboutDetails');

const slice = createSlice({
  name: 'about-details',
  initialState,
  reducers: {},
  extraReducers: (builder) =>
    builder.addCase(setAboutDetails, (state, { payload: details }): void => {
      state.loading = false;
      state.details = details;
    }),
});

export default slice.reducer;
