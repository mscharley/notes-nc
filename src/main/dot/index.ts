import { ApplicationModule } from '~main/ApplicationModule.js';
import { createContainer } from '@mscharley/dot';
import { ElectronModule } from '~main/dot/ElectronModule.js';
import type { interfaces } from '@mscharley/dot';

export const getContainer = (app: Electron.App): interfaces.Container => {
	const container = createContainer({
		defaultScope: 'singleton',
	});

	container.load(ElectronModule(app));
	container.load(ApplicationModule());

	container.validate();

	return container;
};
