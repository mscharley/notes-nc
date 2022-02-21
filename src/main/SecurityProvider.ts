/* eng-disable CSP_GLOBAL_CHECK */

import { ipcMain, session } from 'electron/main';
import { DevTools } from './DevTools';
import { injectable } from 'inversify';
import log from 'electron-log';
import type { OnReadyHandler } from './interfaces/OnReadyHandler';
import { v4 as uuid } from 'uuid';

@injectable()
export class SecurityProvider implements OnReadyHandler {
  public readonly cspNonce = uuid();
  public readonly isCspEnabled: boolean = true;

  public constructor(private readonly devtools: DevTools) {}

  public onAppReady = (): void => {
    if (!this.isCspEnabled) {
      log.warn('DEVELOPER MODE: CSP is disabled, results are potentially not representative of reality');
    } else {
      const csp = {
        'default-src': ['https://cdn.jsdelivr.net/codemirror.spell-checker/'],
        'style-src': ['https://fonts.googleapis.com'],
        'font-src': ['https://fonts.gstatic.com'],
      };

      if (this.devtools.isDev) {
        for (const key of Object.keys(csp) as Array<keyof typeof csp>) {
          csp[key].push(`http://localhost:${process.env.VITE_PORT ?? 5000}`);
          csp[key].push(`ws://localhost:${process.env.VITE_PORT ?? 5000}`);
          csp[key].push("'unsafe-inline'");
        }
      } else {
        csp['default-src'].push(`'nonce-${this.cspNonce}'`);
        csp['style-src'].push("'unsafe-inline'");
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
