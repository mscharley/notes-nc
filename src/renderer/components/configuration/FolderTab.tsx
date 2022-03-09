import { useAppDispatch, useAppSelector } from '~renderer/hooks';
import { AddFolder } from './AddFolder';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Delete from '@mui/icons-material/Delete';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import React from 'react';
import { setFatalError } from '~renderer/redux';

const handleDelete = (dispatch: ReturnType<typeof useAppDispatch>, uuid: string) => (): void => {
  editorApi.deleteFolder(uuid).catch((e) => dispatch(setFatalError(e)));
};

export const FolderTab: React.FC = () => {
  const folders = useAppSelector((state) => state.files.folders);
  const dispatch = useAppDispatch();

  return folders == null ? (
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
  );
};
