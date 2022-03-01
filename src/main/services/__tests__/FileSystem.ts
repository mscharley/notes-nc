import * as td from 'testdouble';
import type { Configuration } from '../Configuration';
import { FileSystem } from '../FileSystem';
import type { MainWindow } from '../../MainWindow';
import type { Mutable } from '@shared/util';

describe('FileSystem', () => {
  const app: Electron.App = td.object('app');
  const ipcMain: Electron.IpcMain = td.object('ipcMain');
  const window: MainWindow = td.object('window');
  const config: Configuration = td.object('config');

  let fs: FileSystem;
  beforeEach(() => {
    td.when(app.getAppPath()).thenReturn('./app');
    (config as Mutable<Configuration>).foldersByUuid = {};
    (config as Mutable<Configuration>).folderPrefixes = [];
  });

  afterEach(() => {
    td.reset();
  });

  describe('#privilegedSchemas', () => {
    it('should specify both app and editor', () => {
      fs = new FileSystem(app, ipcMain, window, config);
      expect(fs.privilegedSchemes).toMatchObject([{ scheme: 'app' }, { scheme: 'editor' }]);
    });
  });

  describe('#generateDisplayPath', () => {
    it('should truncate the given path as a prefix', () => {
      (config as Mutable<Configuration>).folderPrefixes = [['/home/foo', '~']];
      fs = new FileSystem(app, ipcMain, window, config);
      expect(fs.generateDisplayPath('/home/foo/test.md')).toBe('~/test.md');
    });

    it('should not truncate the given path as a contains', () => {
      (config as Mutable<Configuration>).folderPrefixes = [['/home/foo', '~']];
      fs = new FileSystem(app, ipcMain, window, config);
      expect(fs.generateDisplayPath('/home/bar/home/foo/test.md')).toBe('/home/bar/home/foo/test.md');
    });

    it('should use the longest path prefix for truncation', () => {
      (config as Mutable<Configuration>).folderPrefixes = [
        ['/home/foo', '~'],
        ['/home/foo/Nextcloud', 'Nextcloud'],
      ];
      fs = new FileSystem(app, ipcMain, window, config);
      expect(fs.generateDisplayPath('/home/foo/Nextcloud/Notes/test.md')).toBe('Nextcloud/Notes/test.md');
    });
  });
});
