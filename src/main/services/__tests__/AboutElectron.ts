import * as td from 'testdouble';
import type { ElectronApp, ElectronIpcMain } from '~main/inversify/tokens';
import type { AboutDetails } from '~shared/model/AboutDetails';
import { AboutElectron } from '~main/services/AboutElectron';
import type { DevTools } from '~main/services/DevTools';
import type { Mutable } from '~shared/util';
import type { UpdateCheckResult } from 'electron-updater';
import type { UpdatesProvider } from '~main/services/UpdatesProvider';

describe('AboutElectron', () => {
  const app: ElectronApp = td.object('app');
  const ipcMain: ElectronIpcMain = td.object('ipcMain');
  const updates: UpdatesProvider = td.object('updates');
  const devtools: DevTools = td.object('devtools');
  const process: NodeJS.Process = td.object('process');
  let about: AboutElectron;
  let aboutDetails: () => Promise<AboutDetails>;

  beforeEach(() => {
    about = new AboutElectron(app, ipcMain, updates, devtools, process);
    td.when(app.getVersion()).thenReturn('1.2.3');
    const aboutCaptor = td.matchers.captor();
    td.when(ipcMain.handle('about-details', aboutCaptor.capture())).thenReturn(undefined);
    about.onAppReady();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    aboutDetails = aboutCaptor.value;
  });

  afterEach(() => {
    td.reset();
  });

  it('returns no update if the latest update is the same as the current version', async () => {
    (updates as Mutable<UpdatesProvider>).checkResults = Promise.resolve({
      updateInfo: {
        version: '1.2.3',
      },
    } as Partial<UpdateCheckResult> as UpdateCheckResult);

    expect(await aboutDetails()).toMatchObject({
      updateExists: false,
      updateVersion: '1.2.3',
    });
  });

  it('returns updates if the latest update is newer than the current version', async () => {
    (updates as Mutable<UpdatesProvider>).checkResults = Promise.resolve({
      updateInfo: {
        version: '2.0.0',
      },
    } as Partial<UpdateCheckResult> as UpdateCheckResult);

    expect(await aboutDetails()).toMatchObject({
      updateExists: true,
      updateVersion: '2.0.0',
    });
  });
});
