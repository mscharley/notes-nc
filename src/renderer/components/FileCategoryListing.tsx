import AddIcon from '@mui/icons-material/Add';
import Divider from '@mui/material/Divider';
import type { FileDescription } from '~shared/model';
import { FileListItem } from './FileListItem';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Tooltip from '@mui/material/Tooltip';
import { useAppSelector } from '~renderer/hooks';

export interface FileCategoryListingProps {
  name: string;
  files: FileDescription[];
}

export const FileCategoryListing: React.FC<FileCategoryListingProps> = ({ name, files }) => {
  const currentFileUrl = useAppSelector((s) => s.files.currentFile?.url);

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
        <FileListItem key={f.url} file={f} selected={f.url === currentFileUrl} />
      ))}
    </>
  );
};
