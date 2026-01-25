import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type LeftSidebarItem = "my-tasks" | "notifications" | "reviews" | "invitations" | "projects";
export type RightSidebarItem = "calendar" | "mail" | "notion" | "search";
export type ProjectSidebarItem = "overview" | "workspace" | "channels" | "members" | "roles";

interface SidebarState {
  // Left sidebar state
  leftSidebarExpanded: boolean;
  leftSidebarActiveItem: LeftSidebarItem | null;

  // Right sidebar state
  rightSidebarExpanded: boolean;
  rightSidebarActiveItem: RightSidebarItem;

  // Project sidebar state
  projectSidebarActiveItem: ProjectSidebarItem;

  // Actions
  toggleLeftSidebar: () => void;
  setLeftSidebarExpanded: (expanded: boolean) => void;
  setLeftSidebarActiveItem: (item: LeftSidebarItem | null) => void;

  toggleRightSidebar: () => void;
  setRightSidebarExpanded: (expanded: boolean) => void;
  setRightSidebarActiveItem: (item: RightSidebarItem) => void;

  setProjectSidebarActiveItem: (item: ProjectSidebarItem) => void;
}

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set) => ({
      // Initial state
      leftSidebarExpanded: true,
      leftSidebarActiveItem: null,

      rightSidebarExpanded: false,
      rightSidebarActiveItem: "search",

      projectSidebarActiveItem: "overview",

      // Actions
      toggleLeftSidebar: () =>
        set((state) => ({
          leftSidebarExpanded: !state.leftSidebarExpanded,
        })),

      setLeftSidebarExpanded: (expanded) =>
        set(() => ({
          leftSidebarExpanded: expanded,
        })),

      setLeftSidebarActiveItem: (item) =>
        set(() => ({
          leftSidebarActiveItem: item,
        })),

      toggleRightSidebar: () =>
        set((state) => ({
          rightSidebarExpanded: !state.rightSidebarExpanded,
        })),

      setRightSidebarExpanded: (expanded) =>
        set(() => ({
          rightSidebarExpanded: expanded,
        })),

      setRightSidebarActiveItem: (item) =>
        set(() => ({
          rightSidebarActiveItem: item,
        })),

      setProjectSidebarActiveItem: (item) =>
        set(() => ({
          projectSidebarActiveItem: item,
        })),
    }),

    {
      name: "sidebar-storage",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        leftSidebarExpanded: state.leftSidebarExpanded,
        rightSidebarExpanded: state.rightSidebarExpanded,
        rightSidebarActiveItem: state.rightSidebarActiveItem,
        projectSidebarActiveItem: state.projectSidebarActiveItem,
      }),
    },
  ),
);
