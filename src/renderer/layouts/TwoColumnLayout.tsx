import * as http from '~shared/http';
import { useAppSelector, useDebouncedState } from '~renderer/hooks';
import { useCallback, useEffect } from 'react';
import Box from '@mui/material/Box';
import { DialogOverlays } from '~renderer/components/DialogOverlays';
import Drawer from '@mui/material/Drawer';
import type { FileDescription } from '~shared/model';
import { FileListing } from '~renderer/components/sidebar/FileListing';
import { MarkdownEditor } from '~renderer/components/editor/MarkdownEditor';
import { NoFile } from '~renderer/components/editor/NoFile';
import { SidebarFooter } from '~renderer/components/sidebar/SidebarFooter';

const TITLE_SUFFIX = 'Notes';
// TODO: Make this configurable.
const SAVE_DELAY = 10_000;

const renderTitle = (openFile?: string): string => {
  if (openFile == null) {
    return TITLE_SUFFIX;
  } else {
    return `${openFile} - ${TITLE_SUFFIX}`;
  }
};

interface FileState {
  file: FileDescription;
  loading?: boolean;
  content: string;
}

const saveFile = async (state: Partial<FileState>): Promise<void> => {
  if (state.loading !== true && state.file != null && state.content != null) {
    const resp = await fetch(state.file.url, {
      method: 'PUT',
      headers: {
        'content-type': 'text/plain',
      },
      body: state.content,
    });

    if (resp.status !== http.OK) {
      throw new Error(await resp.text());
    }
  }
};

const drawerWidth = 300;

/**
 * Main application entrypoint component.
 */
export const TwoColumnLayout: React.FC = () => {
  const openFile = useAppSelector((state) => state.files);
  const [contents, setContents, flushContents] = useDebouncedState<Partial<FileState>>({}, SAVE_DELAY);

  useEffect(() => {
    saveFile(contents as FileState).catch((e) => {
      log.error(e);
    });
  }, [contents]);

  useEffect(() => {
    window.addEventListener('beforeunload', () => {
      flushContents();
    });
  }, [flushContents]);

  useEffect(() => {
    document.title = renderTitle(openFile.currentFile?.displayName);

    // Save current file if necessary
    flushContents();
    if (openFile.currentFile?.url != null) {
      fetch(openFile.currentFile.url)
        .then(async (v) => v.text())
        .then((content) => {
          // Open new file and flush through the new state.
          setContents({ file: openFile.currentFile, loading: true, content });
          flushContents();
        })
        .catch((e) => {
          log.error(e);
        });
    } else {
      // Reset the contents state so we don't inadvertantly re-save a closed file.
      setContents({});
      flushContents();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openFile.currentFile?.url]);

  const onChange = useCallback(
    (content: string): void => {
      setContents({ file: openFile.currentFile, content });
      window.scrollTo({ top: 0 });
    },
    [setContents, openFile.currentFile],
  );

  return (
    <Box sx={{ display: 'flex', width: '100%', height: '100%' }}>
      <Drawer
        variant='permanent'
        sx={{
          'width': drawerWidth,
          'flexShrink': 0,
          '& .MuiDrawer-paper': {
            paddingBottom: '2.5rem',
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        <FileListing />
        <SidebarFooter width={`${drawerWidth - 1}px`} />
      </Drawer>
      <Box component='main' sx={{ flexGrow: '1' }}>
        {openFile.currentFile == null ? (
          <NoFile />
        ) : (
          <MarkdownEditor value={contents.content ?? ''} onChange={onChange} />
        )}
      </Box>
      <DialogOverlays />
    </Box>
  );
};
