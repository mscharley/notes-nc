import Button from '@mui/material/Button';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import IconButton from '@mui/material/IconButton';
import { setFatalError } from '~renderer/redux';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useDispatch } from 'react-redux';
import { useState } from 'react';

export const AddFolder: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [folder, setFolder] = useState<string | null>(null);
  const dispatch = useDispatch();

  const handleOpenFolder = (): void => {
    editorApi
      .openSelectFolderDialog()
      .then((results) => {
        if (!results.canceled || results.filePaths.length === 1) {
          setFolder(results.filePaths[0]);
        }
      })
      .catch((e) => dispatch(setFatalError(e)));
  };

  const handleAddFolder = (): void => {
    if (name === '' || folder == null) {
      return;
    }
    editorApi
      .addFolder(name, folder)
      .then(() => {
        setName('');
        setFolder(null);
      })
      .catch((e) => dispatch(setFatalError(e)));
  };

  return (
    <div style={{ width: '100%' }}>
      <Typography variant='h6' mt={1} mb={2}>
        Add new folder
      </Typography>
      <TextField
        label='Name'
        variant='outlined'
        style={{ width: '100%' }}
        value={name}
        onChange={(ev): void => setName(ev.target.value)}
      />
      <div>
        <IconButton onClick={handleOpenFolder}>
          <CreateNewFolderIcon />
        </IconButton>
        <Typography
          component='span'
          style={{
            display: 'inline-block',
            height: '2.5em',
            verticalAlign: 'top',
            lineHeight: '2.7em',
            paddingLeft: '0.5em',
          }}
          color={folder == null ? 'text.disabled' : 'text.primary'}
        >
          {folder == null ? 'No folder selected.' : folder}
        </Typography>
      </div>
      <Button onClick={handleAddFolder}>Add</Button>
    </div>
  );
};
