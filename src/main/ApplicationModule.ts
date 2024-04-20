import { CustomProtocol, ReadyHandler } from '~main/dot/tokens.js';
import { AboutElectron } from '~main/services/AboutElectron.js';
import { Configuration } from '~main/services/Configuration.js';
import { DevTools } from '~main/services/DevTools.js';
import { Entrypoint } from '~main/Entrypoint.js';
import { FileSystem } from '~main/services/FileSystem.js';
import type { interfaces } from '@mscharley/dot';
import { LinuxIntegration } from './services/LinuxIntegration.js';
import log from 'electron-log';
import { MainWindow } from '~main/MainWindow.js';
import { RendererLogging } from '~main/services/RendererLogging.js';
import { SecurityProvider } from '~main/services/SecurityProvider.js';
import { UpdatesProvider } from '~main/services/UpdatesProvider.js';

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
