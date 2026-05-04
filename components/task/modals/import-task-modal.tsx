"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useImportTaskModalStore } from "@/stores/import-task-modal.store";
import { useProject } from "@/hooks/use-project";
import { useSection } from "@/hooks/use-section";
import { useTaskMutations } from "@/hooks/use-task";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

export default function ImportTaskModal() {
  const { user } = useAuth();
  const { isOpen, taskId, projectId, closeModal } = useImportTaskModalStore();
  const { data: projects } = useProject();
  const personalProject = projects?.find((p) => p.id === user?.workspaceId);
  const { data: sections, isLoading: isLoadingSections } = useSection(user?.workspaceId || "");
  const { importTaskMutation } = useTaskMutations();

  const [selectedSectionId, setSelectedSectionId] = useState<string>("");

  useEffect(() => {
    if (sections && sections.length > 0 && !selectedSectionId) {
      setSelectedSectionId(sections[0].id);
    }
  }, [sections, selectedSectionId]);

  const handleImport = async () => {
    if (!selectedSectionId) {
      toast.error("Please select a section");
      return;
    }

    try {
      await importTaskMutation.mutateAsync({
        taskId,
        payload: {
          fromProjectId: projectId,
          toSectionId: selectedSectionId,
          insertAt: 0,
        },
      });
      toast.success("Task imported successfully");
      closeModal();
    } catch (error) {
      console.error("Failed to import task:", error);
      toast.error("Failed to import task");
    }
  };
  console.log("sections", sections);

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Import to My Tasks</DialogTitle>
          <DialogDescription>Select a section in your personal project to import this task.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {isLoadingSections ? (
            <div className="flex justify-center py-4 text-sm text-gray-500">Loading sections...</div>
          ) : (
            <div className="flex flex-col gap-2">
              {sections?.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setSelectedSectionId(section.id)}
                  className={cn(
                    "flex items-center justify-between rounded-md border p-3 text-sm transition-colors hover:bg-gray-50",
                    selectedSectionId === section.id ? "border-blue-500 bg-blue-50/50" : "border-gray-200",
                  )}
                >
                  <span className="font-medium text-gray-700">{section.name}</span>
                  {selectedSectionId === section.id && <Check className="h-4 w-4 text-blue-500" />}
                </button>
              ))}
              {sections?.length === 0 && (
                <div className="py-4 text-center text-sm text-gray-500">
                  No sections found in your personal project.
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={closeModal}>
            Cancel
          </Button>
          <Button
            onClick={handleImport}
            disabled={!selectedSectionId || importTaskMutation.isPending}
            className="bg-[#2ca7ff] text-white hover:bg-[#2ca7ff]/90"
          >
            {importTaskMutation.isPending ? "Importing..." : "Import"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
