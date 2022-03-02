import { closeCurrentFile, setCurrentFile, setFatalError } from '~renderer/redux';
import ArticleIcon from '@mui/icons-material/Article';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import type { FileDescription } from '~shared/model';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import TextField from '@mui/material/TextField';
import { useAppDispatch } from '~renderer/hooks';
import { useState } from 'react';

export interface FileListItemProps {
  file: FileDescription;
  selected?: boolean;
}

export const FileListItem: React.FC<FileListItemProps> = ({ file, selected }) => {
  const dispatch = useAppDispatch();
  const [filename, setFilename] = useState(file.displayName);
  const [editing, setEditing] = useState(false);

  const handleClickAway = (): void => {
    setEditing(false);
    dispatch(closeCurrentFile());
    editorApi
      .renameNoteFile(file, filename)
      .then((newFile) => {
        if (newFile != null) {
          dispatch(setCurrentFile(newFile));
        }
      })
      .catch((e) => dispatch(setFatalError(e)));
  };

  return editing ? (
    <ClickAwayListener onClickAway={handleClickAway}>
      <ListItem>
        <ListItemIcon>
          <ArticleIcon />
        </ListItemIcon>
        <ListItemText
          primary={
            <TextField
              autoFocus={true}
              label={file.displayName}
              value={filename}
              onChange={(ev): void => setFilename(ev.target.value)}
              onKeyUp={(ev): void => {
                if (ev.key === 'Escape') {
                  setEditing(false);
                }
              }}
              onKeyPress={(ev): void => {
                if (ev.key === 'Enter') {
                  handleClickAway();
                }
              }}
            />
          }
        />
      </ListItem>
    </ClickAwayListener>
  ) : (
    <ListItem disablePadding>
      <ListItemButton
        selected={selected}
        onClick={(): void => {
          dispatch(setCurrentFile(file));
        }}
        onDoubleClick={(): void => setEditing(true)}
      >
        <ListItemIcon>
          <ArticleIcon />
        </ListItemIcon>
        <ListItemText primary={file.displayName} />
      </ListItemButton>
    </ListItem>
  );
};
