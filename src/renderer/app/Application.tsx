import * as http from '../../shared/http';
import { useAppSelector, useDebouncedState } from './hooks';
import { useCallback, useEffect } from 'react';
import type { FileDescription } from '../../shared/model';
import { FileListing } from './components/FileListing';
import Grid from '@mui/material/Grid';
import type { GridProps } from '@mui/material/Grid';
import { MarkdownEditor } from './components/MarkdownEditor';
import { styled } from '@mui/material';

const TITLE_PREFIX = 'Notes';
// TODO: Make this configurable.
const SAVE_DELAY = 10_000;

const renderTitle = (openFile?: string): string => {
  if (openFile == null) {
    return TITLE_PREFIX;
  } else {
    return `${TITLE_PREFIX} - ${openFile}`;
  }
};

const GrowingGrid = styled(Grid)<GridProps>(() => ({
  flexGrow: 1,
}));

const FullSizeGrid = styled(Grid)<GridProps>(() => ({
  height: '100%',
  overflowY: 'auto',
}));

/**
 * Main application entrypoint component.
 */
export const Application: React.FC = () => {
  const openFile = useAppSelector((state) => state.files);
  const [contents, setContents, flushContents] = useDebouncedState<{
    file?: FileDescription;
    loading?: boolean;
    content?: string;
  }>({}, SAVE_DELAY);

  useEffect(() => {
    (async (): Promise<void> => {
      if (contents.loading !== true && contents.file != null && contents.content != null) {
        const resp = await fetch(contents.file.url, {
          method: 'PUT',
          headers: {
            'content-type': 'text/plain',
          },
          body: contents.content,
        });

        if (resp.status !== http.OK) {
          throw new Error(await resp.text());
        }
      }
    })().catch((e) => {
      log.error(e);
    });
  }, [contents.loading, contents.file, contents.content]);

  useEffect(() => {
    document.title = renderTitle(openFile.currentFile?.name);

    flushContents();
    if (openFile.currentFile?.url != null) {
      fetch(openFile.currentFile.url)
        .then(async (v) => v.text())
        .then((content) => {
          setContents({ file: openFile.currentFile, loading: true, content });
          flushContents();
        })
        .catch((e) => {
          log.error(e);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openFile.currentFile?.url]);

  const onChange = useCallback(
    (content: string): void => {
      setContents({ file: openFile.currentFile, content });
    },
    [setContents, openFile.currentFile],
  );

  return (
    <GrowingGrid container spacing={0}>
      <FullSizeGrid item xs={4}>
        <FileListing />
      </FullSizeGrid>
      <FullSizeGrid item xs={8}>
        <MarkdownEditor value={contents.content ?? ''} onChange={onChange} />
      </FullSizeGrid>
    </GrowingGrid>
  );
};
