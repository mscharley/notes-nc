import { ElectronApp, ElectronIpcMain } from '~main/dot/tokens.js';
import { injectable, unmanaged } from '@mscharley/dot';
import type { AboutDetails } from '~shared/model/AboutDetails.js';
import { DevTools } from '~main/services/DevTools.js';
import type { OnReadyHandler } from '~main/interfaces/OnReadyHandler.js';

@injectable(ElectronApp, ElectronIpcMain, DevTools, unmanaged(globalThis.process))
export class AboutElectron implements OnReadyHandler {
	public constructor(
		private readonly app: ElectronApp,
		private readonly ipcMain: ElectronIpcMain,
		private readonly devtools: DevTools,
		private readonly process: NodeJS.Process,
	) {}

	public readonly onAppReady = (): void => {
		// eslint-disable-next-line @typescript-eslint/require-await
		this.ipcMain.handle('about-details', async (): Promise<AboutDetails> => {
			const version = this.app.getVersion();

			return {
				electronVersion: this.process.versions.electron,
				version,
				isDevBuild: this.devtools.isDev,

				osName: this.process.platform,
				osVersion: this.process.getSystemVersion(),
			};
		});
	};
}
