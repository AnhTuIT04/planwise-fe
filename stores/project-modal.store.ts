import { create } from "zustand";
import { IProject } from "@/types/project.type";

type ProjectStoreState = {
  mode: "add" | "update";
  open: boolean;
  setOpen: (open: boolean) => void;

  project?: IProject;

  openModal: (state: { mode: "add" | "update"; project?: IProject }) => void;
  closeModal: () => void;
  setField: <K extends keyof IProject>(key: K, value: IProject[K]) => void;
};

export const useProjectModalStore = create<ProjectStoreState>()((set) => ({
  mode: "add",
  open: false,
  setOpen: (open) => set(() => ({ open })),

  project: undefined,

  openModal: ({ mode, project }) =>
    set(() => ({
      mode,
      open: true,
      project,
    })),
  closeModal: () => set(() => ({ open: false, project: undefined })),
  setField: (key, value) =>
    set((prev) => ({
      project: { ...(prev.project || {}), [key]: value } as IProject,
    })),
}));
