import { closeCurrentFile, setActiveOverlay, setFatalError, setFileListing } from '~renderer/redux';
import { useAppDispatch, useAppSelector, useDebouncedState } from '~renderer/hooks';
import cn from 'classnames';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import RefreshIcon from '@mui/icons-material/Refresh';
import SettingsIcon from '@mui/icons-material/SettingsSharp';
import { styled } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';

export interface SidebarFooterProps {
  width: string;
}

const SpinningRefreshIcon = styled(RefreshIcon)`
  &.spin {
    animation-name: spin;
    animation-duration: 1s;
    animation-timing-function: linear;
  }
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

export const SidebarFooter: React.FC<SidebarFooterProps> = ({ width }) => {
  const dispatch = useAppDispatch();
  const currentFile = useAppSelector((s) => s.files.currentFile);
  const [spinning, setSpinning, flushSpinning] = useDebouncedState(false, 1_000);

  const handleRefresh: React.MouseEventHandler = () => {
    setSpinning(true);
    flushSpinning();

    editorApi
      .listNoteFiles()
      .then((fs) => {
        dispatch(setFileListing(fs));

        const newFiles = Object.values(fs)
          .flatMap((f) => f.categories)
          .flatMap((c) => c.files);
        if (newFiles.find((f) => f.url === currentFile?.url) == null) {
          // Currently editing file no longer exists...
          dispatch(closeCurrentFile());
        }

        setSpinning(false);
      })
      .catch((e: unknown) => {
        dispatch(setFatalError(e));
      });
  };

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
          <SettingsIcon />
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
      <Tooltip title='Refresh notes list'>
        <IconButton onClick={handleRefresh}>
          <SpinningRefreshIcon className={cn({ spin: spinning })} />
        </IconButton>
      </Tooltip>
    </Paper>
  );
};
