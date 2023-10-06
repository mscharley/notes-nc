import { CustomProtocol, ReadyHandler } from '~main/inversify/tokens';
import { AboutElectron } from '~main/services/AboutElectron';
import { Configuration } from '~main/services/Configuration';
import { DevTools } from '~main/services/DevTools';
import { Entrypoint } from '~main/Entrypoint';
import { FileSystem } from '~main/services/FileSystem';
import type { interfaces } from '@mscharley/dot';
import { LinuxIntegration } from './services/LinuxIntegration';
import log from 'electron-log';
import { MainWindow } from '~main/MainWindow';
import { RendererLogging } from '~main/services/RendererLogging';
import { SecurityProvider } from '~main/services/SecurityProvider';
import { UpdatesProvider } from '~main/services/UpdatesProvider';

export const ApplicationModule = (): interfaces.SyncContainerModule => (bind) => {
  log.debug('Binding application modules.');

  bind(AboutElectron).inSingletonScope().toSelf();
  bind(ReadyHandler)
    .inSingletonScope()
    .toDynamicValue([AboutElectron], (about) => about);

  bind(Configuration).inSingletonScope().toSelf();
  bind(ReadyHandler)
    .inSingletonScope()
    .toDynamicValue([Configuration], (config) => config);

  bind(DevTools).inSingletonScope().toSelf();
  bind(Entrypoint).inSingletonScope().toSelf();

  bind(FileSystem).inSingletonScope().toSelf();
  bind(CustomProtocol)
    .inSingletonScope()
    .toDynamicValue([FileSystem], (fs) => fs);
  bind(ReadyHandler)
    .inSingletonScope()
    .toDynamicValue([FileSystem], (fs) => fs);

  bind(LinuxIntegration).inSingletonScope().toSelf();
  bind(ReadyHandler)
    .inSingletonScope()
    .toDynamicValue([LinuxIntegration], (linux) => linux);

  bind(MainWindow).inSingletonScope().toSelf();
  bind(ReadyHandler)
    .inSingletonScope()
    .toDynamicValue([MainWindow], (window) => window);

  bind(RendererLogging).inSingletonScope().toSelf();
  bind(ReadyHandler)
    .inSingletonScope()
    .toDynamicValue([RendererLogging], (renderer) => renderer);

  bind(SecurityProvider).inSingletonScope().toSelf();
  bind(ReadyHandler)
    .inSingletonScope()
    .toDynamicValue([SecurityProvider], (security) => security);

  bind(UpdatesProvider).inSingletonScope().toSelf();
  bind(ReadyHandler)
    .inSingletonScope()
    .toDynamicValue([UpdatesProvider], (updates) => updates);
};
