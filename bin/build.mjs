/* eslint-disable no-console */
import { spawn } from 'child_process';

/* global console */
/* global process */

const system = (cmd) => {
  return new Promise((resolve, reject) => {
    console.log(`> ${cmd}`);
    const spawned = spawn(cmd, [], { shell: true, stdio: 'inherit' });
    spawned.on('error', reject);
    spawned.on('exit', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command returned status code ${code}`));
      }
    });
  });
};

(async () => {
  await system('tsc');
  await system('webpack');
})().catch((e) => {
  console.error(e);
  // eslint-disable-next-line no-process-exit
  process.exit(1);
});
