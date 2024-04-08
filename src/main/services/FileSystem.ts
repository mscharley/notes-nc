/* eng-disable PROTOCOL_HANDLER_JS_CHECK */

import * as http from '~shared/http';
import type { CategoryDescription, FileDescription, FolderConfiguration, FolderDescription } from '~shared/model';
import { ElectronApp, ElectronIpcMain } from '~main/dot/tokens';
import { mkdirp, readdir, rename, rmdir, stat, unlink, writeFile } from 'fs-extra';
import type { Protocol, ProtocolResponse } from 'electron/main';
import { Configuration } from '~main/services/Configuration';
import type { CustomProtocolProvider } from '~main/interfaces/CustomProtocolProvider';
import { injectable } from '@mscharley/dot';
import log from 'electron-log';
import { MainWindow } from '~main/MainWindow';
import type { OnReadyHandler } from '~main/interfaces/OnReadyHandler';
import path from 'path';

const matchMarkdownSuffix = /\.(?:md|markdown)/u;

@injectable(ElectronApp, ElectronIpcMain, MainWindow, Configuration)
export class FileSystem implements CustomProtocolProvider, OnReadyHandler {
	private readonly appBasePath: string;
	private readonly errorBasePath: string;
	private readonly folderPrefixes: Array<[string, string]>;
	private folders: Record<string, { name: string; localPath: string }>;

	public constructor(
		application: ElectronApp,
		private readonly ipcMain: ElectronIpcMain,
		private readonly mainWindow: MainWindow,
		private readonly configuration: Configuration,
	) {
		this.appBasePath = path.join(application.getAppPath(), 'ts-build');
		this.errorBasePath = path.join(application.getAppPath(), 'share/static');
		this.folderPrefixes = [...configuration.folderPrefixes];
		this.folderPrefixes.sort(([a], [b]) => b.length - a.length);

		this.folders = configuration.foldersByUuid;
		configuration.onChange(() => {
			(async (): Promise<void> => {
				this.folders = configuration.foldersByUuid;
				await this.republishFileList();
			})().catch((e) => {
				log.error(e);
			});
		});
	}

	public readonly privilegedSchemes: Electron.CustomScheme[] = [
		{
			scheme: 'app',
			privileges: {
				bypassCSP: true,
				standard: true,
				secure: true,
			},
		},
		{
			scheme: 'editor',
			privileges: {
				bypassCSP: true,
				standard: true,
				secure: true,
				supportFetchAPI: true,
			},
		},
	];

	public readonly registerProtocols = (protocol: Protocol): void => {
		log.debug('Registering the app:// scheme.');
		protocol.registerFileProtocol('app', (request, cb) => {
			const url = new URL(request.url);
			if (!['renderer'].includes(url.hostname)) {
				return cb({
					statusCode: http.NOT_FOUND,
					path: path.join(this.errorBasePath, '404.txt'),
				});
			}
			if (request.method === 'GET') {
				return cb(
					this.serveLocalFile(path.join(this.appBasePath, url.hostname), decodeURIComponent(url.pathname), request.url),
				);
			} else {
				return cb({
					statusCode: http.BAD_REQUEST,
					path: path.join(this.errorBasePath, '400.txt'),
				});
			}
		});
		log.debug('Registering the editor:// scheme.');
		protocol.registerFileProtocol('editor', (request, cb): void => {
			(async (): Promise<void> => {
				const url = new URL(request.url);
				const dir = this.folders[url.hostname];

				// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
				if (dir == null) {
					return cb({
						statusCode: http.BAD_REQUEST,
						path: path.join(this.errorBasePath, '400.txt'),
					});
				}

				switch (request.method) {
					case 'GET':
						return cb(this.serveLocalFile(dir.localPath, decodeURIComponent(url.pathname), request.url));
					case 'PUT':
						if (request.uploadData == null) {
							return cb({
								statusCode: http.BAD_REQUEST,
								path: path.join(this.errorBasePath, '400.txt'),
							});
						}

						return cb(
							await this.saveLocalFile(
								dir.localPath,
								decodeURI(url.pathname),
								request.url,
								(request.uploadData[0] ?? { bytes: '' }).bytes.toString('utf-8'),
							),
						);
					case 'DELETE':
						return cb(await this.deleteLocalFile(dir.localPath, decodeURI(url.pathname), request.url));
					default:
						return cb({
							statusCode: http.BAD_REQUEST,
							path: path.join(this.errorBasePath, '400.txt'),
						});
				}
			})().catch((e) => log.error(e));
		});
	};

