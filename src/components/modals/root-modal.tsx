"use client";

import { Dialog } from "@/components/ui/dialog";
import useModal from "@/hooks/useModal";
import AddUpdateTaskModal from "./project/add-update-task-modal";
import DeleteModal from "./delete-modal";

export default function RootModal() {
  const { isOpen, type, closeModal } = useModal();

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeModal()}>
      {type === "ADD_UPDATE_TASK" && <AddUpdateTaskModal />}
      {type === "DELETE" && <DeleteModal />}
    </Dialog>
  );
}
