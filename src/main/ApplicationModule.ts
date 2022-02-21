import { CustomProtocol, ReadyHandler } from './inversify/tokens';
import { Configuration } from './Configuration';
import { ContainerModule } from 'inversify';
import { DevTools } from './DevTools';
import { Entrypoint } from './Entrypoint';
import { FileSystem } from './FileSystem';
import { MainWindow } from './MainWindow';
import { RendererLogging } from './RendererLogging';
import { SecurityProvider } from './SecurityProvider';
import { tokenBinder } from 'inversify-token';

export const ApplicationModule = (): ContainerModule =>
  new ContainerModule((bind) => {
    const bindToken = tokenBinder(bind);

    bind(Configuration).toSelf();
    bind(Entrypoint).toSelf();
    bind(MainWindow).toSelf();

    bind(DevTools).toSelf();

    bind(FileSystem).toSelf();
    bindToken(CustomProtocol).toDynamicValue(({ container }) => container.get(FileSystem));
    bindToken(ReadyHandler).toDynamicValue(({ container }) => container.get(FileSystem));

    bind(RendererLogging).toSelf();
    bindToken(ReadyHandler).toDynamicValue(({ container }) => container.get(RendererLogging));

    bind(SecurityProvider).toSelf();
    bindToken(ReadyHandler).toDynamicValue((ctx) => ctx.container.get(SecurityProvider));
  });
