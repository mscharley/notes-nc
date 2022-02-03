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
  public readonly isCspEnabled: boolean = true;

  public onAppReady = (): void => {
    if (!this.isCspEnabled) {
      log.warn('DEVELOPER MODE: CSP is disabled to prevent interactions with dev tools.');
    } else {
      const csp = {
        'default-src': [`'nonce-${this.cspNonce}'`, 'https://cdn.jsdelivr.net/codemirror.spell-checker/'],
        'style-src': ["'unsafe-inline'", 'https://fonts.googleapis.com'],
        'font-src': ['https://fonts.gstatic.com'],
      };
      const cspString = Object.entries(csp)
        .map(([type, sources]) => `${type} ${sources.join(' ')};`)
        .join(' ');

      session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
        callback({
          responseHeaders: {
            ...details.responseHeaders,
            'Content-Security-Policy': [cspString],
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
