import 'reflect-metadata';

import { app } from 'electron';
import { getContainer } from './inversify';
import log from 'electron-log';
import { Main } from './main/Main';

try {
  getContainer(app).get(Main).start();
} catch (e: unknown) {
  log.error(e);
  // eslint-disable-next-line no-process-exit
  process.exit(1);
}
