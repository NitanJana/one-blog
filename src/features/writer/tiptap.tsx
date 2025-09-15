import { CharacterCount, Focus, Placeholder } from '@tiptap/extensions';
import {
  EditorContent,
  useEditor,
  useEditorState,
  type JSONContent,
} from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import StarterKit from '@tiptap/starter-kit';
import AttachLinkButton from './attach-link-button-with-popover';
import CharacterWordCounter from './character-word-counter';
import FillerWordHighlight from './extensions/filler-word-highlight';

export default function Tiptap({
  onUpdate,
  showCharacterCount = true,
}: {
  onUpdate: (content: JSONContent) => void;
  showCharacterCount?: boolean;
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
    },
  });

  const { charactersCount, wordsCount } = useEditorState({
    editor,
    selector: (context) => ({
      charactersCount: context.editor.storage.characterCount.characters(),
      wordsCount: context.editor.storage.characterCount.words(),
    }),
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
      {showCharacterCount && (
        <CharacterWordCounter
          charactersCount={charactersCount}
          wordsCount={wordsCount}
        />
      )}
    </div>
  );
}