	public readonly onAppReady = (): void | Promise<void> => {
		this.ipcMain.handle('list-files', this.listFiles);
		this.ipcMain.handle('rename-file', this.renameFile);
		this.ipcMain.handle('add-category', this.addCategory);
		// eslint-disable-next-line @typescript-eslint/require-await
		this.ipcMain.handle('add-folder', async (_ev, name: string, localPath: string): Promise<void> => {
			this.configuration.addFolder(name, localPath);
		});
		this.ipcMain.handle('delete-category', this.deleteCategory);
		// eslint-disable-next-line @typescript-eslint/require-await
		this.ipcMain.handle('delete-folder', async (_ev, uuid: string): Promise<void> => {
			this.configuration.deleteFolder(uuid);
		});
	};

	private readonly listFiles = async (): Promise<FolderConfiguration> =>
		Object.fromEntries(
			await Promise.all(
				Object.entries(this.folders).map(
					async ([uuid, { name, localPath }]): Promise<[string, FolderDescription]> => [
						name,
						{
							uuid,
							name,
							localPath: localPath,
							displayPath: this.generateDisplayPath(localPath),
							baseUrl: `editor://${uuid}`,
							categories: await this.generateFolder(uuid, localPath, '').catch((e) => {
								log.error(e);
								return [];
							}),
						},
					],
				),
			),
		);

	private readonly renameFile = async (
		_ev: unknown,
		file: FileDescription,
		displayName: string,
	): Promise<null | FileDescription> => {
		if (file.displayName === displayName) {
			return file;
		}

		// otherwise...
		const url = new URL(file.url);
		const dir = this.folders[url.hostname];
		const oldFileName = path.join(dir.localPath, decodeURIComponent(url.pathname));
		const suffix = oldFileName.match(matchMarkdownSuffix) ?? ['.md'];
		const newFileName = path.resolve(oldFileName, `../${displayName}${suffix[0]}`);
		log.debug(`RENAME ${oldFileName} => ${newFileName}`);
		await rename(oldFileName, newFileName);
		await this.republishFileList();
		url.pathname = path.resolve(url.pathname, `../${displayName}.md`);

		return {
			displayName,
			name: `${displayName}.md`,
			url: url.toString(),
		};
	};

	public readonly addCategory = async (_ev: unknown, folderUuid: string, category: string): Promise<void> => {
		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
		if (this.folders[folderUuid] == null) {
			log.warn('Attempted to add category to unknown folder:', folderUuid);
			return;
		}

		await mkdirp(path.resolve(this.folders[folderUuid].localPath, category));
		await this.republishFileList();
	};

	public readonly deleteCategory = async (_ev: unknown, folderUuid: string, categoryPath: string): Promise<void> => {
		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
		if (this.folders[folderUuid] == null) {
			log.warn('Attempted to remove category from unknown folder:', folderUuid);
			return;
		}

		const folderPath = this.folders[folderUuid].localPath;
		const absolutePath = path.resolve(folderPath, categoryPath.substring(1));
		if (folderPath === absolutePath) {
			log.warn('Refusing to delete the uncategorised category from folder:', folderUuid);
		}

		try {
			if (!(await stat(absolutePath)).isDirectory()) {
				log.warn('Requested category is not a directory:', absolutePath);
				return;
			}
		} catch (e: unknown) {
			// If stat fails, then the category already doesn't exist.
			log.warn(e);
			return;
		}

		const files = await readdir(absolutePath);
		await Promise.all(
			files.map(async (f) => {
				await rename(path.resolve(absolutePath, f), path.resolve(folderPath, f));
			}),
		);
		await rmdir(absolutePath);
		await this.republishFileList();
	};

