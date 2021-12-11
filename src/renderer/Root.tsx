import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Application } from './Application';
import { CacheProvider } from '@emotion/react';
import CssBaseline from '@mui/material/CssBaseline';
import type { EmotionCache } from '@emotion/cache';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from './app/store';

const theme = createTheme({});

export interface RootProps {
  cache: EmotionCache;
}

export const Root: React.FC<RootProps> = (props) => {
  return (
    <CacheProvider value={props.cache}>
      <ReduxProvider store={store}>
        <ThemeProvider theme={theme}>
          <CssBaseline>
            <Application />
          </CssBaseline>
        </ThemeProvider>
      </ReduxProvider>
    </CacheProvider>
  );
};
