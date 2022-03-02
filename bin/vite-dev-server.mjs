/* eslint-disable no-console */
/* global console */
/* global process */

import { system } from './lib/system.mjs';

(async () => {
  await system(`vite --port ${process.env.VITE_PORT || 5000}`);
})().catch((e) => {
  console.error(e);
  // eslint-disable-next-line no-process-exit
  process.exit(1);
});
