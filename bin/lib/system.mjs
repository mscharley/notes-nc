/* eslint-disable no-console */
/* global console */

import { spawn } from 'child_process';

export const system = (cmd) => {
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
