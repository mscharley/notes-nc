import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import { TabPanel } from '../TabPanel';
import Tabs from '@mui/material/Tabs';
import { useState } from 'react';

export interface ConfigurationFormProps {
  initialTab?: number;
}

export const ConfigurationForm: React.FC<ConfigurationFormProps> = ({ initialTab }) => {
  const [value, setValue] = useState(initialTab ?? 0);

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={(_ev, v): void => setValue(v)}>
          <Tab label='Note folders' />
          <Tab label='TBC' />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        Configure note folders here.
      </TabPanel>
      <TabPanel value={value} index={1}>
        Extra configuration coming here soon!
      </TabPanel>
    </Box>
  );
};
