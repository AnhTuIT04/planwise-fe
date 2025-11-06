// components/task-management/FilterBar/FilterBar.tsx
"use client";

import { Button } from "@/components/ui/button";
import DateFilterDropdown from "./DateFilterDropdown";
import SectionFilterDropdown from "./SectionFilterDropdown";
import { format, isToday } from "date-fns"; // ← THÊM DÒNG NÀY
import { ISection } from "@/types/section.type";

interface FilterBarProps {
  sections: ISection[];
  selectedSectionIds: string[];
  onSectionToggle: (id: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;

  dateFilter: "all" | "selected_date" | "date_range";
  selectedDate: Date;
  dateRange: { start: Date | null; end: Date | null };
  isSelectingRange: boolean;
  calendarMonth: Date;
  showDateFilter: boolean;
  showSectionFilter: boolean;
  isFilterLoading: boolean;

  onToggleDateFilter: () => void;
  onToggleSectionFilter: () => void;
  onDateSelect: (date: Date) => void;
  onRangeStart: () => void;
  onRangeCancel: () => void;
  onResetDate: () => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onGoToToday: () => void;
  onGoToNextDay: () => void;
  onGoToPreviousDay: () => void;
}

export default function FilterBar(props: FilterBarProps) {
  const {
    showDateFilter,
    showSectionFilter,
    isFilterLoading,
    onToggleDateFilter,
    onToggleSectionFilter,
    dateFilter,
    selectedDate,
    dateRange,
    isSelectingRange,
    calendarMonth,
  } = props;

  // Hàm hiển thị label – ĐÃ IMPORT format & isToday
  const getDateFilterLabel = () => {
    if (dateFilter === "selected_date") {
      return isToday(selectedDate) ? "Today" : format(selectedDate, "MMM dd");
    }
    if (dateFilter === "date_range" && dateRange.start && dateRange.end) {
      return `${format(dateRange.start, "MMM dd")} - ${format(dateRange.end, "MMM dd")}`;
    }
    if (isSelectingRange && dateRange.start) {
      return `${format(dateRange.start, "MMM dd")} - ...`;
    }
    return "Today";
  };

  return (
    <div className="mb-4 flex items-center gap-2">
      {/* Date Filter */}
      <div className="relative">
        <Button
          variant={dateFilter !== "all" ? "default" : "outline"}
          size="sm"
          onClick={onToggleDateFilter}
          disabled={isFilterLoading}
        >
          {isFilterLoading ? (
            <>
              <svg className="mr-2 h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Loading...
            </>
          ) : (
            <>
              {getDateFilterLabel()}
              <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </>
          )}
        </Button>

        <DateFilterDropdown
          show={showDateFilter}
          dateFilter={dateFilter}
          selectedDate={selectedDate}
          dateRange={dateRange}
          isSelectingRange={props.isSelectingRange}
          calendarMonth={props.calendarMonth}
          isFilterLoading={isFilterLoading}
          onToggle={onToggleDateFilter}
          onDateSelect={props.onDateSelect}
          onRangeStart={props.onRangeStart}
          onRangeCancel={props.onRangeCancel}
          onResetDate={props.onResetDate}
          onPrevMonth={props.onPrevMonth}
          onNextMonth={props.onNextMonth}
          onGoToToday={props.onGoToToday}
          onGoToNextDay={props.onGoToNextDay}
          onGoToPreviousDay={props.onGoToPreviousDay}
        />
      </div>

      {/* Section Filter */}
      <div className="relative">
        <Button variant="outline" size="sm" onClick={onToggleSectionFilter}>
          Filter
          <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </Button>

        <SectionFilterDropdown
          show={showSectionFilter}
          sections={props.sections}
          selectedSectionIds={props.selectedSectionIds}
          isFilterLoading={isFilterLoading}
          onToggle={onToggleSectionFilter}
          onSectionToggle={props.onSectionToggle}
          onSelectAll={props.onSelectAll}
          onDeselectAll={props.onDeselectAll}
        />
      </div>
    </div>
  );
}