/* eslint-disable no-process-exit */

import 'source-map-support';
import 'reflect-metadata';
import { app } from 'electron/main';
import { Entrypoint } from '~main/Entrypoint';
import { getContainer } from '~main/dot';
import log from 'electron-log';

if (process.argv.includes('--self-test')) {
	// eslint-disable-next-line no-console
	console.log('Self test successful.');
	process.exit(0);
}

log.transports.file.level = 'silly';
log.transports.console.level = (process.env.LOG_LEVEL as undefined | log.LevelOption) ?? 'info';
log.debug('Notes booting');

try {
	const container = getContainer(app);
	container
		.get(Entrypoint)
		.then((_) => _.start())
		.catch((e) => {
			log.error(e);
			process.exit(1);
		});
} catch (e: unknown) {
	log.error(e);
	process.exit(1);
}
