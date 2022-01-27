/* eng-disable CSP_GLOBAL_CHECK */

import { ipcMain, session } from 'electron/main';
import { injectable } from 'inversify';
import { isDev } from './dev/attemptInstallDevTools';
import log from 'electron-log';
import type { OnReadyHandler } from './interfaces/OnReadyHandler';
import { v4 as uuid } from 'uuid';

@injectable()
export class SecurityProvider implements OnReadyHandler {
  public readonly cspNonce = uuid();
  // Easier feature toggle for CSP specifically.
  public readonly isCspEnabled = !isDev;

  public onAppReady = (): void => {
    if (!this.isCspEnabled) {
      log.warn('DEVELOPER MODE: CSP is disabled to prevent interactions with dev tools.');
    } else {
      session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
        callback({
          responseHeaders: {
            ...details.responseHeaders,
            'Content-Security-Policy': [
              `default-src 'self' 'nonce-${this.cspNonce}' https://cdn.jsdelivr.net/codemirror.spell-checker/ https://fonts.googleapis.com https://fonts.gstatic.com`,
            ],
          },
        });
      });
    }

    ipcMain.handle('is-dev', () => isDev);
    ipcMain.handle('is-csp-enabled', () => this.isCspEnabled);
    ipcMain.handle('csp-nonce', () => {
      return this.cspNonce;
    });
  };
}
