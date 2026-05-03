import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type ProjectViewMode = "kanban" | "list";

type ProjectViewStore = {
  modes: Record<string, ProjectViewMode>;
  hasHydrated: boolean;

  getMode: (projectId: string) => ProjectViewMode;
  setMode: (projectId: string, mode: ProjectViewMode) => void;
};

export const useProjectViewStore = create<ProjectViewStore>()(
  persist(
    (set, get) => ({
      modes: {},
      hasHydrated: false,

      getMode: (projectId) => get().modes[projectId] ?? "kanban",

      setMode: (projectId, mode) =>
        set((state) => ({
          modes: { ...state.modes, [projectId]: mode },
        })),
    }),
    {
      name: "planwise:project-view-mode",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ modes: state.modes }),
      onRehydrateStorage: () => (state) => {
        if (state) state.hasHydrated = true;
      },
    },
  ),
);
