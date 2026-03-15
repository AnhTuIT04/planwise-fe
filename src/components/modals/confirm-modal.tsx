"use client";

import { Button } from "@/components/ui/button";
import { DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import useModal from "@/hooks/useModal";

export default function ConfirmModal() {
  const { data, isSubmitting, onSubmit, closeModal } = useModal<"CONFIRM">();

  const handleConfirm = async () => {
    await onSubmit();
  };

  return (
    <DialogContent className="rounded-[10px] px-6 py-5 sm:max-w-[450px]">
      <DialogHeader>
        <DialogTitle className="text-xl font-semibold">{data?.title || "Confirm Action"}</DialogTitle>
        {data?.description && (
          <DialogDescription className="text-muted-foreground text-sm">
            {data.description}
          </DialogDescription>
        )}
      </DialogHeader>

      <DialogFooter className="mt-4">
        <Button
          type="button"
          variant="outline"
          onClick={closeModal}
          disabled={isSubmitting}
          className="cursor-pointer"
        >
          {data?.cancelText || "Cancel"}
        </Button>
        <Button
          type="button"
          variant="destructive"
          onClick={handleConfirm}
          disabled={isSubmitting}
          className="cursor-pointer bg-linear-to-r from-[#D60808] to-[#700404] font-medium text-white transition-colors duration-500 hover:bg-linear-to-r hover:from-[#700404] hover:to-[#D60808]"
        >
          {isSubmitting ? "Processing..." : data?.confirmText || "Confirm"}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
