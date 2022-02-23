import AddIcon from '@mui/icons-material/Add';
import type { CategoryDescription } from '../../../shared/model';
import Divider from '@mui/material/Divider';
import { FileCategoryListing } from './FileCategoryListing';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Tooltip from '@mui/material/Tooltip';
import { useState } from 'react';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

export interface FileFolderListingProps {
  name: string;
  categories: CategoryDescription[];
  showEmpty?: boolean;
}

export const FileFolderListing: React.FC<FileFolderListingProps> = ({
  categories,
  showEmpty: defaultShowEmpty,
  name,
}) => {
  const [showEmpty, setShowEmpty] = useState<boolean>(defaultShowEmpty ?? false);

  return (
    <>
      <ListItem
        secondaryAction={
          <>
            {showEmpty ? (
              <Tooltip title='Hide empty categories' placement='bottom'>
                <IconButton onClick={(): void => setShowEmpty(false)}>
                  <VisibilityIcon />
                </IconButton>
              </Tooltip>
            ) : (
              <Tooltip title='Show empty categories' placement='bottom'>
                <IconButton onClick={(): void => setShowEmpty(true)}>
                  <VisibilityOffIcon />
                </IconButton>
              </Tooltip>
            )}
            <Tooltip title='Add new category' placement='bottom'>
              <IconButton>
                <AddIcon />
              </IconButton>
            </Tooltip>
          </>
        }
      >
        <ListItemText primary={name} />
      </ListItem>
      {categories.map(({ name: categoryName, files }) =>
        !showEmpty && files.length === 0 ? null : (
          <FileCategoryListing key={`${name}-${categoryName}`} name={categoryName} files={files} />
        ),
      )}
      <Divider />
    </>
  );
};
