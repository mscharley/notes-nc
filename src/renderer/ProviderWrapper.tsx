import { CacheProvider } from '@emotion/react';
import CssBaseline from '@mui/material/CssBaseline';
import { DataProvider } from './DataProvider';
import type { EmotionCache } from '@emotion/cache';
import { ErrorWrapper } from './app/components/error-handling/ErrorWrapper';
import { KeyboardShortcuts } from './KeyboardShortcuts';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from './store';
import { theme } from './theme';
import { ThemeProvider } from '@mui/material/styles';

export interface RootProps {
  cache: EmotionCache;
}

/**
 * The root element that configures all global providers.
 */
export const ProviderWrapper: React.FC<RootProps> = ({ cache, children }) => {
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
