import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

export const Application: React.FC = (_props) => {
  const [currentComponent, setCurrentComponent] = useState('Current component');

  return (
    <React.Fragment>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position='static'>
          <Toolbar>
            <IconButton
              edge='start'
              size='large'
              color='inherit'
              aria-label='menu'
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
              {currentComponent}
            </Typography>
          </Toolbar>
        </AppBar>
        <div>
          Hello world!
          <Button color='primary' variant='contained'>
            &gt;&gt;
          </Button>
        </div>
      </Box>
    </React.Fragment>
  );
};
