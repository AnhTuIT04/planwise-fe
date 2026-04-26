import { useRef, useState } from "react";
import { Check, Loader2, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useClickOutside } from "@/hooks/use-click-outside";
import { useSectionMutations } from "@/hooks/use-section";

interface AddTaskButtonProps {
  projectId: string;
}

export default function AddSectionButton({ projectId }: AddTaskButtonProps) {
  const [showForm, setShowForm] = useState(false);
  const [sectionName, setSectionName] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const { createSectionMutation } = useSectionMutations();

  useClickOutside(formRef, () => {
    setShowForm(false);
    setSectionName("");
  });

  const handleAddSection = async () => {
    if (!sectionName.trim()) return;

    await createSectionMutation.mutateAsync({ name: sectionName, projectId });
    setShowForm(false);
    setSectionName("");
  };

  return (
    <div className="p-2">
      {showForm ? (
        <form
          ref={formRef}
          onSubmit={(e) => {
            e.preventDefault();
            handleAddSection();
          }}
          className="group mt-2 flex h-6 w-60 min-w-60 items-center justify-between border border-transparent border-b-[#2ca7ff] text-[16px] font-semibold transition-shadow"
        >
          <Input
            autoFocus
            value={sectionName}
            disabled={createSectionMutation.isPending}
            onChange={(e) => setSectionName(e.target.value)}
            className="h-6 flex-1 rounded-none border-none p-0 text-[16px]! font-semibold text-[#413f39] shadow-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0 disabled:opacity-50"
          />

          <Button
            id="save-section-name-btn"
            size="sm"
            type="submit"
            tabIndex={0}
            disabled={!sectionName.trim() || createSectionMutation.isPending}
            className="h-6 cursor-pointer bg-transparent text-[11px] font-semibold hover:bg-transparent focus-visible:ring-0 focus-visible:outline-none"
          >
            {createSectionMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin text-[#2ca7ff]" />
            ) : (
              <Check className="h-4 w-4 text-[#2ca7ff]" />
            )}
          </Button>
        </form>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="group mt-0.5 flex h-9 w-60 min-w-60 cursor-pointer items-center justify-start rounded border bg-white p-3 px-3 py-1.5 text-[14px] text-[#b4b4b4] shadow-[0_1px_1px_#0000001a] transition-shadow hover:border-[#dcdcdc] hover:shadow-[0_3px_6px_#0000001a]"
        >
          <Plus className="mr-2 h-4 w-4" />
          <span className="group-hover:text-[#413f39]">Add section</span>
        </button>
      )}
    </div>
  );
}
