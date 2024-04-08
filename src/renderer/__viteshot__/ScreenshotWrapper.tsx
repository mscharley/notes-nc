import './ScreenshotWrapper.css';
import './mocks';

import CssBaseline from '@mui/material/CssBaseline';
import { generateStore } from '~renderer/redux';
import { Provider as ReduxProvider } from 'react-redux';
import { theme } from '~renderer/theme';
import { ThemeProvider } from '@mui/material/styles';

export const ScreenshotWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
	<ThemeProvider theme={theme}>
		<CssBaseline>
			<ReduxProvider store={generateStore()}>{children}</ReduxProvider>
		</CssBaseline>
	</ThemeProvider>
);
