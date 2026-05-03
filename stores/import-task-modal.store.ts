import { create } from "zustand";

interface ImportTaskModalStore {
  isOpen: boolean;
  taskId: string;
  projectId: string;
  openModal: (taskId: string, projectId: string) => void;
  closeModal: () => void;
}

export const useImportTaskModalStore = create<ImportTaskModalStore>((set) => ({
  isOpen: false,
  taskId: "",
  projectId: "",
  openModal: (taskId, projectId) => set({ isOpen: true, taskId, projectId }),
  closeModal: () => set({ isOpen: false, taskId: "", projectId: "" }),
}));
