import { ElectronApp, ReadyHandler } from './tokens';
import { ContainerModule } from 'inversify';
import { HelloWorld } from './HelloWorld';
import { Main } from './Main';
import { tokenBinder } from 'inversify-token';

export const MainModule = (app: Electron.App): ContainerModule =>
  new ContainerModule((bind) => {
    const bindToken = tokenBinder(bind);

    bind(Main).toSelf();
    bindToken(ElectronApp).toConstantValue(app);
    bindToken(ReadyHandler).to(HelloWorld);
  });
