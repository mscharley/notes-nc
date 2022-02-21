import 'source-map-support';
import 'reflect-metadata';

import log from 'electron-log';
log.debug('Notes booting');

import { app } from 'electron/main';
import { Entrypoint } from './Entrypoint';
import { getContainer } from './inversify';

try {
  getContainer(app).get(Entrypoint).start();
} catch (e: unknown) {
  log.error(e);
  // eslint-disable-next-line no-process-exit
  process.exit(1);
}
