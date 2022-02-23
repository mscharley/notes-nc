import { ConfigurationDialog } from './configuration/ConfigurationDialog';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Settings from '@mui/icons-material/SettingsSharp';
import { useState } from 'react';

export const SidebarFooter: React.FC = () => {
  const [configOpen, setConfigOpen] = useState(false);

  return (
    <Paper>
      <IconButton onClick={(): void => setConfigOpen(true)}>
        <Settings />
      </IconButton>
      <ConfigurationDialog open={configOpen} onClose={(): void => setConfigOpen(false)} />
    </Paper>
  );
};
