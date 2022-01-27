import { setFileListing } from './app/features/markdown-files/files-slice';
import { useAppDispatch } from './app/hooks';
import { useEffect } from 'react';

export const DataProvider: React.FC = ({ children }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    editorApi.on('files-updated', (fs) => dispatch(setFileListing(fs)));
  });

  return <>{children}</>;
};
