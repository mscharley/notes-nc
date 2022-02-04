import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CacheProvider } from '@emotion/react';
import CssBaseline from '@mui/material/CssBaseline';
import { DataProvider } from './DataProvider';
import type { EmotionCache } from '@emotion/cache';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from './store';

const theme = createTheme({});

export interface RootProps {
  cache: EmotionCache;
}

/**
 * The root element that configures all global providers.
 */
export const ProviderWrapper: React.FC<RootProps> = ({ cache, children }) => {
  return (
    <CacheProvider value={cache}>
      <ReduxProvider store={store}>
        <ThemeProvider theme={theme}>
          <CssBaseline>
            <DataProvider>{children}</DataProvider>
          </CssBaseline>
        </ThemeProvider>
      </ReduxProvider>
    </CacheProvider>
  );
};
