import { copyFile, rename, unlink, writeFile } from 'fs/promises';
import { ElectronApp, ElectronIpcMain } from '~main/dot/tokens';
import { injectable } from '@mscharley/dot';
import type { LinuxInstallOptions } from '~shared/model/LinuxInstallOptions';
import log from 'electron-log';
import type { OnReadyHandler } from '~main/interfaces/OnReadyHandler';
import { resolve } from 'path';

@injectable(ElectronApp, ElectronIpcMain)
export class LinuxIntegration implements OnReadyHandler {
	public readonly isAppImage: boolean;

	private readonly XDG_CONFIG_HOME: string;
	private readonly XDG_CACHE_HOME: string;
	private readonly XDG_BIN_HOME: string;
	private readonly XDG_DATA_HOME: string;

	private readonly ICONS_DIR: string;
	private readonly APPLICATIONS_DIR: string;
	private readonly BIN_DIR: string;

	private readonly APPIMAGE: string;
	private readonly installedAppImage: string;
	private readonly isInstalled: boolean;

	public constructor(app: ElectronApp, private readonly ipcMain: ElectronIpcMain) {
		const HOME = app.getPath('home');

		this.XDG_CONFIG_HOME = process.env.XDG_CONFIG_HOME ?? resolve(HOME, '.config');
		this.XDG_CACHE_HOME = process.env.XDG_CACHE_HOME ?? resolve(HOME, '.cache');
		this.XDG_BIN_HOME = process.env.XDG_BIN_HOME ?? resolve(HOME, '.local/bin');
		this.XDG_DATA_HOME = process.env.XDG_DATA_HOME ?? resolve(HOME, '.local/share');

		this.ICONS_DIR = resolve(this.XDG_DATA_HOME, 'icons');
		this.APPLICATIONS_DIR = resolve(this.XDG_DATA_HOME, 'applications');
		this.BIN_DIR = this.XDG_BIN_HOME;

		this.APPIMAGE = process.env.APPIMAGE ?? '';
		this.installedAppImage = resolve(this.XDG_BIN_HOME, 'Notes.AppImage');
		this.isInstalled = this.APPIMAGE === this.installedAppImage;
		this.isAppImage = process.env.APPIMAGE != null;
	}

	public readonly onAppReady = (): void => {
		if (this.isAppImage) {
			this.ipcMain.handle('linux-install', this.doInstallation);
		}
	};

	private readonly doInstallation = async (
		_ev: unknown,
		{ createDesktopEntry, moveAppImage }: LinuxInstallOptions,
	): Promise<void> => {
		if (!this.isAppImage) {
			return;
		}

		log.info('Running Linux installation.');
		const appImage = moveAppImage ? this.installedAppImage : this.APPIMAGE;
		if (moveAppImage) {
			try {
				await rename(this.APPIMAGE, appImage);
			} catch (e: unknown) {
				if ((e as { code?: string }).code === 'EXDEV') {
					// If this is a cross-device move then we need to copy and unlink instead.
					await copyFile(this.APPIMAGE, appImage);
					await unlink(this.APPIMAGE);
				} else {
					throw e;
				}
			}
		}

		if (createDesktopEntry) {
			await writeFile(resolve(this.APPLICATIONS_DIR, 'notes-nc.desktop'), this.generateDesktopEntry(appImage));
		}
	};

	private readonly generateDesktopEntry = (appImage: string): string => `[Desktop Entry]
Type=Application
Name=Notes
Comment=Notes for Nextcloud
Terminal=false
Categories=Utility;
Exec=${appImage}
`;
}
