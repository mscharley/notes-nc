import 'source-map-support';
import 'reflect-metadata';

import log from 'electron-log';
log.transports.file.level = 'silly';
log.transports.console.level = (process.env.LOG_LEVEL as undefined | log.LevelOption) ?? 'info';
log.debug('Notes booting');

import { app } from 'electron/main';
import { Entrypoint } from '~main/Entrypoint';
import { getContainer } from '~main/inversify';

try {
  const container = getContainer(app);
  container.get(Entrypoint).start();
} catch (e: unknown) {
  log.error(e);
  // eslint-disable-next-line no-process-exit
  process.exit(1);
}
