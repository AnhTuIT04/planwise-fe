"use client";

import { useState } from "react";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useProjectModalStore } from "@/stores/project-modal.store";
import { createSectionApi } from "@/services/apis/section/create-section.api";

interface CreatedSection {
  id: string;
  name: string;
}

export default function CreateSectionsStep() {
  const setStep = useProjectModalStore((s) => s.setStep);
  const createdProjectId = useProjectModalStore((s) => s.createdProjectId);
  const queryClient = useQueryClient();

  const [sectionName, setSectionName] = useState("");
  const [created, setCreated] = useState<CreatedSection[]>([]);
  const [isAdding, setIsAdding] = useState(false);

  const addSection = async () => {
    if (!createdProjectId) return;
    const name = sectionName.trim();
    if (!name) {
      toast.error("Section name is required");
      return;
    }
    setIsAdding(true);
    try {
      const section = await createSectionApi({ name, projectId: createdProjectId });
      setCreated((prev) => [...prev, { id: section.id, name: section.name }]);
      setSectionName("");
      queryClient.invalidateQueries({ queryKey: ["project-sections", createdProjectId] });
    } catch (error: any) {
      toast.error(error?.message || "Failed to add section");
    } finally {
      setIsAdding(false);
    }
  };

  const goToInvite = () => setStep("invite");

  return (
    <>
      <DialogHeader>
        <DialogTitle>Add sections</DialogTitle>
        <DialogDescription>Step 3 of 4 — Sections</DialogDescription>
      </DialogHeader>

      <div className="space-y-5 py-2">
        <p className="text-sm text-gray-600">
          Sections organize tasks within your project (e.g. <em>To Do</em>, <em>In Progress</em>, <em>Done</em>).
          Add a few now, or skip — you can manage them later.
        </p>

        <div className="space-y-2">
          <Label htmlFor="wizard-section-name">Section name</Label>
          <div className="flex gap-2">
            <Input
              id="wizard-section-name"
              value={sectionName}
              onChange={(e) => setSectionName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addSection();
                }
              }}
              placeholder="e.g., To Do"
            />
            <Button type="button" onClick={addSection} disabled={isAdding || !sectionName.trim()}>
              {isAdding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {created.length > 0 && (
          <div className="rounded-md border bg-gray-50 p-3">
            <p className="mb-2 text-sm font-medium text-gray-700">Sections added:</p>
            <div className="flex flex-wrap gap-2">
              {created.map((s) => (
                <span
                  key={s.id}
                  className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-sm text-gray-700 shadow-sm"
                >
                  {s.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={goToInvite}>
          Skip
        </Button>
        <Button
          type="button"
          onClick={goToInvite}
          className="bg-linear-to-r from-[#D60808] to-[#700404] transition-colors duration-500 hover:cursor-pointer hover:bg-linear-to-r hover:from-[#700404] hover:to-[#D60808]"
        >
          Continue
        </Button>
      </DialogFooter>
    </>
  );
}
