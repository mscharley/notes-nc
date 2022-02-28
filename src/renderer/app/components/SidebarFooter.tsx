import { AboutDialog } from './AboutDialog';
import { ConfigurationDialog } from './configuration/ConfigurationDialog';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Settings from '@mui/icons-material/SettingsSharp';
import { useState } from 'react';

export const SidebarFooter: React.FC = () => {
  const [configOpen, setConfigOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);

  return (
    <Paper sx={{ display: 'flex', flexDirection: 'row-reverse' }}>
      <IconButton onClick={(): void => setConfigOpen(true)}>
        <Settings />
      </IconButton>
      <IconButton onClick={(): void => setAboutOpen(true)}>
        <HelpOutlineIcon />
      </IconButton>
      <ConfigurationDialog open={configOpen} onClose={(): void => setConfigOpen(false)} />
      <AboutDialog open={aboutOpen} onClose={(): void => setAboutOpen(false)} />
    </Paper>
  );
};
