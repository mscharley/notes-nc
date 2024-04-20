import { CircularProgress, CssBaseline } from '@mui/material';
import { CacheProvider } from '@emotion/react';
import { DataProvider } from './DataProvider.js';
import type { EmotionCache } from '@emotion/cache';
import { ErrorWrapper } from './components/error-handling/ErrorWrapper.js';
import { KeyboardShortcuts } from './KeyboardShortcuts.js';
import { Provider as ReduxProvider } from 'react-redux';
import type { Store } from './redux/index.js';
import { theme } from './theme.js';
import { ThemeProvider } from '@mui/material/styles';

export interface RootProps {
	cache?: EmotionCache;
	children: React.ReactNode;
	store: Store;
}

/**
 * The root element that configures all global providers.
 */
export const ProviderWrapper: React.FC<RootProps> = ({ cache, children, store }) => {
	return cache == null
		? (
			<CircularProgress />
			)
		: (
			<ReduxProvider store={store}>
				<CacheProvider value={cache}>
					<ThemeProvider theme={theme}>
						<CssBaseline />
						<ErrorWrapper>
							<DataProvider>
								<KeyboardShortcuts>{children}</KeyboardShortcuts>
							</DataProvider>
						</ErrorWrapper>
					</ThemeProvider>
				</CacheProvider>
			</ReduxProvider>
			);
};
