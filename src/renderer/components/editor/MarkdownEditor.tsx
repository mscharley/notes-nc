import { EditorView, useCodeMirror } from '@uiw/react-codemirror';
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import { languages } from '@codemirror/language-data';
import { setFatalError } from '~renderer/redux';
import { useAppDispatch } from '~renderer/hooks';

export interface MarkdownEditorProps {
  value: string;
  onChange: (contents: string) => void | Promise<void>;
}

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({ onChange, value }) => {
  const dispatch = useAppDispatch();
  const editor = useRef<HTMLDivElement | null>(null);

  const { setContainer, view } = useCodeMirror({
    container: editor.current,
    extensions: [markdown({ base: markdownLanguage, codeLanguages: languages }), EditorView.lineWrapping],
    onChange: (s) => {
      Promise.resolve(onChange(s)).catch((e) => {
        dispatch(setFatalError(e));
      });
    },
    value,
  });

  useEffect(() => {
    if (editor.current != null) {
      setContainer(editor.current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor.current]);

  useEffect(() => {
    view?.focus();
  }, [view]);

  const handleBackgroundClick: React.MouseEventHandler<HTMLDivElement> = (ev) => {
    if (ev.target !== editor.current) {
      view?.focus();
    }
  };

  return (
    <Box sx={{ paddingBottom: 'calc(100vh - 1.7em)' }} onClick={handleBackgroundClick}>
      <div ref={editor}></div>
    </Box>
  );
};
