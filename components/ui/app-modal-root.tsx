"use client";

import AddTaskModal from "@/components/task/modals/add-task-modal";
import UpdateTaskModal from "@/components/task/modals/update-task.modal";

export function AppModalRoot() {
  return (
    <>
      <AddTaskModal />
      <UpdateTaskModal />
    </>
  );
}
