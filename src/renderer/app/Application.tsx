// Actual application wrapper component.
import { useEffect, useState } from 'react';
import { FileListing } from './components/FileListing';
import Grid from '@mui/material/Grid';
import type { GridProps } from '@mui/material/Grid';
import { MarkdownEditor } from './components/MarkdownEditor';
import { styled } from '@mui/material';
import type { TitleState } from './features/title/title-slice';
import { useAppSelector } from './hooks';

const renderTitle = (title: TitleState): string => {
  if (title.currentFile == null) {
    return title.prefix;
  } else {
    return `${title.prefix} - ${title.currentFile}`;
  }
};

const GrowingGrid = styled(Grid)<GridProps>(() => ({
  flexGrow: 1,
}));

const FullSizeGrid = styled(Grid)<GridProps>(() => ({
  height: '100%',
}));

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
    <GrowingGrid container spacing={0}>
      <FullSizeGrid item xs={4}>
        <FileListing />
      </FullSizeGrid>
      <FullSizeGrid item xs={8}>
        <MarkdownEditor
          value={contents}
          // eslint-disable-next-line @typescript-eslint/require-await
          onChange={async (newContents): Promise<void> => {
            setContents(newContents);
          }}
        />
      </FullSizeGrid>
    </GrowingGrid>
  );
};
