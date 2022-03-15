import {
  setAboutDetails,
  setActiveOverlay,
  setCurrentFile,
  setCurrentFolder,
  setFatalError,
  setFileListing,
  setUpdateStatus,
  updateAppConfiguration,
} from '~renderer/redux';
import { useAppDispatch, useAppSelector } from '~renderer/hooks';
import { useCallback, useEffect, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import type { FolderConfiguration } from '~shared/model';

export const DataProvider: React.FC = ({ children }) => {
  const dispatch = useAppDispatch();
  const [loadedConfiguration, setLoadedConfiguration] = useState(false);
  const [loadedFiles, setLoadedFiles] = useState(false);
  const files = useAppSelector((s) => s.files.folders);
  const lastFolder = useAppSelector((s) => s.configuration.lastFolder);
  const lastFile = useAppSelector((s) => s.configuration.lastFile);

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
        setLoadedFiles(true);
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
    const result = editorApi
      .getAppConfiguration()
      .then((configuration) => {
        setLoadedConfiguration(true);
        const handler = editorApi.on('configuration', (newConfiguration) => {
          dispatch(updateAppConfiguration(newConfiguration));
        });
        dispatch(updateAppConfiguration(configuration));

        return handler;
      })
      .catch((e) => dispatch(setFatalError(e)));

    return (): void => {
      result
        .then((v) => (typeof v === 'number' ? editorApi.off('configuration', v) : undefined))
        .catch((e) => dispatch(setFatalError(e)));
    };
  }, [dispatch]);

  useEffect(() => {
    const handler = editorApi.on('update-status', (status) => {
      dispatch(setUpdateStatus(status));
    });
    editorApi.checkForUpdates();

    return (): void => {
      editorApi.off('update-status', handler);
    };
  }, [dispatch]);

  useEffect(() => {
    editorApi.aboutDetails
      .then((details) => dispatch(setAboutDetails(details)))
      .catch((e) => dispatch(setFatalError(e)));
  }, [dispatch]);

  useEffect(() => {
    if (!loadedConfiguration || !loadedFiles) {
      return;
    }
    dispatch(setCurrentFolder(lastFolder ?? ''));

    const currentFile = Object.values(files ?? {})
      .find((f) => f.uuid === lastFolder)
      ?.categories.flatMap((c) => c.files)
      .find((f) => f.url === lastFile);

    if (currentFile != null) {
      dispatch(setCurrentFile(currentFile));
    }
    // This intentionally only runs once when we've loaded the requirements.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadedConfiguration, loadedFiles]);

  return loadedConfiguration && loadedFiles ? <>{children}</> : <CircularProgress />;
};
