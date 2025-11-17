import {
  isSameDay,
  isWithinInterval,
  startOfDay,
  endOfDay,
  parseISO,
} from "date-fns";
import { ITask } from "@/types/task.type";

interface FilterOptions {
  dateFilter: "all" | "selected_date" | "date_range";
  selectedDate: Date;
  dateRange: { start: Date | null; end: Date | null };
}

/**
 * Lọc danh sách task theo điều kiện ngày
 * @param tasks Danh sách task cần lọc
 * @param options Cấu hình filter
 * @returns Task[] đã lọc
 */
export function filterTasksByDate(
  tasks: ITask[],
  options: FilterOptions
): ITask[] {
  const { dateFilter, selectedDate, dateRange } = options;

  if (dateFilter === "all") return tasks;

  return tasks.filter((task) => {
    const startDate = task.startDate ? parseISO(task.startDate) : null;
    const dueDate = task.dueDate ? parseISO(task.dueDate) : null;

    if (dateFilter === "selected_date") {
      return (
        (startDate && isSameDay(startDate, selectedDate)) ||
        (dueDate && isSameDay(dueDate, selectedDate))
      );
    }

    if (dateFilter === "date_range" && dateRange.start && dateRange.end) {
      const rangeStart = startOfDay(dateRange.start);
      const rangeEnd = endOfDay(dateRange.end);

      const taskStartInRange = startDate && isWithinInterval(startDate, { start: rangeStart, end: rangeEnd });
      const taskEndInRange = dueDate && isWithinInterval(dueDate, { start: rangeStart, end: rangeEnd });

      // Task kéo dài xuyên suốt range
      const taskSpansRange =
        startDate &&
        dueDate &&
        startDate <= rangeStart &&
        dueDate >= rangeEnd;

      return taskStartInRange || taskEndInRange || taskSpansRange;
    }

    return true;
  });
}