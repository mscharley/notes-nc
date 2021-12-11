/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-require-imports */

import log from 'electron-log';

let isDevTmp = false;
try {
  const electronDev =
    require('electron-is-dev') as typeof import('electron-is-dev');
  isDevTmp = electronDev;
} catch (e: unknown) {
  /* do nothing, default is already set */
}
export const isDev = isDevTmp;

let installExtensions: () => Promise<void> = Promise.resolve.bind(Promise);
try {
  if (isDev) {
    log.info('DEVELOPER MODE: Installing developer extensions.');
    const {
      default: installExtension,
      REACT_DEVELOPER_TOOLS,
      REDUX_DEVTOOLS,
    } = require('electron-devtools-installer') as typeof import('electron-devtools-installer');
    installExtensions = async (): Promise<void> => {
      await installExtension([REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS], {
        loadExtensionOptions: { allowFileAccess: true },
      });
    };
  }
} catch (e: unknown) {
  /* do nothing, default is already set */
}

export const attemptInstallDevTools = installExtensions;
