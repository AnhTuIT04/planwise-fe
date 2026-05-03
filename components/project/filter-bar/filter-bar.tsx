// components/task-management/FilterBar/FilterBar.tsx
import { Dispatch, SetStateAction } from "react";
import DateFilterDropdown from "./date-filter-dropdown";
import SectionFilterDropdown from "./section-filter-dropdown";
import { ISection } from "@/types/section.type";

interface FilterBarProps {
  dateFilter: "all" | "selected_date" | "date_range";
  setDateFilter: Dispatch<SetStateAction<"all" | "selected_date" | "date_range">>;
  selectedDate: Date;
  setSelectedDate: Dispatch<SetStateAction<Date>>;
  dateRange: { start: Date | null; end: Date | null };
  setDateRange: Dispatch<SetStateAction<{ start: Date | null; end: Date | null }>>;
  isSelectingRange: boolean;
  setIsSelectingRange: Dispatch<SetStateAction<boolean>>;
  calendarMonth: Date;
  setCalendarMonth: Dispatch<SetStateAction<Date>>;
  isFilterLoading: boolean;
  setIsFilterLoading: Dispatch<SetStateAction<boolean>>;
  sections: ISection[];
  selectedSectionIds: string[];
  setSelectedSectionIds: Dispatch<SetStateAction<string[]>>;
}

export default function FilterBar({
  dateFilter,
  setDateFilter,
  selectedDate,
  setSelectedDate,
  dateRange,
  setDateRange,
  isSelectingRange,
  setIsSelectingRange,
  calendarMonth,
  setCalendarMonth,
  isFilterLoading,
  setIsFilterLoading,
  sections,
  selectedSectionIds,
  setSelectedSectionIds,
}: FilterBarProps) {
  return (
    <div className="mb-4 flex items-center gap-2">
      <DateFilterDropdown
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        dateRange={dateRange}
        setDateRange={setDateRange}
        isSelectingRange={isSelectingRange}
        setIsSelectingRange={setIsSelectingRange}
        calendarMonth={calendarMonth}
        setCalendarMonth={setCalendarMonth}
        isFilterLoading={isFilterLoading}
        setIsFilterLoading={setIsFilterLoading}
      />

      <SectionFilterDropdown
        sections={sections}
        selectedSectionIds={selectedSectionIds}
        setSelectedSectionIds={setSelectedSectionIds}
        isFilterLoading={isFilterLoading}
        setIsFilterLoading={setIsFilterLoading}
      />
    </div>
  );
}