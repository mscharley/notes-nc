import { closeCurrentFile, setFatalError } from '~renderer/redux';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { noop } from '~shared/util';
import Typography from '@mui/material/Typography';
import { useAppSelector } from '~renderer/hooks';
import { useDispatch } from 'react-redux';

export interface DeleteConfirmationDialogProps {
	open: boolean;
	onClose?: (event: unknown, reason: 'escapeKeyDown' | 'backdropClick' | 'closeButtonClick') => void;
}

export const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({ open, onClose = noop }) => {
	const dispatch = useDispatch();
	const fileToDelete = useAppSelector((s) => s.overlay.currentFileDeletion);

	const handleDelete = (): void => {
		if (fileToDelete == null) {
			return;
		}

		fetch(fileToDelete.url, {
			method: 'DELETE',
		})
			.then(() => {
				onClose(null, 'closeButtonClick');
				dispatch(closeCurrentFile());
			})
			.catch((e) => dispatch(setFatalError(e)));
	};

	return (
		<Dialog open={open} onClose={onClose} fullWidth={true} maxWidth="sm">
			<DialogTitle>Are you sure?</DialogTitle>
			<DialogContent>
				<Typography>
					Are you sure you want to delete the
					{fileToDelete?.displayName}
					{' '}
					note?
				</Typography>
			</DialogContent>
			<DialogActions>
				<Button variant="contained" color="primary" onClick={handleDelete}>
					Delete
				</Button>
				<Button color="primary" onClick={(): void => onClose({}, 'closeButtonClick')}>
					Cancel
				</Button>
			</DialogActions>
		</Dialog>
	);
};
