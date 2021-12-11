/* eslint-disable @typescript-eslint/no-type-alias */
import type { OnReadyHandler } from './OnReadyHandler';
import { Token } from 'inversify-token';
import type { TokenType } from 'inversify-token';

export const ElectronApp = new Token<Electron.App>('electron.app');
export type ElectronApp = TokenType<typeof ElectronApp>;

export const ReadyHandler = new Token<OnReadyHandler>('electron.app.onReady');
export type ReadyHandler = TokenType<typeof ReadyHandler>;
