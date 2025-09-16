import { CharacterCount, Focus, Placeholder } from '@tiptap/extensions';
import { EditorContent, useEditor, type JSONContent } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import StarterKit from '@tiptap/starter-kit';
import AttachLinkButton from './attach-link-button-with-popover';
import FillerWordHighlight from './extensions/filler-word-highlight';

export default function Tiptap({
  onUpdate,
  onWordCountUpdate,
}: {
  onUpdate: (content: JSONContent) => void;
  onWordCountUpdate: (wordCount: {
    charactersCount: number;
    wordsCount: number;
  }) => void;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Focus.configure({
        mode: 'all',
      }),
      Placeholder.configure({
        placeholder: 'Start writing whatever you feel...',
      }),
      FillerWordHighlight,
      CharacterCount.configure({
        wordCounter: (text) => (text.match(/\b\w+\b/g) || []).length,
      }),
    ],
    content: '',
    onUpdate: ({ editor }) => {
      onUpdate(editor.getJSON());
      onWordCountUpdate({
        charactersCount: editor.storage.characterCount.characters(),
        wordsCount: editor.storage.characterCount.words(),
      });
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
        className="prose font-ibm-sans dark:prose-invert mx-auto h-full max-w-4xl p-6"
      />
    </div>
  );
}
