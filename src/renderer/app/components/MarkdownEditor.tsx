import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import CodeMirror from '@uiw/react-codemirror';
import { languages } from '@codemirror/language-data';

export interface MarkdownEditorProps {
  value: string;
  onChange: (contents: string) => Promise<void>;
}

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({ onChange, value }) => {
  return (
    <CodeMirror
      extensions={[markdown({ base: markdownLanguage, codeLanguages: languages })]}
      onChange={onChange}
      value={value}
    ></CodeMirror>
  );
};
