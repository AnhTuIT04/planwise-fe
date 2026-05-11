import { EditorContent, useEditor } from "@tiptap/react";
import { Placeholder } from "@tiptap/extensions";
import StarterKit from "@tiptap/starter-kit";

import { cn } from "@/lib/utils";

export default function TitleEditor({
  placeholder,
  title,
  setTitle,
  className,
}: {
  placeholder: string;
  title: string;
  setTitle: (title: string) => void;
  className?: string;
}) {
  const editor = useEditor({
    extensions: [StarterKit, Placeholder.configure({ placeholder })],
    content: title,
    immediatelyRender: false,
    onBlur: ({ editor }) => {
      const content = editor.getHTML();

      if (content !== title) {
        setTitle(content);
      }
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="w-full min-w-0">
      <EditorContent
        editor={editor}
        className={cn(
          "tiptap w-full pl-4 [&_.ProseMirror]:w-full [&_.ProseMirror]:min-w-0 [&_.ProseMirror]:border-none [&_.ProseMirror]:wrap-anywhere [&_.ProseMirror]:whitespace-pre-wrap [&_.ProseMirror]:outline-none [&_.ProseMirror]:focus:ring-0 [&_.ProseMirror]:focus:ring-offset-0 [&_.ProseMirror>p]:m-0",
          className,
        )}
      />
    </div>
  );
}
