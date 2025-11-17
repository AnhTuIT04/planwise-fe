"use client";

import { AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import useModal from "@/hooks/useModal";

export interface DeleteModalData {
  title: string;
  description: string;
  itemName?: string;
  itemType?: string;
  isSubmitting: boolean;
}

export default function DeleteModal() {
  const { data, isSubmitting, onSubmit, closeModal } = useModal<"DELETE">();
  const { title, description, subDescription } = data;

  return (
    <DialogContent className="rounded-[5px] px-6 py-5 sm:max-w-[425px]">
      <DialogHeader>
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-red-100 p-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
          </div>
          <DialogTitle className="text-red-600">{title}</DialogTitle>
        </div>
        <DialogDescription>
          {description}
          After performing this action, it cannot be undone.&nbsp;
          {subDescription && <span className="mt-2 text-sm text-gray-600">{subDescription}</span>}
        </DialogDescription>
      </DialogHeader>

      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          onClick={closeModal}
          disabled={isSubmitting}
          className="cursor-pointer border text-gray-600 hover:border-red-300 hover:bg-transparent hover:text-red-700"
        >
          Cancel
        </Button>
        <Button
          type="button"
          variant="destructive"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="cursor-pointer bg-red-600 hover:bg-red-700"
        >
          {isSubmitting ? "Deleting..." : "Confirm"}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
