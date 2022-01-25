import { useEffect, useRef, useState } from 'react';
import EasyMDE from 'easymde';
import { noop } from '../../../shared/util';
import { useDebouncedState } from '../hooks';

export interface MarkdownEditorProps {
  onChange: (contents: string) => Promise<void>;
}

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({ onChange, children }) => {
  const editorArea = useRef<HTMLTextAreaElement>(null);
  const [_editor, setEditor] = useState<EasyMDE | null>(null);
  const [saveElement, setSaveElement] = useState<HTMLElement | null>(null);
  const [contents, setContents] = useDebouncedState('', 5_000);

  window.prompt;
  useEffect(() => {
    if (editorArea.current == null) {
      return noop;
    }

    const mde = new EasyMDE({
      element: editorArea.current,
      // Including it locally is faster and more reliable, but this will never work with CSP enabled.
      autoDownloadFontAwesome: false,
      // Just UX things...
      // promptURLs: true,
      sideBySideFullscreen: false,
      syncSideBySidePreviewScroll: true,
      // Manage updates.
      status: [
        {
          className: 'updates',
          defaultValue: setSaveElement,
          onUpdate: (): void => {
            setContents(mde.value());
          },
        },
        'lines',
        'words',
        'cursor',
      ],
    });
    setEditor(mde);

    return (): void => {
      mde.toTextArea();
      mde.cleanup();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editorArea]);

  useEffect(() => {
    if (saveElement != null) {
      saveElement.innerText = 'Saving...';
      onChange(contents)
        .catch(log.error.bind(log))
        .finally(() => {
          saveElement.innerText = '';
        });
    }
  }, [contents, saveElement, onChange]);

  return <textarea ref={editorArea}>{children}</textarea>;
};
