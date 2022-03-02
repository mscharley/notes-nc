// Global CSS setup...
import './index.scss';

import createCache from '@emotion/cache';
import { ProviderWrapper } from './ProviderWrapper';
import { render } from 'react-dom';
import { sleep } from '~shared/util';
import { TwoColumnLayout } from '~renderer/layouts/TwoColumnLayout';

const root = document.querySelector('#root');
if (root == null) {
  log.error('Unable to find a root element.');
} else {
  log.debug('Injecting React into page.');

  (async (): Promise<void> => {
    if (await editorApi.isDev) {
      log.info('DEVELOPER MODE: Delaying to allow time for Chromium to connect to a remote debugger');
      root.innerHTML = '<p class="simple-message">Waiting for remote debugger...</p>';
      // eslint-disable-next-line @typescript-eslint/no-magic-numbers
      await sleep(1_000);
    }

    const cache = createCache({
      key: 'prefix',
      nonce: await editorApi.getCspNonce(),
      prepend: true,
    });

    render(
      <ProviderWrapper cache={cache}>
        <TwoColumnLayout />
      </ProviderWrapper>,
      root,
    );
  })().catch((e) => {
    root.innerHTML = `<div class="simple-message"><p>Unable to load application.</p><pre>${e}</pre></div>`;
  });
}
