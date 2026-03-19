"use client";

import { Dialog } from "@/components/ui/dialog";
import useModal from "@/hooks/useModal";
// import AddUpdateTaskModal from "./project/add-update-task-modal";
import AddMemberModal from "./project/add-member-modal";
import EditMemberModal from "./project/edit-member-modal";
import AssignTaskModal from "./project/assign-task-modal";
import AddUpdateProjectModal from "./project/add-update-project-modal";
import DeleteModal from "./delete-modal";
import ConfirmModal from "./confirm-modal";
import TaskModal from "./task/task-modal";
import CreateUpdateEventModal from "./calendar/create-update-event-modal";

export default function RootModal() {
  const { isOpen, type, closeModal } = useModal();

  return (
    <>
      {/* Main modals that use Dialog wrapper */}
      <Dialog open={isOpen && type !== "ASSIGN_TASK"} onOpenChange={(open) => !open && closeModal()}>
        {type === "ADD_UPDATE_TASK" && <TaskModal />}
        {type === "ADD_MEMBER" && <AddMemberModal />}
        {type === "EDIT_MEMBER" && <EditMemberModal />}
        {type === "DELETE" && <DeleteModal />}
        {type === "CONFIRM" && <ConfirmModal />}
        {type === "ADD_UPDATE_PROJECT" && <AddUpdateProjectModal />}
        {type === "CREATE_UPDATE_EVENT" && <CreateUpdateEventModal />}
      </Dialog>

      {/* Assign modal renders independently to avoid closing task modal */}
      {type === "ASSIGN_TASK" && <AssignTaskModal />}
    </>
  );
}
