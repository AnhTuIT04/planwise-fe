import { create } from "zustand";
import { ITask } from "@/types/task.type";

type AssignTaskStoreState = {
  open: boolean;
  setOpen: (open: boolean) => void;

  task?: ITask;
  projectId?: string;
  previousTask?: any;
  isPersonal?: boolean;
  member?: any;
  isSubtask?: boolean;

  openModal: (state: {
    task?: ITask;
    projectId?: string;
    previousTask?: any;
    isPersonal?: boolean;
    member?: any;
    isSubtask?: boolean;
  }) => void;
  closeModal: () => void;
};

export const useAssignTaskModalStore = create<AssignTaskStoreState>()((set) => ({
  open: false,
  setOpen: (open) => set(() => ({ open })),

  task: undefined,
  projectId: "",
  previousTask: undefined,
  isPersonal: false,
  member: undefined,
  isSubtask: false,

  openModal: ({ task, projectId, previousTask, isPersonal, member, isSubtask }) =>
    set(() => ({
      open: true,
      task,
      projectId,
      previousTask,
      isPersonal,
      member,
      isSubtask,
    })),
  closeModal: () =>
    set(() => ({
      open: false,
      task: undefined,
      projectId: undefined,
      previousTask: undefined,
      member: undefined,
    })),
}));
