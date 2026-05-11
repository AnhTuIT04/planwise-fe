import { create } from "zustand";
import { IProject } from "@/types/project.type";

export type ProjectModalStep = "form" | "roles" | "sections" | "invite";

type ProjectStoreState = {
  mode: "add" | "update";
  open: boolean;
  setOpen: (open: boolean) => void;

  project?: IProject;

  step: ProjectModalStep;
  setStep: (step: ProjectModalStep) => void;

  createdProjectId: string | null;
  setCreatedProjectId: (id: string | null) => void;

  openModal: (state: { mode: "add" | "update"; project?: IProject }) => void;
  closeModal: () => void;
  setField: <K extends keyof IProject>(key: K, value: IProject[K]) => void;
};

export const useProjectModalStore = create<ProjectStoreState>()((set) => ({
  mode: "add",
  open: false,
  setOpen: (open) => set(() => ({ open })),

  project: undefined,

  step: "form",
  setStep: (step) => set(() => ({ step })),

  createdProjectId: null,
  setCreatedProjectId: (createdProjectId) => set(() => ({ createdProjectId })),

  openModal: ({ mode, project }) =>
    set(() => ({
      mode,
      open: true,
      project,
      step: "form",
      createdProjectId: null,
    })),
  closeModal: () =>
    set(() => ({
      open: false,
      project: undefined,
      step: "form",
      createdProjectId: null,
    })),
  setField: (key, value) =>
    set((prev) => ({
      project: { ...(prev.project || {}), [key]: value } as IProject,
    })),
}));
