import { FileFolderListing } from './FileFolderListing';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Paper from '@mui/material/Paper';
import type { PaperProps } from '@mui/material/Paper';
import { styled } from '@mui/material';
import { useAppSelector } from '../hooks';

const ScrollablePaper = styled(Paper)<PaperProps>(() => ({
  height: '100%',
}));

export const FileListing: React.FC = () => {
  const files = useAppSelector((s) => s.files);

  return (
    <ScrollablePaper variant='outlined' square>
      <List>
        {files.loading ? (
          <ListItem>Loading...</ListItem>
        ) : (
          Object.entries(files.folders).map(([folderName, categories]) => (
            <FileFolderListing key={folderName} name={folderName} categories={categories} />
          ))
        )}
      </List>
    </ScrollablePaper>
  );
};
