import { closeCurrentFile, setCurrentFolder } from '~renderer/redux';
import { useAppDispatch, useAppSelector } from '~renderer/hooks';
import { FileCategoryListing } from './FileCategoryListing';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import List from '@mui/material/List';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import type { PaperProps } from '@mui/material/Paper';
import Select from '@mui/material/Select';
import type { SelectChangeEvent } from '@mui/material/Select';
import { styled } from '@mui/material';
import Typography from '@mui/material/Typography';

const ScrollablePaper = styled(Paper)<PaperProps>(() => ({
  overflowY: 'auto',
  border: '0px',
  height: '100%',
}));

export const FileListing: React.FC = () => {
  const dispatch = useAppDispatch();
  const files = useAppSelector((s) => s.files);
  const currentFolder = useAppSelector((s) => s.files.currentFolder);

  const folder = Object.values(files.folders ?? {}).find((v) => v.uuid === currentFolder);

  const handleFolderChange = (ev: SelectChangeEvent<string | null>): void => {
    if (ev.target.value != null) {
      dispatch(setCurrentFolder(ev.target.value));
      dispatch(closeCurrentFile());
    }
  };

  return (
    <ScrollablePaper variant='outlined' square>
      {files.loading ? (
        <Typography>Loading...</Typography>
      ) : (
        <>
          <FormControl variant='filled' sx={{ width: '100%' }}>
            <InputLabel>Note folder</InputLabel>
            <Select value={currentFolder ?? ''} id='folder' onChange={handleFolderChange}>
              {Object.values(files.folders).map(({ uuid, name }) => (
                <MenuItem key={uuid} value={uuid}>
                  {name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {folder == null ? (
            <></>
          ) : (
            <List sx={{ padding: '0' }}>
              {folder.categories.map(({ name: categoryName, files: categoryFiles }) =>
                categoryFiles.length === 0 ? null : (
                  <FileCategoryListing
                    key={`${folder.name}-${categoryName}`}
                    name={categoryName}
                    files={categoryFiles}
                  />
                ),
              )}
            </List>
          )}
        </>
      )}
    </ScrollablePaper>
  );
};
