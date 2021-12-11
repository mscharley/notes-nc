import { injectable } from 'inversify';
import { ipcMain } from 'electron';
import log from 'electron-log';
import type { OnReadyHandler } from './OnReadyHandler';

@injectable()
export class RendererLogging implements OnReadyHandler {
  public readonly onAppReady = (): void => {
    ipcMain.handle('log', (_event, level: keyof log.LogFunctions, ...args) => {
      log[level](...args);
    });
  };
}
