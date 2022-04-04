import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import { noop } from '~shared/util';
import { SpinningRefreshIcon } from './SpinningRefreshIcon';
import Typography from '@mui/material/Typography';
import { useAppSelector } from '~renderer/hooks';

export interface AboutDialogProps {
  open: boolean;
  onClose?: (event: unknown, reason: 'escapeKeyDown' | 'backdropClick' | 'closeButtonClick') => void;
}

export const AboutDialog: React.FC<AboutDialogProps> = ({ open, onClose = noop }) => {
  const details = useAppSelector((s) => s.about.details);
  const updates = useAppSelector((s) => s.updates.status) ?? {
    canCheckForUpdates: false,
    checkingForUpdate: false,
    updateDownloaded: false,
    updateExists: false,
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth={true} maxWidth={'sm'}>
      <DialogTitle>About Notes</DialogTitle>
      <DialogContent>
        {details == null ? (
          <CircularProgress />
        ) : (
          <>
            <Typography paragraph>
              <strong>Version:</strong>
              {` ${details.version}${details.isDevBuild ? ' (dev)' : ''}`}
              {updates.updateDownloaded ? (
                <> - update to {updates.updateVersion} by restarting the application.</>
              ) : updates.updateExists ? (
                <> - update to {updates.updateVersion} downloading...</>
              ) : updates.canCheckForUpdates ? (
                <>
                  <IconButton onClick={(): void => window.editorApi.checkForUpdates()}>
                    <SpinningRefreshIcon spinning={updates.checkingForUpdate} />
                  </IconButton>
                  Check for updates
                </>
              ) : (
                ''
              )}
              <br />
              <strong>Electron Version:</strong>
              {` ${details.electronVersion}`}
            </Typography>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={(): void => {
            window.location.replace('https://github.com/mscharley/notes-nc/discussions');
          }}
        >
          Get help
        </Button>
        <Button variant='contained' color='primary' onClick={(): void => onClose({}, 'closeButtonClick')}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
