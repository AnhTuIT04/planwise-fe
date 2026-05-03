"use client";

import AddTaskModal from "@/components/task/modals/add-task-modal";
import UpdateTaskModal from "@/components/task/modals/update-task.modal";
import AddUpdateProjectModal from "@/components/project/modals/project-modal-content/add-update-project-modal";
import AddMemberModal from "@/components/project/modals/member-modal-content/add-member-modal";
import EditMemberModal from "@/components/project/modals/member-modal-content/edit-member-modal";
import AssignTaskModal from "@/components/project/modals/member-modal-content/assign-task-modal";
import ImportTaskModal from "@/components/task/modals/import-task-modal";

export function AppModalRoot() {
  return (
    <>
      <AddTaskModal />
      <UpdateTaskModal />
      <AddUpdateProjectModal />
      <AddMemberModal />
      <EditMemberModal />
      <AssignTaskModal />
      <ImportTaskModal />
    </>
  );
}

