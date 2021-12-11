import createCache from '@emotion/cache';
import { render } from 'react-dom';
import { Root } from './Root';

const root = document.querySelector('#root');
if (root == null) {
  console.error('Unable to find a root element.');
} else {
  console.log('Injecting into page.', root);

  window.cdkEditor
    .getCspNonce()
    .then((nonce) => {
      const cache = createCache({
        key: 'prefix',
        nonce,
        prepend: true,
      });

      render(<Root cache={cache} />, root);
    })
    .catch((e) => {
      root.innerHTML = `Unable to load application.<br/><pre>${e}</pre>`;
    });
}
