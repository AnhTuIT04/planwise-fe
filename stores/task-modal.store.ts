import { ITask, ITaskStatus } from "@/types/task.type";
import { create } from "zustand";

interface TaskModalState extends ITask {
  projectId: string;
  sectionId: string;
  position: number;
}

type StoreState = {
  mode: "add" | "update";
  open: boolean;
  setOpen: (open: boolean) => void;

  task: TaskModalState;

  setModalData: (data: Partial<TaskModalState>) => void;
  openModal(state: Partial<TaskModalState> & { mode: "add" | "update" }): void;
  setField: <K extends Exclude<keyof TaskModalState, "status">>(key: K, value: TaskModalState[K]) => void;
  setStatus: (newStatus: ITaskStatus) => void;
  addSubtask: () => void;
  deleteSubtask: (subtaskId: string) => void;
  setSubtaskField: <K extends Exclude<keyof TaskModalState["subtasks"][number], "status">>(
    subtaskId: string,
    key: K,
    value: TaskModalState["subtasks"][number][K],
  ) => void;
  setSubtaskStatus: (subtaskId: string, newStatus: ITaskStatus) => void;
  clear: () => void;
};

const getInitialState = (): TaskModalState => ({
  projectId: "",
  sectionId: "",
  position: 0,
  id: "",
  title: "",
  description: "",
  status: "TODO",
  priority: "NORMAL",
  estimate: 20 * 60 * 1000, // default 20 mins in ms
  spent: 0,
  lastStarted: new Date().toISOString(),
  deadline: null,
  supervisor: null,
  assignees: [],
  subtasks: [],
  canImport: false,
  isImported: false,
  originalProject: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

export const useTaskModalStore = create<StoreState>()((set) => ({
  mode: "add",
  open: false,
  setOpen: (open) => set(() => ({ open })),

  task: getInitialState(),

  setModalData: (data) =>
    set((prev) => ({
      task: {
        ...prev.task,
        ...data,
      },
    })),
  openModal: ({ mode, ...data }) =>
    set((prev) => ({
      mode: mode,
      open: true,
      task: {
        ...prev.task,
        ...data,
      },
    })),
  setField: (key, value) => {
    if (key === "estimate") {
      set((prev) => ({
        task: {
          ...prev.task,
          // if there are subtasks, parent task's estimate is sum of subtasks' estimates and cannot be set directly
          estimate: prev.task.subtasks.length > 0 ? prev.task.estimate : (value as number),
        },
      }));
      return;
    }

    set((prev) => ({
      task: {
        ...prev.task,
        [key]: value,
      },
    }));
  },
  setStatus: (newStatus) => {
    if (newStatus === "DONE") {
      // if setting parent task to DONE, set all subtasks to DONE
      set((prev) => ({
        task: {
          ...prev.task,
          status: newStatus,
          subtasks: prev.task.subtasks.map((st) => ({
            ...st,
            status: newStatus,
          })),
        },
      }));
      return;
    }

    if (newStatus === "TODO") {
      // if setting parent task to TODO, set all RUNNING subtasks to TODO
      set((prev) => ({
        task: {
          ...prev.task,
          status: newStatus,
          subtasks: prev.task.subtasks.map((st) => ({
            ...st,
            status: st.status === "RUNNING" ? newStatus : st.status,
          })),
        },
      }));
      return;
    }

    set((prev) => ({
      task: {
        ...prev.task,
        status: newStatus,
      },
    }));
  },
  addSubtask: () =>
    set((prev) => ({
      task: {
        ...prev.task,
        estimate: prev.task.subtasks.length > 0 ? prev.task.estimate + 20 * 60 * 1000 : 20 * 60 * 1000,
        subtasks: [
          ...prev.task.subtasks,
          {
            id: `temp-${Date.now()}`,
            title: "",
            status: "TODO",
            estimate: 20 * 60 * 1000, // default 20 mins in ms
            spent: 0,
            lastStarted: new Date().toISOString(),
            assignees: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ],
      },
    })),
  deleteSubtask: (subtaskId) =>
    set((prev) => ({
      task: {
        ...prev.task,
        estimate: prev.task.estimate - (prev.task.subtasks.find((st) => st.id === subtaskId)?.estimate || 0), // remove subtask's estimate from parent task
        subtasks: prev.task.subtasks.filter((st) => st.id !== subtaskId),
      },
    })),
  setSubtaskField: (subtaskId, key, value) => {
    if (key === "estimate") {
      set((prev) => ({
        task: {
          ...prev.task,
          estimate: prev.task.subtasks.reduce(
            (total, st) => total + (st.id === subtaskId ? (value as number) : st.estimate),
            0,
          ),
          subtasks: prev.task.subtasks.map((st) =>
            st.id === subtaskId
              ? {
                  ...st,
                  estimate: value as number,
                }
              : st,
          ),
        },
      }));
      return;
    }

    set((prev) => ({
      task: {
        ...prev.task,
        subtasks: prev.task.subtasks.map((st) =>
          st.id === subtaskId
            ? {
                ...st,
                [key]: value,
              }
            : st,
        ),
      },
    }));
  },
  setSubtaskStatus: (subtaskId, newStatus) => {
    if (newStatus === "RUNNING") {
      set((prev) => ({
        task: {
          ...prev.task,
          status: "RUNNING", // if any subtask is set to RUNNING, set parent task to RUNNING
          subtasks: prev.task.subtasks.map((st) =>
            st.id === subtaskId
              ? {
                  ...st,
                  status: newStatus,
                }
              : st,
          ),
        },
      }));
      return;
    }

    if (newStatus === "TODO") {
      set((prev) => ({
        task: {
          ...prev.task,
          // if parent task is DONE and any subtask is set to TODO, set parent task to TODO
          status: prev.task.status === "DONE" ? newStatus : prev.task.status,
          subtasks: prev.task.subtasks.map((st) =>
            st.id === subtaskId
              ? {
                  ...st,
                  status: newStatus,
                }
              : st,
          ),
        },
      }));
      return;
    }

    set((prev) => ({
      task: {
        ...prev.task,
        subtasks: prev.task.subtasks.map((st) =>
          st.id === subtaskId
            ? {
                ...st,
                status: newStatus,
              }
            : st,
        ),
      },
    }));
  },
  clear: () => set(() => ({ task: getInitialState() })),
}));
