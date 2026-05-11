import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { IReviewPeriod } from "@/types/review.type";

interface ReviewState {
  period: IReviewPeriod;
  anchor: string;

  setPeriod: (period: IReviewPeriod) => void;
  setAnchor: (anchor: string) => void;
  shiftAnchor: (direction: -1 | 1) => void;
  resetToToday: () => void;
}

const todayISO = () => new Date().toISOString().slice(0, 10);

const shift = (anchorISO: string, period: IReviewPeriod, direction: -1 | 1): string => {
  const [y, m, d] = anchorISO.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  if (period === "month") {
    date.setMonth(date.getMonth() + direction);
  } else {
    date.setDate(date.getDate() + 7 * direction);
  }
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

export const useReviewStore = create<ReviewState>()(
  persist(
    (set, get) => ({
      period: "month",
      anchor: todayISO(),

      setPeriod: (period) => set({ period }),
      setAnchor: (anchor) => set({ anchor }),
      shiftAnchor: (direction) => set({ anchor: shift(get().anchor, get().period, direction) }),
      resetToToday: () => set({ anchor: todayISO() }),
    }),
    {
      name: "review-storage",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
