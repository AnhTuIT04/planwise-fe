import { create } from "zustand";

import { ITaskPriority, ITaskStatus } from "@/types/task.type";

export type TaskQueryState = {
  deadlineFrom?: string;
  deadlineTo?: string;
  sections?: string[];
  statuses?: ITaskStatus[];
  priorities?: ITaskPriority[];
  q?: string;
};

type TaskQueryStore = {
  queries: Record<string, TaskQueryState>;

  setQuery: (projectId: string, data: Partial<TaskQueryState>) => void;
  setField: <K extends keyof TaskQueryState>(projectId: string, key: K, value: TaskQueryState[K]) => void;
  getQuery: (projectId: string) => TaskQueryState;
  clearQuery: (projectId: string) => void;
};

const getDefaultQuery = (): TaskQueryState => ({
  deadlineFrom: undefined,
  deadlineTo: undefined,
  sections: [],
  statuses: [],
  priorities: [],
  q: "",
});

export const useTaskQueryStore = create<TaskQueryStore>((set, get) => ({
  queries: {},

  setQuery: (projectId, data) =>
    set((state) => {
      const prev = state.queries[projectId] ?? getDefaultQuery();

      return {
        queries: {
          ...state.queries,
          [projectId]: {
            ...prev,
            ...data,
          },
        },
      };
    }),

  setField: (projectId, key, value) =>
    set((state) => {
      const prev = state.queries[projectId] ?? getDefaultQuery();

      return {
        queries: {
          ...state.queries,
          [projectId]: {
            ...prev,
            [key]: value,
          },
        },
      };
    }),

  getQuery: (projectId) => {
    return get().queries[projectId] ?? getDefaultQuery();
  },

  clearQuery: (projectId) =>
    set((state) => {
      const newQueries = { ...state.queries };
      delete newQueries[projectId];
      return { queries: newQueries };
    }),
}));
