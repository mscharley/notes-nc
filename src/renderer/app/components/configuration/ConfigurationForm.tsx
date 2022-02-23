import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { AddFolder } from './AddFolder';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Delete from '@mui/icons-material/Delete';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { setFatalError } from '../../features/fatal-errors/errors-slice';
import Tab from '@mui/material/Tab';
import { TabPanel } from '../TabPanel';
import Tabs from '@mui/material/Tabs';

export enum TabOptions {
  FolderManagement,
  TBC,
}

export interface ConfigurationFormProps {
  initialTab?: TabOptions;
}

const handleDelete = (dispatch: ReturnType<typeof useAppDispatch>, uuid: string) => (): void => {
  editorApi.deleteFolder(uuid).catch((e) => dispatch(setFatalError(e)));
};

export const ConfigurationForm: React.FC<ConfigurationFormProps> = ({ initialTab }) => {
  const [selectedTab, setSelectedTab] = useState(initialTab ?? TabOptions.FolderManagement);
  const folders = useAppSelector((state) => state.files.folders);
  const dispatch = useAppDispatch();

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={selectedTab} onChange={(_ev, v: TabOptions): void => setSelectedTab(v)}>
          <Tab label='Note folders' value={TabOptions.FolderManagement} />
          <Tab label='TBC' value={TabOptions.TBC} />
        </Tabs>
      </Box>
      <TabPanel name={TabOptions.FolderManagement.toString()} hidden={selectedTab !== TabOptions.FolderManagement}>
        {folders == null ? (
          <Box sx={{ p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <List>
            {Object.values(folders).map(({ name, uuid, displayPath }) => (
              <React.Fragment key={uuid}>
                <ListItem
                  secondaryAction={
                    <IconButton onClick={handleDelete(dispatch, uuid)}>
                      <Delete />
                    </IconButton>
                  }
                >
                  <ListItemText primary={name} secondary={displayPath} />
                </ListItem>
                <Divider component='li' />
              </React.Fragment>
            ))}
            <ListItem>
              <AddFolder />
            </ListItem>
          </List>
        )}
      </TabPanel>
      <TabPanel name={TabOptions.TBC.toString()} hidden={selectedTab !== TabOptions.TBC}>
        <Box sx={{ p: 3 }}>Extra configuration coming here soon!</Box>
      </TabPanel>
    </Box>
  );
};
