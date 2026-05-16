"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import useModal from "@/hooks/use-modal";

export default function NotionSectionPickerModal() {
  const { type, isOpen, data, closeModal } = useModal<"NOTION_SECTION_PICKER">();
  const [pickedId, setPickedId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (type !== "NOTION_SECTION_PICKER") return null;

  const handleConfirm = async () => {
    if (!pickedId) return;
    setSubmitting(true);
    try {
      await data.onPick(pickedId);
      closeModal();
      setPickedId(null);
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenChange = (next: boolean) => {
    if (next) return;
    setPickedId(null);
    closeModal();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[460px]">
        <DialogHeader>
          <DialogTitle>Pick a section</DialogTitle>
          <DialogDescription>
            {data.notionPageTitle
              ? `Import "${data.notionPageTitle}" into which section?`
              : "Choose a section to import this Notion page into."}
          </DialogDescription>
        </DialogHeader>

        <div className="flex max-h-[320px] flex-col gap-1 overflow-y-auto py-2">
          {data.sections.length === 0 ? (
            <p className="py-6 text-center text-sm text-gray-500">No sections available.</p>
          ) : (
            data.sections.map((section) => {
              const isActive = pickedId === section.id;
              return (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => setPickedId(section.id)}
                  className={`flex items-center justify-between rounded-md border px-3 py-2 text-left text-sm transition-colors ${
                    isActive
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <span className="truncate">{section.name}</span>
                  {isActive && <span className="text-xs font-medium">Selected</span>}
                </button>
              );
            })
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={submitting}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={!pickedId || submitting}>
            {submitting ? <Loader2 className="mr-2 h-3 w-3 animate-spin" /> : null}
            Import
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
