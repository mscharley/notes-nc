import { createAction, createSlice } from '@reduxjs/toolkit';
import type { AppConfiguration } from '~shared/model/AppConfiguration';

const initialState: AppConfiguration = {
  isAppImage: false,
};

export const updateAppConfiguration = createAction<AppConfiguration>('updateAppConfiguration');

const slice = createSlice({
  name: 'configuration',
  initialState,
  reducers: {},
  extraReducers: (builder) =>
    builder.addCase(updateAppConfiguration, (_state, { payload: details }): AppConfiguration => details),
});

export default slice.reducer;
