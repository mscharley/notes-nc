/**
 * @file
 *
 * This has a lot of optional loads for development tools and exports out a set of tools whether the underlying methods
 * exist or not.
 */

/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-var-requires */

import { injectable } from '@mscharley/dot';
import log from 'electron-log';

let isDevTmp = false;
try {
	const electronDev = require('electron-is-dev') as typeof import('electron-is-dev');
	isDevTmp = electronDev;
} catch (e: unknown) {
	/* do nothing, default is already set */
}

let installExtensions: () => Promise<void>;
let extensionIds: string[] = [];
try {
	const {
		default: installer,
		REACT_DEVELOPER_TOOLS,
		REDUX_DEVTOOLS,
	} = require('electron-devtools-installer') as typeof import('electron-devtools-installer');
	installExtensions = async (): Promise<void> => {
		log.info('DEVELOPER MODE: Installing developer extensions.');
		await installer([REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS], {
			loadExtensionOptions: { allowFileAccess: true },
		});
	};

	// This should not be hardcoded like this, but one of the extension id's seems to not match what CSP needs.
	extensionIds = ['lmhkpmbekcpmknklioeibfkpmmfibljd', 'dlgmmhhbobbiecagjcpmglnehdcmelof'];
} catch (e: unknown) {
	// eslint-disable-next-line @typescript-eslint/require-await
	installExtensions = async (): Promise<never> => {
		throw e;
	};
}

@injectable()
export class DevTools {
	public readonly isDev: boolean = isDevTmp;
	public readonly installDevExtensions: () => Promise<void> = installExtensions;
	public readonly devExtensionIds: () => string[] = () => extensionIds;
}
