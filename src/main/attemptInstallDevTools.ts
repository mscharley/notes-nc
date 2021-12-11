/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-require-imports */

let isDevTmp = false;
try {
  const electronDev =
    require('electron-is-dev') as typeof import('electron-is-dev');
  isDevTmp = electronDev;
} catch (e: unknown) {
  /* do nothing, default is already set */
}
export const isDev = isDevTmp;

let installExtensions: () => Promise<void>;
try {
  if (!isDev) {
    throw new Error('Loading development extensions while not in dev mode.');
  }
  console.log('DEVELOPER MODE: Installing developer extensions.');
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
} catch (e: unknown) {
  installExtensions = Promise.resolve.bind(Promise);
}

export const attemptInstallDevTools: () => Promise<void> = installExtensions;
