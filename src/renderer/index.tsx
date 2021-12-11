import { Application } from './app/Application';
import createCache from '@emotion/cache';
import { ProviderWrapper } from './ProviderWrapper';
import { render } from 'react-dom';

const root = document.querySelector('#root');
if (root == null) {
  window.log.error('Unable to find a root element.');
} else {
  window.log.info('Injecting React into page.');

  (async (): Promise<void> => {
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
