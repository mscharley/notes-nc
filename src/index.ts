import 'reflect-metadata';

import { app } from 'electron';
import { getContainer } from './inversify';
import { Main } from './main/Main';

try {
  getContainer(app).get(Main).start();
} catch (e: unknown) {
  // eslint-disable-next-line no-console
  console.error(e);
  // eslint-disable-next-line no-process-exit
  process.exit(1);
}
