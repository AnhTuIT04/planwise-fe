"use client";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import useModal from "@/hooks/use-modal";

export default function ConfirmModal() {
  const { type, isOpen, data, closeModal, onSubmit, isSubmitting } = useModal<"CONFIRM">();

  if (type !== "CONFIRM") return null;

  const handleConfirm = async () => {
    await onSubmit();
    closeModal();
  };

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{data.title || "Are you sure?"}</DialogTitle>
          <DialogDescription>
            {data.description || "This action cannot be undone."}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={closeModal} disabled={isSubmitting}>
            {data.cancelText || "Cancel"}
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="bg-linear-to-r from-[#D60808] to-[#700404] text-white transition-colors duration-500 hover:cursor-pointer hover:bg-linear-to-r hover:from-[#700404] hover:to-[#D60808]"
          >
            {data.confirmText || "Confirm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
