// Global CSS setup...
import './index.scss';

import { StrictMode, useEffect, useState } from 'react';
import createCache from '@emotion/cache';
import { DialogOverlays } from './components/DialogOverlays';
import type { EmotionCache } from '@emotion/cache';
import { generateStore } from '~renderer/redux';
import { LayoutRouter } from './layouts/LayoutRouter';
import { NotificationsOverlay } from './components/NotificationsOverlay';
import { ProviderWrapper } from './ProviderWrapper';

const Application: React.FC = () => {
  const [cache, setCache] = useState<EmotionCache | undefined>();

  useEffect(() => {
    window.editorApi.cspNonce
      .then((nonce) => setCache(createCache({ key: 'prefix', nonce, prepend: true })))
      .catch((e) => {
        window.log.warn('Unable to load CSP nonce, attempting to load the window anyway...');
        window.log.error(e);
        setCache(createCache({ key: 'prefix', prepend: true }));
      });
  }, []);

  const store = generateStore();

  return (
    <StrictMode>
      <ProviderWrapper cache={cache} store={store}>
        <LayoutRouter />
        <DialogOverlays />
        <NotificationsOverlay />
      </ProviderWrapper>
    </StrictMode>
  );
};

export default Application;
