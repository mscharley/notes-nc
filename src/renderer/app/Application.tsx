// Actual application wrapper component.
import { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import { MarkdownEditor } from './components/MarkdownEditor';
import Paper from '@mui/material/Paper';
import type { TitleState } from './features/title/title-slice';
import { useAppSelector } from './hooks';
import { FileListing } from './components/FileListing';

const renderTitle = (title: TitleState): string => {
  if (title.currentFile == null) {
    return title.prefix;
  } else {
    return `${title.prefix} - ${title.currentFile}`;
  }
};

/**
 * Main application entrypoint component.
 */
export const Application: React.FC = () => {
  const title = useAppSelector((state) => state.title);
  const [contents, setContents] = useState('# Read me\n\nHello world!');

  useEffect(() => {
    document.title = renderTitle(title);
  }, [title]);

  return (
    <Grid container spacing={0} style={{ flexGrow: 1 }}>
      <Grid item xs={4}>
        <FileListing />
      </Grid>
      <Grid item xs={8}>
        <MarkdownEditor
          // eslint-disable-next-line @typescript-eslint/require-await
          onChange={async (newContents): Promise<void> => {
            setContents(newContents);
          }}
        >
          {contents}
        </MarkdownEditor>
      </Grid>
    </Grid>
  );
};