	public readonly generateFolder = async (
		uuid: string,
		basePath: string,
		category: string,
	): Promise<CategoryDescription[]> => {
		const dir = await readdir(path.join(basePath, category), {
			withFileTypes: true,
		});

		const files: FileDescription[] = dir
			.filter((f) => f.isFile() && f.name.match(matchMarkdownSuffix) != null)
			.map((f) => ({
				name: f.name,
				displayName: f.name.replace(matchMarkdownSuffix, ''),
				url: new URL(`editor://${uuid}/${category}/${f.name}`).toString(),
			}));

		const subfolders: CategoryDescription[] = (
			await Promise.all(
				dir
					.filter((f) => f.isDirectory())
					.map(async (f) => this.generateFolder(uuid, basePath, path.join(category, f.name))),
			)
		).flat();

		const description: CategoryDescription
			= category === ''
				? { files, name: 'Uncategorised', path: `/${category}` }
				: { files, name: category, path: `/${category}` };
		return [description, ...subfolders];
	};

	private readonly republishFileList = async (): Promise<void> => {
		const files = await this.listFiles();
		this.mainWindow.send('files-updated', files);
	};

	private readonly serveLocalFile = (basepath: string, filepath: string, url: string): string | ProtocolResponse => {
		const file = path.join(basepath, filepath);
		if (!file.startsWith(basepath)) {
			// Don't allow malicious URL's that try to span the file system.
			log.warn(`Invalid GET request for ${url}`);
			return {
				statusCode: http.BAD_REQUEST,
				path: path.join(this.errorBasePath, '400.txt'),
			};
		} else {
			log.verbose(`GET ${url} => ${file}`);
			return {
				statusCode: http.OK,
				headers: {
					'cache-control': 'no-cache, no-store',
				},
				path: file,
			};
		}
	};

	private readonly saveLocalFile = async (
		basepath: string,
		filepath: string,
		url: string,
		content: string,
	): Promise<string | ProtocolResponse> => {
		const file = path.join(basepath, filepath);
		if (!file.startsWith(basepath)) {
			// Don't allow malicious URL's that try to span the file system.
			log.warn(`Invalid PUT request for ${url}`);
			return {
				statusCode: http.BAD_REQUEST,
				path: path.join(this.errorBasePath, '400.txt'),
			};
		}

		let fileExists = false;
		try {
			fileExists = (await stat(file)).isFile();
		} catch (e: unknown) {
			/* noop */
		}

		log.verbose(`PUT ${url} => ${file}`);
		await writeFile(file, content);
		if (!fileExists) {
			await this.republishFileList();
		}

		return {
			statusCode: http.OK,
			path: path.join(this.errorBasePath, '200.txt'),
		};
	};

	private readonly deleteLocalFile = async (
		basepath: string,
		filepath: string,
		url: string,
	): Promise<string | ProtocolResponse> => {
		const file = path.join(basepath, filepath);
		if (!file.startsWith(basepath)) {
			// Don't allow malicious URL's that try to span the file system.
			log.warn(`Invalid DELETE request for ${url}`);
			return {
				statusCode: http.BAD_REQUEST,
				path: path.join(this.errorBasePath, '400.txt'),
			};
		}

		log.verbose(`DELETE ${url} => ${file}`);
		await unlink(file);
		await this.republishFileList();

		return {
			statusCode: http.OK,
			path: path.join(this.errorBasePath, '200.txt'),
		};
	};

	public readonly generateDisplayPath = (localPath: string): string => {
		for (const [prefix, replacement] of this.folderPrefixes) {
			if (localPath.startsWith(prefix)) {
				return `${replacement}${localPath.substring(prefix.length)}`;
			}
		}

		return localPath;
	};
}
