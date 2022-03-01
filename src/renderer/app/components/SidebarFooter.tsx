import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import { setActiveOverlay } from '../features/overlay/overlay-slice';
import Settings from '@mui/icons-material/SettingsSharp';
import Tooltip from '@mui/material/Tooltip';
import { useAppDispatch } from '../hooks';

export const SidebarFooter: React.FC = () => {
  const dispatch = useAppDispatch();

  return (
    <Paper sx={{ display: 'flex', flexDirection: 'row-reverse' }}>
      <Tooltip title='Configuration (Ctrl-,)'>
        <IconButton
          onClick={(): void => {
            dispatch(setActiveOverlay('configuration'));
          }}
        >
          <Settings />
        </IconButton>
      </Tooltip>
      <Tooltip title='About'>
        <IconButton
          onClick={(): void => {
            dispatch(setActiveOverlay('about'));
          }}
        >
          <HelpOutlineIcon />
        </IconButton>
      </Tooltip>
    </Paper>
  );
};
