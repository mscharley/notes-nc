import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import Box from '@mui/material/Box';
import CodeMirror from '@uiw/react-codemirror';
import { languages } from '@codemirror/language-data';
import { setFatalError } from '../features/fatal-errors/errors-slice';
import { useAppDispatch } from '../hooks';

export interface MarkdownEditorProps {
  value: string;
  onChange: (contents: string) => void | Promise<void>;
}

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({ onChange, value }) => {
  const dispatch = useAppDispatch();

  return (
    <Box sx={{ paddingBottom: 'calc(100vh - 1.7em)' }}>
      <CodeMirror
        extensions={[markdown({ base: markdownLanguage, codeLanguages: languages })]}
        onChange={(s): void => {
          Promise.resolve(onChange(s)).catch((e) => {
            dispatch(setFatalError(e));
          });
        }}
        value={value}
      />
    </Box>
  );
};
