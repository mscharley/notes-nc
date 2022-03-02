import { setAboutDetails, setActiveOverlay, setFatalError, setFileListing } from '~renderer/redux';
import { useCallback, useEffect } from 'react';
import type { FolderConfiguration } from '~shared/model';
import { useAppDispatch } from '~renderer/hooks';

export const DataProvider: React.FC = ({ children }) => {
  const dispatch = useAppDispatch();

  const handleFileUpdates = useCallback(
    (updated: FolderConfiguration): void => {
      dispatch(setFileListing(updated));
    },
    [dispatch],
  );

  useEffect(() => {
    const result = editorApi
      .listNoteFiles()
      .then((fs) => {
        dispatch(setFileListing(fs));
        if (Object.values(fs).length === 0) {
          dispatch(setActiveOverlay('configuration'));
        }
        return editorApi.on('files-updated', handleFileUpdates);
      })
      .catch((e: unknown) => {
        dispatch(setFatalError(e));
      });

    return (): void => {
      result
        .then((v) => (typeof v === 'number' ? editorApi.off('files-updated', v) : undefined))
        .catch((e) => dispatch(setFatalError(e)));
    };
  }, [dispatch, handleFileUpdates]);

  useEffect(() => {
    editorApi.aboutDetails
      .then((details) => dispatch(setAboutDetails(details)))
      .catch((e) => dispatch(setFatalError(e)));
  });

  return <>{children}</>;
};
