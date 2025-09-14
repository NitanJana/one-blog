import { Focus, Placeholder } from '@tiptap/extensions';
import { EditorContent, useEditor, type JSONContent } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import StarterKit from '@tiptap/starter-kit';
import { useEffect, useState } from 'react';
import AttachLinkButton from './attach-link-button-with-popover';
import FillerWordHighlight from './extensions/filler-word-highlight';

export default function Tiptap({
  onUpdate,
}: {
  onUpdate: (content: JSONContent) => void;
}) {
  const [scrollMargin, setScrollMargin] = useState(0);

  // keep --vh + scrollMargin synced with real viewport height
  useEffect(() => {
    const updateSizes = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
      setScrollMargin(Math.max(20, Math.floor((vh * 100) / 2) - 40));
    };

    updateSizes();
    window.addEventListener('resize', updateSizes);
    return () => window.removeEventListener('resize', updateSizes);
  }, []);

  const editor = useEditor({
    editorProps: {
      scrollThreshold: scrollMargin,
      scrollMargin: scrollMargin,
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
          // min height = 200% viewport
          minHeight: 'calc(var(--vh, 1vh) * 200)',
          // center content initially
          paddingTop: 'calc(var(--vh, 1vh) * 50)',
          paddingBottom: 'calc(var(--vh, 1vh) * 50)',
        }}
        className="prose font-ibm-sans dark:prose-invert mx-auto max-w-4xl p-6"
      />
    </div>
  );
}
