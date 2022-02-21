import { ElectronApp, ElectronIpcMain } from './tokens';
import type { ContainerModule } from 'inversify';
import { ipcMain } from 'electron/main';
import { TokenContainerModule } from 'inversify-token';

export const ElectronModule = (app: Electron.App): ContainerModule =>
  new TokenContainerModule((bind) => {
    bind(ElectronApp).toConstantValue(app);
    bind(ElectronIpcMain).toConstantValue(ipcMain);
  });
