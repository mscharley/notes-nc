import { CustomProtocol, ReadyHandler } from '~main/inversify/tokens';
import { AboutElectron } from '~main/services/AboutElectron';
import { Configuration } from '~main/services/Configuration';
import { ContainerModule } from 'inversify';
import { DevTools } from '~main/services/DevTools';
import { Entrypoint } from '~main/Entrypoint';
import { FileSystem } from '~main/services/FileSystem';
import log from 'electron-log';
import { MainWindow } from '~main/MainWindow';
import { RendererLogging } from '~main/services/RendererLogging';
import { SecurityProvider } from '~main/services/SecurityProvider';
import { tokenBinder } from 'inversify-token';
import { UpdatesProvider } from '~main/services/UpdatesProvider';

export const ApplicationModule = (): ContainerModule =>
  new ContainerModule((bind) => {
    const bindToken = tokenBinder(bind);
    log.debug('Binding application modules.');

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
