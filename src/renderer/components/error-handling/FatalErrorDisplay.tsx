import { useCallback, useEffect } from 'react';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import FloatingActionButton from '@mui/material/Fab';
import Refresh from '@mui/icons-material/Refresh';
import ReportIcon from '@mui/icons-material/Report';
import { useAppSelector } from '~renderer/hooks';

export interface FatalErrorDisplayProps {
  overrideError?: Error;
}

export const FatalErrorDisplay: React.FC<FatalErrorDisplayProps> = ({ overrideError, children }) => {
  const stateError = useAppSelector((state) => state.fatalError.err);
  const error = overrideError ?? stateError;

  useEffect(() => {
    if (error != null) {
      window.log.error(error);
    }
  }, [error]);

  const reportBug = useCallback(() => {
    const url = new URL('https://github.com/mscharley/notes-nc/issues/new');
    url.searchParams.append('labels', 'bug');
    url.searchParams.append('title', `[BUG] ${error?.message}`);
    url.searchParams.append(
      'body',
      '### Reported from the error page:\n\n' +
        '**What were you doing when the error occurred?**\n\n' +
        '<!-- Please include any information that might be helpful -->\n\n' +
        `\`\`\`\n${error?.stack}\n\`\`\``,
    );

    window.location.replace(url);
  }, [error]);

  if (error != null) {
    return (
      <Alert severity='error' sx={{ flexGrow: 1, minHeight: '100%' }}>
        <AlertTitle>{error.message}</AlertTitle>
        <pre style={{ whiteSpace: 'pre-wrap', marginBottom: '5em' }}>{`${error.stack}`}</pre>
        <div style={{ position: 'fixed', bottom: 16, right: 16 }}>
          <FloatingActionButton variant='extended' onClick={(): void => window.location.reload()}>
            <Refresh sx={{ marginRight: 1 }} /> Reload
          </FloatingActionButton>
          <FloatingActionButton variant='extended' color='error' sx={{ marginLeft: 3 }} onClick={reportBug}>
            <ReportIcon sx={{ marginRight: 1 }} /> Report bug
          </FloatingActionButton>
        </div>
      </Alert>
    );
  } else {
    return <>{children}</>;
  }
};
