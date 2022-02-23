import type { FolderConfiguration } from '../shared/model';
import { setFatalError } from './app/features/fatal-errors/errors-slice';
import { setFileListing } from './app/features/markdown-files/files-slice';
import { useAppDispatch } from './app/hooks';
import { useEffect } from 'react';

export const DataProvider: React.FC = ({ children }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const handleUpdates = (updated: FolderConfiguration): void => {
      dispatch(setFileListing(updated));
    };

    editorApi
      .listNoteFiles()
      .then((fs) => {
        dispatch(setFileListing(fs));
        editorApi.on('files-updated', handleUpdates);
      })
      .catch((e: unknown) => {
        dispatch(setFatalError(e));
      });

    return (): void => {
      editorApi.off('files-updated', handleUpdates);
    };
  });

  return <>{children}</>;
};
