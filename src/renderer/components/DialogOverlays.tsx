import { useAppDispatch, useAppSelector } from '~renderer/hooks';
import { AboutDialog } from '~renderer/components/AboutDialog';
import { closeOverlay } from '~renderer/redux';
import { ConfigurationDialog } from '~renderer/components/configuration/ConfigurationDialog';
import { DeleteConfirmationDialog } from './sidebar/DeleteConfirmationDialog';

export const DialogOverlays: React.FC = () => {
	const dispatch = useAppDispatch();
	const openDialog = useAppSelector((s) => s.overlay.activeOverlay);

	return (
		<>
			<AboutDialog
				open={openDialog === 'about'}
				onClose={(): void => {
					dispatch(closeOverlay('about'));
				}}
			/>
			<ConfigurationDialog
				open={openDialog === 'configuration'}
				onClose={(): void => {
					dispatch(closeOverlay('configuration'));
				}}
			/>
			<DeleteConfirmationDialog
				open={openDialog === 'delete'}
				onClose={(): void => {
					dispatch(closeOverlay('delete'));
				}}
			/>
		</>
	);
};
