import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Fab from '@mui/material/Fab';
import Refresh from '@mui/icons-material/Refresh';
import { useAppSelector } from '~renderer/hooks';
import { useEffect } from 'react';

export interface FatalErrorDisplayProps {
  overrideError?: Error;
}

export const FatalErrorDisplay: React.FC<FatalErrorDisplayProps> = ({ overrideError, children }) => {
  const stateError = useAppSelector((state) => state.fatalError.err);
  const error = overrideError ?? stateError;

  useEffect(() => {
    if (error != null) {
      log.error(error);
    }
  }, [error]);

  if (error != null) {
    return (
      <Alert severity='error' sx={{ flexGrow: 1 }}>
        <AlertTitle>{error.message}</AlertTitle>
        <pre style={{ whiteSpace: 'pre-wrap' }}>{`${error.stack}`}</pre>
        <Fab
          variant='extended'
          sx={{ position: 'absolute', bottom: 16, right: 16 }}
          onClick={(): void => window.location.reload()}
        >
          <Refresh sx={{ marginRight: 1 }} /> Reload
        </Fab>
      </Alert>
    );
  } else {
    return <>{children}</>;
  }
};
