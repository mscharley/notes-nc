import { useAppDispatch, useAppSelector } from '../hooks';
import { AboutDialog } from './AboutDialog';
import { closeOverlay } from '../features/overlay/overlay-slice';
import { ConfigurationDialog } from './configuration/ConfigurationDialog';

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
    </>
  );
};
