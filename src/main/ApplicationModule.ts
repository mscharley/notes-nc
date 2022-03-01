import { CustomProtocol, ReadyHandler } from './inversify/tokens';
import { AboutElectron } from './services/AboutElectron';
import { Configuration } from './services/Configuration';
import { ContainerModule } from 'inversify';
import { DevTools } from './services/DevTools';
import { Entrypoint } from './Entrypoint';
import { FileSystem } from './services/FileSystem';
import { MainWindow } from './MainWindow';
import { RendererLogging } from './services/RendererLogging';
import { SecurityProvider } from './services/SecurityProvider';
import { tokenBinder } from 'inversify-token';
import { UpdatesProvider } from './services/UpdatesProvider';

export const ApplicationModule = (): ContainerModule =>
  new ContainerModule((bind) => {
    const bindToken = tokenBinder(bind);

    bind(Configuration).toSelf();
    bind(Entrypoint).toSelf();

    bind(DevTools).toSelf();

    bind(AboutElectron).toSelf();
    bindToken(ReadyHandler).toDynamicValue(({ container }) => container.get(AboutElectron));

    bind(FileSystem).toSelf();
    bindToken(CustomProtocol).toDynamicValue(({ container }) => container.get(FileSystem));
    bindToken(ReadyHandler).toDynamicValue(({ container }) => container.get(FileSystem));

    bind(MainWindow).toSelf();
    bindToken(ReadyHandler).toDynamicValue(({ container }) => container.get(MainWindow));

    bind(RendererLogging).toSelf();
    bindToken(ReadyHandler).toDynamicValue(({ container }) => container.get(RendererLogging));

    bind(SecurityProvider).toSelf();
    bindToken(ReadyHandler).toDynamicValue(({ container }) => container.get(SecurityProvider));

    bind(UpdatesProvider).toSelf();
    bindToken(ReadyHandler).toDynamicValue(({ container }) => container.get(UpdatesProvider));
  });
