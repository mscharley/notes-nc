import { Container } from 'inversify';
import type { interfaces } from 'inversify';
import { MainModule } from '../MainModule';

export const getContainer = (app: Electron.App): interfaces.Container => {
  const container = new Container({
    defaultScope: 'Singleton',
  });

  container.load(MainModule(app));

  return container;
};