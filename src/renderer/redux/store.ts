/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-type-alias */

import { configureStore } from '@reduxjs/toolkit';
import { reducer } from '~renderer/redux';

export const generateStore = () =>
  configureStore({
    reducer,
  });

export const store = generateStore();

export type AppDispatch = typeof store['dispatch'];
export type RootState = ReturnType<typeof store['getState']>;
