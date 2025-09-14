import { Focus, Placeholder } from '@tiptap/extensions';
import { EditorContent, useEditor, type JSONContent } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import StarterKit from '@tiptap/starter-kit';
import React from 'react';
import AttachLinkButton from './attach-link-button-with-popover';
import FillerWordHighlight from './extensions/filler-word-highlight';

export default function Tiptap({
  onUpdate,
}: {
  onUpdate: (content: JSONContent) => void;
}) {
  const [vh, setVh] = React.useState(
    typeof window !== 'undefined' ? window.innerHeight : 800,
  );

  React.useEffect(() => {
    const onResize = () => setVh(window.innerHeight);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const scrollMarginPx = Math.max(20, Math.floor(vh / 2) - 40);

  const editor = useEditor({
    editorProps: {
      // ProseMirror expects pixel values
      scrollThreshold: scrollMarginPx,
      scrollMargin: scrollMarginPx,
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

  // initial minimum height = 2 * viewport, but it can grow beyond that
  const minHeightPx = `${vh * 2}px`;
  const padTopPx = `${vh / 2}px`;
  const padBottomPx = `${vh / 2}px`;

  return (
    <div className="h-full">
      {editor && (
        <BubbleMenu editor={editor}>
          <AttachLinkButton editor={editor} />
        </BubbleMenu>
      )}

      <EditorContent
        editor={editor}
        // allow growth by using minHeight instead of fixed height
        style={{
          minHeight: minHeightPx,
          paddingTop: padTopPx,
          paddingBottom: padBottomPx,
        }}
        className="prose font-ibm-sans dark:prose-invert mx-auto max-w-4xl p-6"
      />
    </div>
  );
}
