import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { FolderTab } from './FolderTab';
import { setFatalError } from '~renderer/redux';
import Tab from '@mui/material/Tab';
import { TabPanel } from '~renderer/components/TabPanel';
import Tabs from '@mui/material/Tabs';
import { useAppSelector } from '~renderer/hooks';
import { useDispatch } from 'react-redux';
import { useState } from 'react';

export enum TabOptions {
  FolderManagement = 'Folder management',
  Linux = 'Linux',
  TBC = 'TBC',
}

export interface ConfigurationFormProps {
  initialTab?: TabOptions;
}

export const ConfigurationForm: React.FC<ConfigurationFormProps> = ({ initialTab }) => {
  const dispatch = useDispatch();
  const isLinux = useAppSelector((s) => s.configuration.isLinux);
  const [selectedTab, setSelectedTab] = useState(initialTab ?? TabOptions.FolderManagement);

  const doInstallation = (): void => {
    editorApi
      .doLinuxInstallation({
        createDesktopEntry: true,
        moveAppImage: true,
      })
      .catch((e) => dispatch(setFatalError(e)));
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={selectedTab} onChange={(_ev, v: TabOptions): void => setSelectedTab(v)}>
          <Tab label='Note folders' value={TabOptions.FolderManagement} />
          {isLinux ? <Tab label='Linux' value={TabOptions.Linux} /> : null}
          <Tab label='TBC' value={TabOptions.TBC} />
        </Tabs>
      </Box>
      <TabPanel name={TabOptions.FolderManagement} hidden={selectedTab !== TabOptions.FolderManagement}>
        <FolderTab />
      </TabPanel>
      <TabPanel name={TabOptions.Linux} hidden={selectedTab !== TabOptions.Linux}>
        <Box sx={{ p: 3 }}>
          <Button variant='contained' onClick={doInstallation}>
            Install desktop integration
          </Button>
        </Box>
      </TabPanel>
      <TabPanel name={TabOptions.TBC} hidden={selectedTab !== TabOptions.TBC}>
        <Box sx={{ p: 3 }}>Extra configuration coming here soon!</Box>
      </TabPanel>
    </Box>
  );
};
