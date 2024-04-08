import Button from '@mui/material/Button';
import { ConfigurationForm } from './ConfigurationForm';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { noop } from '~shared/util';

export interface ConfigurationDialogProps {
	open: boolean;
	onClose?: (event: unknown, reason: 'escapeKeyDown' | 'backdropClick' | 'okButtonClick') => void;
}

export const ConfigurationDialog: React.FC<ConfigurationDialogProps> = ({ open, onClose = noop }) => {
	return (
		<Dialog
			fullWidth={true}
			maxWidth="md"
			open={open}
			scroll="paper"
			onClose={onClose}
			sx={{ '> .MuiDialog-container': { alignItems: 'flex-start' } }}
		>
			<DialogContent>
				<ConfigurationForm />
			</DialogContent>
			<DialogActions>
				<Button variant="contained" onClick={(): void => onClose(null, 'okButtonClick')}>
					Close
				</Button>
			</DialogActions>
		</Dialog>
	);
};
