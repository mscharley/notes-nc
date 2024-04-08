import { BrowserWindow, Menu } from 'electron/main';
import { ElectronDialog, ElectronIpcMain } from '~main/dot/tokens';
import { injectable, unmanaged } from '@mscharley/dot';
import { DEFAULT_VITE_PORT } from '~shared/defaults';
import { DevTools } from '~main/services/DevTools';
import log from 'electron-log';
import type { OnReadyHandler } from '~main/interfaces/OnReadyHandler';
import path from 'path';
import { shell } from 'electron/common';

@injectable(DevTools, ElectronIpcMain, ElectronDialog, unmanaged(Menu))
export class MainWindow implements OnReadyHandler {
	public constructor(
		private readonly devtools: DevTools,
		private readonly ipcMain: ElectronIpcMain,
		private readonly dialog: ElectronDialog,
		private readonly menu: typeof Menu,
	) {}

	private _window?: Electron.BrowserWindow;
	public get window(): Electron.BrowserWindow | undefined {
		return this._window;
	}

	public readonly initialise = async (): Promise<void> => {
		if (this.devtools.isDev) {
			await this.devtools.installDevExtensions();
		}

		this.menu.setApplicationMenu(null);
		this._window = new BrowserWindow({
			// eslint-disable-next-line @typescript-eslint/no-magic-numbers
			width: this.devtools.isDev ? 1524 : 1024,
			height: 768,
			backgroundColor: '#ffffff',
			icon: path.join(__dirname, '../../build/icon.png'),
			webPreferences: {
				contextIsolation: true,
				disableBlinkFeatures: 'Auxclick',
				nodeIntegration: false,
				nodeIntegrationInWorker: false,
				/* eng-disable PRELOAD_JS_CHECK */ preload: path.join(__dirname, './preload.js'),
				sandbox: true,
			},
		});
		this._window.webContents.on('will-navigate', (event, url) => {
			if (!this.isAllowedInternalNavigationUrl(url)) {
				event.preventDefault();
				log.warn('Loading external URL:', url);
				this.tryExternalNavigation(url);
			}
		});
		this._window.webContents.setWindowOpenHandler((details) => {
			if (this.isAllowedInternalNavigationUrl(details.url)) {
				return { action: 'allow' };
			} else {
				this.tryExternalNavigation(details.url);
				return { action: 'deny' };
			}
		});
		this._window.on('closed', this.onClose);

		if (this.devtools.isDev) {
			await this._window.loadURL(`http://localhost:${process.env.VITE_PORT ?? DEFAULT_VITE_PORT}/index.html`);
			this._window.webContents.openDevTools();
		} else {
			await this._window.loadURL('app://renderer/index.html');
		}
	};

	public readonly onAppReady = (): void => {
		this.ipcMain.handle('open-select-folder', async () =>
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			this.dialog.showOpenDialog(this.window!, {
				properties: ['openDirectory', 'createDirectory'],
			}),
		);
	};

	public readonly bringWindowToTop = (): void => {
		if (this.window != null) {
			if (this.window.isMinimized()) {
				this.window.restore();
			}
			this.window.focus();
		}
	};

	public readonly send = (channel: string, ...args: unknown[]): void => {
		this.window?.webContents.send(channel, ...args);
	};

	private readonly isAllowedInternalNavigationUrl = (url: string): boolean => {
		const parsed = new URL(url);

		if (this.devtools.isDev) {
			return parsed.hostname === 'localhost';
		}

		return parsed.protocol === 'app:';
	};

	private readonly tryExternalNavigation = (url: string): void => {
		const parsed = new URL(url);

		if (['http:', 'https:', 'mailto:'].includes(parsed.protocol)) {
			/* eng-disable OPEN_EXTERNAL_JS_CHECK */ shell.openExternal(url).catch((e) => log.error(e));
		} else {
			log.warn(`Invalid external URL attempted to open: ${url}`);
		}
	};

	private readonly onClose = (): void => {
		this._window = undefined;
	};
}
