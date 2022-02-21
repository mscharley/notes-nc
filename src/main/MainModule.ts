import { CustomProtocol, ElectronApp, ReadyHandler } from './inversify/tokens';
import { ContainerModule } from 'inversify';
import { Entrypoint } from './Entrypoint';
import { FileSystem } from './FileSystem';
import { MainWindow } from './MainWindow';
import { RendererLogging } from './RendererLogging';
import { SecurityProvider } from './SecurityProvider';
import { tokenBinder } from 'inversify-token';

export const MainModule = (app: Electron.App): ContainerModule =>
  new ContainerModule((bind) => {
    const bindToken = tokenBinder(bind);

    bind(Entrypoint).toSelf();
    bind(MainWindow).toSelf();
    bindToken(ElectronApp).toConstantValue(app);
    bind(FileSystem).toSelf();
    bindToken(CustomProtocol).toDynamicValue(({ container }) => container.get(FileSystem));
    bindToken(ReadyHandler).toDynamicValue(({ container }) => container.get(FileSystem));
    bindToken(ReadyHandler).to(RendererLogging);
    bind(SecurityProvider).toSelf();
    bindToken(ReadyHandler).toDynamicValue((ctx) => ctx.container.get(SecurityProvider));
  });
