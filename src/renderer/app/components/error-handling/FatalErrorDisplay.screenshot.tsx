import { FatalErrorDisplay } from './FatalErrorDisplay';
import Paper from '@mui/material/Paper';
import { setFatalError } from '../../features/fatal-errors/errors-slice';
import { useAppDispatch } from '../../hooks';

export const NoError = () => (
  <FatalErrorDisplay>
    <Paper>Hello world!</Paper>
  </FatalErrorDisplay>
);

export const ErrorDisplayed = () => {
  const err = new Error('Uh oh, something failed.');
  useAppDispatch()(
    setFatalError({
      message: err.message,
      stack: err.stack
        ?.replace(/localhost:[0-9]+/gu, 'localhost')
        .replace(/chunk-.*?\.js\?v=[0-9a-f]*?:/gu, 'chunk.js'),
    }),
  );

  return (
    <FatalErrorDisplay>
      <Paper>Hello world!</Paper>
    </FatalErrorDisplay>
  );
};
