import { ApplicationModule } from '~main/ApplicationModule';
import { Container } from 'inversify';
import { ElectronModule } from '~main/inversify/ElectronModule';
import type { interfaces } from 'inversify';

export const getContainer = (app: Electron.App): interfaces.Container => {
  const container = new Container({
    defaultScope: 'Singleton',
  });

  container.load(ElectronModule(app), ApplicationModule());

  return container;
};
