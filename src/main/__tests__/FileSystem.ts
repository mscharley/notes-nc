import * as td from 'testdouble';
import type { Configuration } from '../Configuration';
import { FileSystem } from '../FileSystem';

describe('FileSystem', () => {
  const app: Electron.App = td.object('app');
  const ipcMain: Electron.IpcMain = td.object('ipcMain');
  const config: Configuration = {
    foldersByUuid: {},
  } as Partial<Configuration> as Configuration;

  let fs: FileSystem;
  beforeEach(() => {
    td.when(app.getAppPath()).thenReturn('./app');
    fs = new FileSystem(app, ipcMain, config);
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
