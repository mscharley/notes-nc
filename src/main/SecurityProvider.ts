/* eng-disable CSP_GLOBAL_CHECK */

import { ipcMain, session } from 'electron/main';
import { injectable } from 'inversify';
import type { OnReadyHandler } from './OnReadyHandler';
import { v4 as uuid } from 'uuid';

@injectable()
export class SecurityProvider implements OnReadyHandler {
  public readonly cspNonce = uuid();

  public onAppReady = (): void => {
    session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
      callback({
        responseHeaders: {
          ...details.responseHeaders,
          'Content-Security-Policy': [
            `default-src 'self' 'nonce-${this.cspNonce}' https://fonts.googleapis.com https://fonts.gstatic.com;`,
          ],
        },
      });
    });

    ipcMain.handle('csp-nonce', () => {
      return this.cspNonce;
    });
  };
}
