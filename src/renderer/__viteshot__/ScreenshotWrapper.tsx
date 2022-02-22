import CssBaseline from '@mui/material/CssBaseline';
import { generateStore } from '../store';
import { Provider as ReduxProvider } from 'react-redux';
import { theme } from '../theme';
import { ThemeProvider } from '@mui/material/styles';

export const ScreenshotWrapper: React.FC = ({ children }) => (
  <ThemeProvider theme={theme}>
    <CssBaseline>
      <ReduxProvider store={generateStore()}>{children}</ReduxProvider>
    </CssBaseline>
  </ThemeProvider>
);
