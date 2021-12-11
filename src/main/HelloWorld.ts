import { injectable } from 'inversify';
import { ipcMain } from 'electron';
import type { OnReadyHandler } from './OnReadyHandler';

@injectable()
export class HelloWorld implements OnReadyHandler {
  public onAppReady = (): void => {
    ipcMain.handle('hello-world', () => {
      console.log('Hello world from the browser!');
    });
  };
}
