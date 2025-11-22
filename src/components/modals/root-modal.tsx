"use client";

import { Dialog } from "@/components/ui/dialog";
import useModal from "@/hooks/useModal";
import AddUpdateTaskModal from "./project/add-update-task-modal";
import AddMemberModal from "./project/add-member-modal";
import AssignTaskModal from "./project/assign-task-modal";
import AddUpdateProjectModal from "./project/add-update-project-modal";
import DeleteModal from "./delete-modal";

export default function RootModal() {
  const { isOpen, type, closeModal } = useModal();

  return (
    <Dialog open={isOpen} onOpenChange={(open: boolean) => !open && closeModal()}>
      {type === "ADD_UPDATE_TASK" && <AddUpdateTaskModal />}
      {type === "ADD_MEMBER" && <AddMemberModal />}
      {type === "ASSIGN_TASK" && <AssignTaskModal />}
      {type === "DELETE" && <DeleteModal />}
      {type === "ADD_UPDATE_PROJECT" && <AddUpdateProjectModal />}
    </Dialog>
  );
}
