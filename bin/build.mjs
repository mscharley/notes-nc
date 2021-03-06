/* eslint-disable no-console */
/* global console */
/* global process */

import { system } from './lib/system.mjs';

(async () => {
  await system('npm run clean');
  await system('tsc');
  await system('npm run build:vite');
  await system('npm run build:esbuild');
})().catch((e) => {
  console.error(e);
  // eslint-disable-next-line no-process-exit
  process.exit(1);
});
