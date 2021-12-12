import { Application } from './app/Application';
import createCache from '@emotion/cache';
import { ProviderWrapper } from './ProviderWrapper';
import { render } from 'react-dom';
import { sleep } from '../shared/util';

const root = document.querySelector('#root');
if (root == null) {
  window.log.error('Unable to find a root element.');
} else {
  window.log.info('Injecting React into page.');

  (async (): Promise<void> => {
    if (await window.cdkEditor.isDev) {
      window.log.info(
        'DEVELOPER MODE: Delaying to allow time for Chromium to connect to a remote debugger',
      );
      root.innerHTML = '<p>Waiting for remote debugger...</p>';
      // eslint-disable-next-line @typescript-eslint/no-magic-numbers
      await sleep(1_000);
    }

    const cache = createCache({
      key: 'prefix',
      nonce: await window.cdkEditor.getCspNonce(),
      prepend: true,
    });

    render(
      <ProviderWrapper cache={cache}>
        <Application />
      </ProviderWrapper>,
      root,
    );
  })().catch((e) => {
    root.innerHTML = `<p>Unable to load application.</p><br/><pre>${e}</pre>`;
  });
}
