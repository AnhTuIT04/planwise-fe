import { useState } from "react";
import type { Editor } from "@tiptap/core";
import { useEditorState } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import { Bold, CodeXml, Heading, Italic, List, ListOrdered, Strikethrough, TextQuote } from "lucide-react";

import { cn } from "@/lib/utils";
import { menuBarStateSelector } from "./menu-bar-state";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export const MenuBar = ({ editor }: { editor: Editor }) => {
  const editorState = useEditorState({
    editor,
    selector: menuBarStateSelector,
  });

  return (
    <BubbleMenu editor={editor} options={{ placement: "top", offset: 8, flip: true }}>
      <div className="flex h-8 rounded bg-white px-1 shadow">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={cn(
            "group cursor-pointer p-2 hover:bg-[#f7f8fa] disabled:cursor-default disabled:text-[#d2d2d2] disabled:hover:bg-transparent",
          )}
          type="button"
        >
          <Bold
            size={14}
            strokeWidth={3}
            className={cn("group-disabled:text-[#d2d2d2]", editorState.isBold ? "text-[#413f39]" : "text-[#8d8c88]")}
          />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={cn(
            "group cursor-pointer p-2 hover:bg-[#f7f8fa] disabled:cursor-default disabled:text-[#d2d2d2] disabled:hover:bg-transparent",
          )}
          type="button"
        >
          <Italic
            size={14}
            strokeWidth={3}
            className={cn("group-disabled:text-[#d2d2d2]", editorState.isItalic ? "text-[#413f39]" : "text-[#8d8c88]")}
          />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          className={cn(
            "group cursor-pointer p-2 hover:bg-[#f7f8fa] disabled:cursor-default disabled:text-[#d2d2d2] disabled:hover:bg-transparent",
          )}
          type="button"
        >
          <Strikethrough
            size={14}
            strokeWidth={3}
            className={cn("group-disabled:text-[#d2d2d2]", editorState.isStrike ? "text-[#413f39]" : "text-[#8d8c88]")}
          />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleCode().run()}
          disabled={!editor.can().chain().focus().toggleCode().run()}
          className={cn(
            "group cursor-pointer p-2 hover:bg-[#f7f8fa] disabled:cursor-default disabled:text-[#d2d2d2] disabled:hover:bg-transparent",
          )}
          type="button"
        >
          <CodeXml
            size={14}
            strokeWidth={3}
            className={cn("group-disabled:text-[#d2d2d2]", editorState.isCode ? "text-[#413f39]" : "text-[#8d8c88]")}
          />
        </button>

        <HeadingActions editor={editor} />

        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          disabled={!editor.can().chain().focus().toggleBlockquote().run()}
          className={cn(
            "group cursor-pointer p-2 hover:bg-[#f7f8fa] disabled:cursor-default disabled:text-[#d2d2d2] disabled:hover:bg-transparent",
          )}
          type="button"
        >
          <TextQuote
            size={14}
            strokeWidth={3}
            className={cn(
              "group-disabled:text-[#d2d2d2]",
              editorState.isBlockquote ? "text-[#413f39]" : "text-[#8d8c88]",
            )}
          />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          disabled={!editor.can().chain().focus().toggleBulletList().run()}
          className={cn(
            "group cursor-pointer p-2 hover:bg-[#f7f8fa] disabled:cursor-default disabled:text-[#d2d2d2] disabled:hover:bg-transparent",
          )}
          type="button"
        >
          <List
            size={14}
            strokeWidth={3}
            className={cn(
              "group-disabled:text-[#d2d2d2]",
              editorState.isBulletList ? "text-[#413f39]" : "text-[#8d8c88]",
            )}
          />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          disabled={!editor.can().chain().focus().toggleOrderedList().run()}
          className={cn(
            "group cursor-pointer p-2 hover:bg-[#f7f8fa] disabled:cursor-default disabled:text-[#d2d2d2] disabled:hover:bg-transparent",
          )}
          type="button"
        >
          <ListOrdered
            size={14}
            strokeWidth={3}
            className={cn(
              "group-disabled:text-[#d2d2d2]",
              editorState.isOrderedList ? "text-[#413f39]" : "text-[#8d8c88]",
            )}
          />
        </button>
      </div>
    </BubbleMenu>
  );
};

function HeadingActions({ editor }: { editor: Editor }) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          disabled={!editor.can().chain().focus().toggleHeading({ level: 1 }).run()}
          className={cn(
            "group cursor-pointer p-2 hover:bg-[#f7f8fa] disabled:cursor-default disabled:text-[#d2d2d2] disabled:hover:bg-transparent",
          )}
          type="button"
        >
          <Heading
            size={14}
            strokeWidth={3}
            className={cn(
              "group-disabled:text-[#d2d2d2]",
              editor.isActive("heading") ? "text-[#413f39]" : "text-[#8d8c88]",
            )}
          />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-24 rounded-[5px] px-0! py-2.5! shadow-[0_6px_12px_#0003]!" align="center">
        {[1, 2, 3, 4, 5, 6].map((heading) => (
          <button
            key={heading}
            onClick={() => {
              editor
                .chain()
                .focus()
                .toggleHeading({ level: heading as any })
                .run();
              setOpen(false);
            }}
            disabled={
              !editor
                .can()
                .chain()
                .focus()
                .toggleHeading({ level: heading as any })
                .run()
            }
            className={cn(
              "flex w-full cursor-pointer items-center justify-center px-4 py-1.5 text-xs transition-colors hover:bg-gray-100 focus:ring-0 focus:outline-none disabled:opacity-50",
              editor.isActive("heading", { level: heading }) && "font-bold",
            )}
          >
            {`Heading ${heading}`}
          </button>
        ))}
      </PopoverContent>
    </Popover>
  );
}
