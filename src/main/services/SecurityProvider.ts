/* eng-disable CSP_GLOBAL_CHECK */

import { inject, injectable } from 'inversify';
import { ipcMain, session } from 'electron/main';
import { DEFAULT_VITE_PORT } from '~shared/defaults';
import { DevTools } from '~main/services/DevTools';
import log from 'electron-log';
import type { OnReadyHandler } from '~main/interfaces/OnReadyHandler';
import { v4 as uuid } from 'uuid';

@injectable()
export class SecurityProvider implements OnReadyHandler {
  public readonly cspNonce = uuid();
  public readonly isCspEnabled: boolean = true;

  public constructor(@inject(DevTools) private readonly devtools: DevTools) {}

  public onAppReady = (): void => {
    if (!this.isCspEnabled) {
      log.warn('DEVELOPER MODE: CSP is disabled, results are potentially not representative of reality');
    } else {
      const csp = {
        'default-src': ['https://cdn.jsdelivr.net/codemirror.spell-checker/'],
        'style-src': ['https://fonts.googleapis.com', "'unsafe-inline'"],
        'font-src': ['https://fonts.gstatic.com'],
      };

      if (this.devtools.isDev) {
        const extensionIds = this.devtools.devExtensionIds();
        for (const key of Object.keys(csp) as Array<keyof typeof csp>) {
          csp[key].push(`http://localhost:${process.env.VITE_PORT ?? DEFAULT_VITE_PORT}`);
          csp[key].push(`ws://localhost:${process.env.VITE_PORT ?? DEFAULT_VITE_PORT}`);
          extensionIds.forEach((id) => csp[key].push(`chrome-extension://${id}`));
          csp[key].push("'unsafe-inline'");
        }
      } else {
        csp['default-src'].push(`'nonce-${this.cspNonce}'`);
      }

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

    ipcMain.handle('is-dev', () => this.devtools.isDev);
    ipcMain.handle('is-csp-enabled', () => this.isCspEnabled);
    ipcMain.handle('csp-nonce', () => {
      return this.cspNonce;
    });
  };
}
