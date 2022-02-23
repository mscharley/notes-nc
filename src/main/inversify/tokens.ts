/* eslint-disable @typescript-eslint/no-type-alias */

import type { Dialog, IpcMain } from 'electron/main';
import type { CustomProtocolProvider } from '../interfaces/CustomProtocolProvider';
import type { OnReadyHandler } from '../interfaces/OnReadyHandler';
import { Token } from 'inversify-token';
import type { TokenType } from 'inversify-token';

export const ElectronApp = new Token<Electron.App>('electron.app');
export type ElectronApp = TokenType<typeof ElectronApp>;

export const ElectronDialog = new Token<Dialog>('electron.dialog');
export type ElectronDialog = TokenType<typeof ElectronDialog>;

export const ElectronIpcMain = new Token<IpcMain>('electron.ipcMain');
export type ElectronIpcMain = TokenType<typeof ElectronIpcMain>;

export const CustomProtocol = new Token<CustomProtocolProvider>('editor.custom-protocol');
export type CustomProtocol = TokenType<typeof CustomProtocol>;

export const ReadyHandler = new Token<OnReadyHandler>('electron.app.onReady');
export type ReadyHandler = TokenType<typeof ReadyHandler>;
