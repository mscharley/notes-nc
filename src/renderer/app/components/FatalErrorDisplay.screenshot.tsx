import { FatalErrorDisplay } from './FatalErrorDisplay';
import Paper from '@mui/material/Paper';
import { setFatalError } from '../features/fatal-errors/errors-slice';
import { useAppDispatch } from '../hooks';

export const NoError = () => (
  <FatalErrorDisplay>
    <Paper>Hello world!</Paper>
  </FatalErrorDisplay>
);

export const ErrorDisplayed = () => {
  useAppDispatch()(setFatalError(new Error('Uh oh, something failed.')));

  return (
    <FatalErrorDisplay>
      <Paper>Hello world!</Paper>
    </FatalErrorDisplay>
  );
};
