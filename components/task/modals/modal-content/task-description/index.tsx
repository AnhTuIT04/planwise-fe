import "@/styles/tiptap.css";

import { Extension } from "@tiptap/core";
import { TextSelection } from "@tiptap/pm/state";
import { EditorContent, useEditor } from "@tiptap/react";
import { Placeholder } from "@tiptap/extensions";
import StarterKit from "@tiptap/starter-kit";

import { useTaskMutations } from "@/hooks/use-task";
import { useTaskModalStore } from "@/stores/task-modal.store";
import { MenuBar } from "./menu-bar";

const PreventSelectAllWhenEmpty = Extension.create({
  name: "preventSelectAllWhenEmpty",
  addKeyboardShortcuts() {
    return {
      "Mod-a": ({ editor }) => {
        if (editor.isEmpty) {
          editor.commands.focus("start");
          return true;
        }

        const { state, view } = editor;
        let from: number | null = null;
        let to: number | null = null;

        state.doc.descendants((node, pos) => {
          if (!node.isText || !node.text?.length) {
            return;
          }

          if (from === null) {
            from = pos;
          }

          to = pos + node.nodeSize;
        });

        if (from === null || to === null) {
          editor.commands.focus("start");
          return true;
        }

        const selection = TextSelection.create(state.doc, from, to);
        view.dispatch(state.tr.setSelection(selection).scrollIntoView());
        return true;
      },
    };
  },
});

export default function TaskDescription() {
  const mode = useTaskModalStore((s) => s.mode);
  const sectionId = useTaskModalStore((s) => s.task.sectionId);
  const taskId = useTaskModalStore((s) => s.task.id);
  const description = useTaskModalStore((s) => s.task.description);
  const setModalData = useTaskModalStore((s) => s.setModalData);
  const setField = useTaskModalStore((s) => s.setField);

  const { updateTaskMutation } = useTaskMutations();

  const editor = useEditor({
    extensions: [
      StarterKit,
      PreventSelectAllWhenEmpty,
      Placeholder.configure({
        placeholder: "Note...",
      }),
    ],
    content: description,
    immediatelyRender: false,
    onBlur: async ({ editor }) => {
      const content = editor.getHTML();

      if (content !== description) {
        if (mode === "update") {
          try {
            const data = await updateTaskMutation.mutateAsync({
              taskId,
              sectionId,
              description: content,
            });

            setModalData(data);
          } catch (error) {
            console.log("Failed to update task description:", error);
          }

          return;
        }

        setField("description", content);
      }
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="w-full">
      <MenuBar editor={editor} />

      <EditorContent
        editor={editor}
        className="tiptap w-full pt-4 pl-10 [&_.ProseMirror]:border-none [&_.ProseMirror]:outline-none [&_.ProseMirror]:focus:ring-0 [&_.ProseMirror]:focus:ring-offset-0"
      />
    </div>
  );
}
