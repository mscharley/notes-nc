import { useAppDispatch, useAppSelector } from '../hooks';
import AddIcon from '@mui/icons-material/Add';
import ArticleIcon from '@mui/icons-material/Article';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import type { PaperProps } from '@mui/material/Paper';
import { setCurrentFile } from '../features/markdown-files/files-slice';
import { styled } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const ScrollablePaper = styled(Paper)<PaperProps>(() => ({
  height: '100%',
}));

export const FileListing: React.FC = () => {
  const dispatch = useAppDispatch();
  const files = useAppSelector((s) => s.files);

  return (
    <ScrollablePaper variant='outlined' square>
      <List>
        {files.loading ? (
          <ListItem>Loading...</ListItem>
        ) : (
          Object.entries(files.folders).map(([folderName, categories]) => (
            <>
              <ListItem
                key={folderName}
                secondaryAction={
                  <>
                    <Tooltip title='Show empty categories' placement='bottom'>
                      <IconButton>
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title='Hide empty categories' placement='bottom'>
                      <IconButton>
                        <VisibilityOffIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title='Add new category' placement='bottom'>
                      <IconButton>
                        <AddIcon />
                      </IconButton>
                    </Tooltip>
                  </>
                }
              >
                <ListItemText primary={folderName} />
              </ListItem>
              {Object.entries(categories).map(([categoryName, categoryFiles]) => (
                <>
                  <Divider />
                  <ListItem
                    key={categoryName}
                    secondaryAction={
                      <Tooltip title='Add new note' placement='bottom'>
                        <IconButton>
                          <AddIcon />
                        </IconButton>
                      </Tooltip>
                    }
                  >
                    <ListItemText
                      primary={categoryName}
                      primaryTypographyProps={{
                        fontWeight: 'medium',
                        lineHeight: '2em',
                      }}
                    />
                  </ListItem>
                  {categoryFiles.map((f) => (
                    <ListItem key={f.url} disablePadding>
                      <ListItemButton
                        alignItems='flex-start'
                        onClick={(): void => {
                          dispatch(setCurrentFile(f));
                        }}
                      >
                        <ListItemIcon sx={{ marginTop: '3px' }}>
                          <ArticleIcon />
                        </ListItemIcon>
                        <ListItemText primary={f.name} />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </>
              ))}
              <Divider />
            </>
          ))
        )}
      </List>
    </ScrollablePaper>
  );
};
