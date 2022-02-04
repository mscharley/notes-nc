import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import CodeMirror from '@uiw/react-codemirror';
import { languages } from '@codemirror/language-data';

export interface MarkdownEditorProps {
  value: string;
  onChange: (contents: string) => void | Promise<void>;
}

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({ onChange, value }) => {
  return (
    <CodeMirror
      extensions={[markdown({ base: markdownLanguage, codeLanguages: languages })]}
      onChange={async (s): Promise<void> => {
        try {
          await onChange(s);
        } catch (e: unknown) {
          log.error(e);
        }
      }}
      value={value}
    ></CodeMirror>
  );
};
