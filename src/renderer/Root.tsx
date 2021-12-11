import { createTheme, ThemeProvider } from '@mui/material/styles';
import Button from '@mui/material/Button';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import CssBaseline from '@mui/material/CssBaseline';
import type { EmotionCache } from '@emotion/cache';

const theme = createTheme({});

export const Root: React.FC<{ cache: EmotionCache }> = (props) => {
  return (
    <CacheProvider value={props.cache}>
      <ThemeProvider theme={theme}>
        <CssBaseline>
          <div>
            Hello world!
            <Button color='primary' variant='contained'>
              &gt;&gt;
            </Button>
          </div>
        </CssBaseline>
      </ThemeProvider>
    </CacheProvider>
  );
};
