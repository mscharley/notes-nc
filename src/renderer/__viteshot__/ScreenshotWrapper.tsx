import './ScreenshotWrapper.css';
import './mocks';

import { CssBaseline } from '@mui/material';
import { generateStore } from '~renderer/redux/index.js';
import { Provider as ReduxProvider } from 'react-redux';
import { theme } from '~renderer/theme.js';
import { ThemeProvider } from '@mui/material/styles';

export const ScreenshotWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
	<ThemeProvider theme={theme}>
		<CssBaseline>
			<ReduxProvider store={generateStore()}>{children}</ReduxProvider>
		</CssBaseline>
	</ThemeProvider>
);
