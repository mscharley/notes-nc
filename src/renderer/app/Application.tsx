// Global CSS setup...
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'easymde/dist/easymde.min.css';
import './index.css';

// Actual application wrapper component.
import React, { useEffect, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import { MarkdownEditor } from './components/MarkdownEditor';
import MenuIcon from '@mui/icons-material/Menu';
import type { TitleState } from '../features/title/title-slice';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useAppSelector } from './hooks';

const renderTitle = (title: TitleState): string => {
  if (title.currentFile == null) {
    return title.prefix;
  } else {
    return `${title.prefix} - ${title.currentFile}`;
  }
};

/**
 * Main application entrypoint component.
 */
export const Application: React.FC = () => {
  const title = useAppSelector((state) => state.title);
  const [contents, setContents] = useState('# Read me\n\nHello world!');

  useEffect(() => {
    document.title = renderTitle(title);
  }, [title]);

  return (
    <React.Fragment>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position='static'>
          <Toolbar>
            <IconButton edge='start' size='large' color='inherit' aria-label='menu' sx={{ mr: 2 }}>
              <MenuIcon />
            </IconButton>
            <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
              Hello world!
            </Typography>
          </Toolbar>
        </AppBar>
        <MarkdownEditor
          // eslint-disable-next-line @typescript-eslint/require-await
          onChange={async (newContents): Promise<void> => {
            setContents(newContents);
          }}
        >
          {contents}
        </MarkdownEditor>
      </Box>
    </React.Fragment>
  );
};
