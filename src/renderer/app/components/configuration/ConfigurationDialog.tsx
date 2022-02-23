import Button from '@mui/material/Button';
import { ConfigurationForm } from './ConfigurationForm';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { noop } from '../../../../shared/util';

export interface ConfigurationDialogProps {
  open: boolean;
  onClose?: (event: unknown, reason: 'escapeKeyDown' | 'backdropClick' | 'okButtonClick') => void;
}

export const ConfigurationDialog: React.FC<ConfigurationDialogProps> = ({ open, onClose = noop }) => {
  return (
    <Dialog fullWidth={true} maxWidth='lg' open={open} scroll='paper' onClose={onClose}>
      <DialogContent>
        <ConfigurationForm />
      </DialogContent>
      <DialogActions>
        <Button onClick={(): void => onClose(null, 'okButtonClick')}>OK</Button>
      </DialogActions>
    </Dialog>
  );
};
