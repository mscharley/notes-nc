import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import Box from '@mui/material/Box';
import CodeMirror from '@uiw/react-codemirror';
import { languages } from '@codemirror/language-data';
import type { ReactCodeMirrorRef } from '@uiw/react-codemirror';
import { setFatalError } from '~renderer/redux';
import { useAppDispatch } from '~renderer/hooks';
import { useRef } from 'react';

export interface MarkdownEditorProps {
  value: string;
  onChange: (contents: string) => void | Promise<void>;
}

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({ onChange, value }) => {
  const dispatch = useAppDispatch();
  const codemirror = useRef<ReactCodeMirrorRef | null>(null);

  const handleClick: React.MouseEventHandler<HTMLDivElement> = (ev) => {
    if (ev.target !== codemirror.current?.editor) {
      codemirror.current?.view?.focus();
    }
  };

  return (
    <Box sx={{ paddingBottom: 'calc(100vh - 1.7em)' }} onClick={handleClick}>
      <CodeMirror
        extensions={[markdown({ base: markdownLanguage, codeLanguages: languages })]}
        onChange={(s): void => {
          Promise.resolve(onChange(s)).catch((e) => {
            dispatch(setFatalError(e));
          });
        }}
        value={value}
        ref={codemirror}
      />
    </Box>
  );
};
