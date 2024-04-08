import { dialog, ipcMain } from 'electron/main';
import { ElectronApp, ElectronDialog, ElectronIpcMain } from '~main/dot/tokens';
import type { interfaces } from '@mscharley/dot';

export const ElectronModule
	= (app: Electron.App): interfaces.SyncContainerModule =>
		(bind) => {
			bind(ElectronApp).toConstantValue(app);
			bind(ElectronIpcMain).toConstantValue(ipcMain);
			bind(ElectronDialog).toConstantValue(dialog);
		};
