import 'source-map-support';
import 'reflect-metadata';

import log from 'electron-log';
log.debug('Notes booting');

import { app } from 'electron';
import { getContainer } from './inversify';
import { Main } from './main/Main';

try {
  getContainer(app).get(Main).start();
} catch (e: unknown) {
  log.error(e);
  // eslint-disable-next-line no-process-exit
  process.exit(1);
}
