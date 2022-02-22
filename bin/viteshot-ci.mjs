/* eslint-disable no-console */
/* global console */
/* global process */

import { system } from './lib/system.mjs';

(async () => {
  await system('git fetch');
  await system(`git checkout ${process.env.GITHUB_HEAD_REF}`);
  await system('npx --no-install viteshot -p');
})().catch((e) => {
  console.error(e);
  // eslint-disable-next-line no-process-exit
  process.exit(1);
});
