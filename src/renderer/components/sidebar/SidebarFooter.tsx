import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import { setActiveOverlay } from '~renderer/redux';
import Settings from '@mui/icons-material/SettingsSharp';
import Tooltip from '@mui/material/Tooltip';
import { useAppDispatch } from '~renderer/hooks';

export interface SidebarFooterProps {
  width: string;
}

export const SidebarFooter: React.FC<SidebarFooterProps> = ({ width }) => {
  const dispatch = useAppDispatch();

  return (
    <Paper
      variant='outlined'
      square
      sx={{
        borderLeft: '0',
        borderBottom: '0',
        borderRight: '0',
        position: 'fixed',
        bottom: '0px',
        left: '0px',
        width: width,
        display: 'flex',
        flexDirection: 'row-reverse',
      }}
    >
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
