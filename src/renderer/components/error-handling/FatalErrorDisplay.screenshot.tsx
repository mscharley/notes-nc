import { FatalErrorDisplay } from './FatalErrorDisplay.js';
import { Paper } from '@mui/material';
import { setFatalError } from '~renderer/redux/index.js';
import { useAppDispatch } from '~renderer/hooks/index.js';

export const NoError = () => (
	<FatalErrorDisplay>
		<Paper>Hello world!</Paper>
	</FatalErrorDisplay>
);

export const ErrorDisplayed = () => {
	const err = new RangeError('Uh oh, something failed.');
	useAppDispatch()(
		setFatalError({
			name: err.name,
			message: err.message,
			stack: `${err.name}: ${err.message}\n    at ErrorDisplayed (FatalErrorDisplay.screenshot.tsx)\n    at RandomBacktrace (vite.js)`,
		}),
	);

	return (
		<FatalErrorDisplay>
			<Paper>Hello world!</Paper>
		</FatalErrorDisplay>
	);
};
