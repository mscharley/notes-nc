/* eslint-disable no-console */
/* global console */
/* global process */

import { system } from './lib/system.mjs';

(async () => {
  process.env.ELECTRON_IS_DEV = process.argv[2] === '--dev' ? '1' : '0';
  console.log(`ELECTRON_IS_DEV=${process.env.ELECTRON_IS_DEV}`);
  await system('electron ./');
})().catch((e) => {
  console.error(e);
  // eslint-disable-next-line no-process-exit
  process.exit(1);
});
