import { Focus, Placeholder } from '@tiptap/extensions';
import { EditorContent, useEditor, type JSONContent } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import StarterKit from '@tiptap/starter-kit';
import { useEffect } from 'react';
import AttachLinkButton from './attach-link-button-with-popover';
import FillerWordHighlight from './extensions/filler-word-highlight';

export default function Tiptap({
  onUpdate,
}: {
  onUpdate: (content: JSONContent) => void;
}) {
  // set --vh on mount + resize
  useEffect(() => {
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    setVh();
    window.addEventListener('resize', setVh);
    return () => window.removeEventListener('resize', setVh);
  }, []);

  const editor = useEditor({
    editorProps: {
      scrollThreshold: window.innerHeight / 2 - 40,
      scrollMargin: window.innerHeight / 2 - 40,
    },
    extensions: [
      StarterKit,
      Focus.configure({ mode: 'all' }),
      Placeholder.configure({
        placeholder: 'Start writing whatever you feel...',
      }),
      FillerWordHighlight,
    ],
    content: '',
    onUpdate: ({ editor }) => {
      onUpdate(editor.getJSON());
    },
  });

  return (
    <div className="h-full">
      {editor && (
        <BubbleMenu editor={editor}>
          <AttachLinkButton editor={editor} />
        </BubbleMenu>
      )}

      <EditorContent
        editor={editor}
        style={{
          // minHeight = 200 * var(--vh)
          minHeight: 'calc(var(--vh, 1vh) * 200)',
          paddingTop: 'calc(var(--vh, 1vh) * 50)',
          paddingBottom: 'calc(var(--vh, 1vh) * 50)',
        }}
        className="prose font-ibm-sans dark:prose-invert mx-auto max-w-4xl p-6"
      />
    </div>
  );
}
