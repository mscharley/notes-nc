/* eslint-disable no-console */
/* global console */
/* global process */

import { system } from './lib/system.mjs';

(async () => {
  await system('electron-builder install-app-deps');
  await system('patch-package --error-on-fail');
})().catch((e) => {
  console.error(e);
  // eslint-disable-next-line no-process-exit
  process.exit(1);
});
