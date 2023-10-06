import { lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { sleep } from '~shared/util';

const container = document.querySelector('#root');
if (container == null) {
  window.log.error('Unable to find a root element.');
} else {
  window.log.debug('Injecting React into page.');

  try {
    const Application = lazy(async () => {
      const component = import('./Application.js');
      if (await window.editorApi.isDev) {
        window.log.info('DEVELOPER MODE: Delaying to allow time for Chromium to connect to a remote debugger');
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        await sleep(1_000);
      }

      return component;
    });
    const root = createRoot(container);
    root.render(
      <Suspense
        fallback={
          <div className='simple-message'>
            <p>Loading...</p>
          </div>
        }
      >
        <Application />
      </Suspense>,
    );
  } catch (e: unknown) {
    container.innerHTML = `<div class="simple-message"><p>Unable to load application.</p><pre>${e}</pre></div>`;
  }
}
