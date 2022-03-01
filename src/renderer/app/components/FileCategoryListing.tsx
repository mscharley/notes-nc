import AddIcon from '@mui/icons-material/Add';
import ArticleIcon from '@mui/icons-material/Article';
import Divider from '@mui/material/Divider';
import type { FileDescription } from '@shared/model';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { setCurrentFile } from '../features/markdown-files/files-slice';
import Tooltip from '@mui/material/Tooltip';
import { useAppDispatch } from '../hooks';

export interface FileCategoryListingProps {
  name: string;
  files: FileDescription[];
}

export const FileCategoryListing: React.FC<FileCategoryListingProps> = ({ name, files }) => {
  const dispatch = useAppDispatch();

  return (
    <>
      <Divider />
      <ListItem
        key={name}
        secondaryAction={
          <Tooltip title='Add new note' placement='bottom'>
            <IconButton>
              <AddIcon />
            </IconButton>
          </Tooltip>
        }
      >
        <ListItemText
          primary={name}
          primaryTypographyProps={{
            fontWeight: 'medium',
            lineHeight: '2em',
          }}
        />
      </ListItem>
      {files.map((f) => (
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
  );
};
