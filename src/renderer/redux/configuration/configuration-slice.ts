import { createAction, createSlice } from '@reduxjs/toolkit';
import type { AppConfiguration } from '~shared/model/AppConfiguration';

// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
const initialState = {} as AppConfiguration;

export const updateAppConfiguration = createAction<AppConfiguration>('updateAppConfigurate');

const slice = createSlice({
  name: 'configuration',
  initialState,
  reducers: {},
  extraReducers: (builder) =>
    builder.addCase(updateAppConfiguration, (_state, { payload: details }): AppConfiguration => details),
});

export default slice.reducer;
