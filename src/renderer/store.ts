/* eslint-disable @typescript-eslint/no-type-alias */

import { configureStore } from '@reduxjs/toolkit';
import { reducer } from './app/features';

export const store = configureStore({
  reducer,
});

export type AppDispatch = typeof store['dispatch'];
export type RootState = ReturnType<typeof store['getState']>;
