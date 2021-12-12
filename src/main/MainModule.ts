import { ElectronApp, ReadyHandler } from './tokens';
import { ContainerModule } from 'inversify';
import { Main } from './Main';
import { MainWindow } from './MainWindow';
import { RendererLogging } from './RendererLogging';
import { SecurityProvider } from './SecurityProvider';
import { tokenBinder } from 'inversify-token';

export const MainModule = (app: Electron.App): ContainerModule =>
  new ContainerModule((bind) => {
    const bindToken = tokenBinder(bind);

    bind(Main).toSelf();
    bind(MainWindow).toSelf();
    bind(SecurityProvider).toSelf();
    bindToken(ElectronApp).toConstantValue(app);
    bindToken(ReadyHandler).to(SecurityProvider);
    bindToken(ReadyHandler).to(RendererLogging);
  });
