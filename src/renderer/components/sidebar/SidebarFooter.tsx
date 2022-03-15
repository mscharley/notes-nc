import { closeCurrentFile, setActiveOverlay, setFatalError, setFileListing } from '~renderer/redux';
import { useAppDispatch, useAppSelector } from '~renderer/hooks';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import SettingsIcon from '@mui/icons-material/SettingsSharp';
import { SpinningRefreshIcon } from '../SpinningRefreshIcon';
import Tooltip from '@mui/material/Tooltip';
import { useState } from 'react';

export interface SidebarFooterProps {
  width: string;
}

export const SidebarFooter: React.FC<SidebarFooterProps> = ({ width }) => {
  const dispatch = useAppDispatch();
  const [spinning, setSpinning] = useState(false);
  const currentFile = useAppSelector((s) => s.files.currentFile);

  const handleRefresh: React.MouseEventHandler = () => {
    setSpinning(true);

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
          <SpinningRefreshIcon spinning={spinning} />
        </IconButton>
      </Tooltip>
    </Paper>
  );
};
