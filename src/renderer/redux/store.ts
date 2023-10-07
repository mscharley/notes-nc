/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-type-alias */

import { configureStore } from '@reduxjs/toolkit';
import { reducer } from './reducer';

export const generateStore = () =>
  configureStore({
    reducer,
  });

export type Store = ReturnType<typeof generateStore>;
export type AppDispatch = Store['dispatch'];
export type RootState = ReturnType<Store['getState']>;
