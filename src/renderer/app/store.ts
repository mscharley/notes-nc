/* eslint-disable @typescript-eslint/no-type-alias */

import { configureStore } from '@reduxjs/toolkit';
import titleReducer from '../features/title/title-slice';

export const store = configureStore({
  reducer: {
    title: titleReducer,
  },
});

export type AppDispatch = typeof store['dispatch'];
export type RootState = ReturnType<typeof store['getState']>;
