import { CacheProvider } from '@emotion/react';
import CssBaseline from '@mui/material/CssBaseline';
import { DataProvider } from './DataProvider';
import type { EmotionCache } from '@emotion/cache';
import { ErrorWrapper } from './components/error-handling/ErrorWrapper';
import { KeyboardShortcuts } from './KeyboardShortcuts';
import { Provider as ReduxProvider } from 'react-redux';
import type { Store } from './redux';
import { theme } from './theme';
import { ThemeProvider } from '@mui/material/styles';

export interface RootProps {
  cache: EmotionCache;
  store: Store;
}

/**
 * The root element that configures all global providers.
 */
export const ProviderWrapper: React.FC<RootProps> = ({ cache, children, store }) => {
  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ReduxProvider store={store}>
          <ErrorWrapper>
            <DataProvider>
              <KeyboardShortcuts>{children}</KeyboardShortcuts>
            </DataProvider>
          </ErrorWrapper>
        </ReduxProvider>
      </ThemeProvider>
    </CacheProvider>
  );
};
