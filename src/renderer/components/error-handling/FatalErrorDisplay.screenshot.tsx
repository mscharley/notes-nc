import { FatalErrorDisplay } from './FatalErrorDisplay';
import Paper from '@mui/material/Paper';
import { setFatalError } from '~renderer/redux';
import { useAppDispatch } from '~renderer/hooks';

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
