import * as td from 'testdouble';
import type { Configuration } from '../Configuration';
import { FileSystem } from '../FileSystem';
import type { MainWindow } from '../MainWindow';
import type { Mutable } from '../../shared/util';

describe('FileSystem', () => {
  const app: Electron.App = td.object('app');
  const ipcMain: Electron.IpcMain = td.object('ipcMain');
  const window: MainWindow = td.object('window');
  const config: Configuration = td.object('config');

  let fs: FileSystem;
  beforeEach(() => {
    td.when(app.getAppPath()).thenReturn('./app');
    (config as Mutable<Configuration>).foldersByUuid = {};
    fs = new FileSystem(app, ipcMain, window, config);
  });

  afterEach(() => {
    td.reset();
  });

  describe('#privilegedSchemas', () => {
    it('should specify both app and editor', () => {
      expect(fs.privilegedSchemes).toMatchObject([{ scheme: 'app' }, { scheme: 'editor' }]);
    });
  });
});
