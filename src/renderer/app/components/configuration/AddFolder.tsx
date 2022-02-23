import Button from '@mui/material/Button';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useState } from 'react';

export const AddFolder: React.FC = () => {
  const [name, setName] = useState<string | null>(null);
  const [folder, setFolder] = useState<string | null>(null);

  const handleOpenFolder = async (): Promise<void> => {
    const results = await editorApi.openSelectFolderDialog();
    if (!results.canceled || results.filePaths.length === 1) {
      setFolder(results.filePaths[0]);
    }
  };

  const handleAddFolder = async (): Promise<void> => {
    if (name == null || folder == null) {
      return;
    }
    await editorApi.addFolder(name, folder);
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
