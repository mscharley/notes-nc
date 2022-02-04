import AddIcon from '@mui/icons-material/Add';
import type { CategoryListing } from '../../../shared/model';
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
  categories: CategoryListing;
}

export const FileFolderListing: React.FC<FileFolderListingProps> = ({ categories, name }) => {
  const [showEmpty, setShowEmpty] = useState<boolean>(false);

  return (
    <>
      <ListItem
        secondaryAction={
          <>
            {!showEmpty ? (
              <></>
            ) : (
              <Tooltip title='Hide empty categories' placement='bottom'>
                <IconButton onClick={(): void => setShowEmpty(false)}>
                  <VisibilityIcon />
                </IconButton>
              </Tooltip>
            )}
            {showEmpty ? (
              <></>
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
      {Object.entries(categories).map(([categoryName, categoryFiles]) =>
        !showEmpty && categoryFiles.length === 0 ? (
          <></>
        ) : (
          <FileCategoryListing key={`${name}-${categoryName}`} name={categoryName} files={categoryFiles} />
        ),
      )}
      <Divider />
    </>
  );
};
