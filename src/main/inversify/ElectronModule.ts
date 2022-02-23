import { dialog, ipcMain } from 'electron/main';
import { ElectronApp, ElectronDialog, ElectronIpcMain } from './tokens';
import type { ContainerModule } from 'inversify';
import { TokenContainerModule } from 'inversify-token';

export const ElectronModule = (app: Electron.App): ContainerModule =>
  new TokenContainerModule((bind) => {
    bind(ElectronApp).toConstantValue(app);
    bind(ElectronIpcMain).toConstantValue(ipcMain);
    bind(ElectronDialog).toConstantValue(dialog);
  });
