// components/task-management/FilterBar/DateFilterDropdown.tsx
import { Button } from "@/components/ui/button";
import { format, isToday, addDays, subDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isWithinInterval, startOfDay, endOfDay, addMonths, subMonths } from "date-fns";
import { useState,Dispatch, SetStateAction, useRef, useEffect } from "react";
interface DateFilterDropdownProps {
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
}

export default function DateFilterDropdown({
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
}: DateFilterDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleGoToToday = () => {
    setIsFilterLoading(true);
    const today = new Date();
    setSelectedDate(today);
    setCalendarMonth(today);
    setTimeout(() => {
      setDateFilter("selected_date");
      setShowDropdown(false);
      setIsFilterLoading(false);
    }, 300);
  };

  const handleDateSelect = (date: Date) => {
    if (isSelectingRange) {
      if (!dateRange.start || dateRange.end) {
        setDateRange({ start: date, end: null });
      } else {
        const start = dateRange.start;
        const end = date;
        setDateRange({
          start: start < end ? start : end,
          end: start < end ? end : start,
        });
        setTimeout(() => {
          setDateFilter("date_range");
          setShowDropdown(false);
          setIsSelectingRange(false);
          setIsFilterLoading(false);
        }, 500);
      }
    } else {
      setIsFilterLoading(true);
      setSelectedDate(date);
      setTimeout(() => {
        setDateFilter("selected_date");
        setShowDropdown(false);
        setIsFilterLoading(false);
      }, 300);
    }
  };

  const getLabel = () => {
    if (dateFilter === "selected_date") return isToday(selectedDate) ? "Today" : format(selectedDate, "MMM dd");
    if (dateFilter === "date_range" && dateRange.start && dateRange.end)
      return `${format(dateRange.start, "MMM dd")} - ${format(dateRange.end, "MMM dd")}`;
    return "Today";
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant={dateFilter !== "all" ? "default" : "outline"}
        size="sm"
        onClick={() => setShowDropdown(!showDropdown)}
        disabled={isFilterLoading}
      >
        {isFilterLoading ? (
          <>Loading...</>
        ) : (
          <>
            {getLabel()}
            <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </>
        )}
      </Button>

      {showDropdown && (
        <div className="absolute top-full left-0 z-50 mt-1 w-80 rounded-md border bg-white shadow-lg p-4">
          {/* Quick Actions */}
          <div className="space-y-2 border-b pb-4 mb-4">
            <button onClick={() => { setDateFilter("all"); setShowDropdown(false); }} className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 text-sm">
              All Tasks
            </button>
            <button onClick={handleGoToToday} className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 text-sm flex justify-between">
              <span>Go to today</span>
              <span className="text-xs text-gray-400">⌘ Space</span>
            </button>
            {!isSelectingRange ? (
              <button
                onClick={() => setIsSelectingRange(true)}
                className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 text-sm"
              >
                Select date range
              </button>
            ) : (
              <button
                onClick={() => {
                  setIsSelectingRange(false);
                  setDateRange({ start: null, end: null });
                }}
                className="text-xs text-red-600"
              >
                Cancel
              </button>
            )}
          </div>

          {/* Calendar */}
          <div>
            <div className="flex justify-between mb-2">
              <button onClick={() => setCalendarMonth(subMonths(calendarMonth, 1))}>{"<"}</button>
              <span className="font-medium text-sm">{format(calendarMonth, "MMMM yyyy")}</span>
              <button onClick={() => setCalendarMonth(addMonths(calendarMonth, 1))}>{">"}</button>
            </div>
            <div className="grid grid-cols-7 gap-1 text-xs">
              {["M", "T", "W", "TH", "F", "SA", "S"].map(d => (
                <div key={d} className="text-center text-gray-500">{d}</div>
              ))}
              {Array(startOfMonth(calendarMonth).getDay()).fill(null).map((_, i) => (
                <div key={i} />
              ))}
              {eachDayOfInterval({ start: startOfMonth(calendarMonth), end: endOfMonth(calendarMonth) }).map(day => {
                const isSelected = dateFilter === "selected_date" && isSameDay(day, selectedDate);
                const isInRange = dateRange.start && dateRange.end && isWithinInterval(day, { start: dateRange.start, end: dateRange.end });
                const isStart = dateRange.start && isSameDay(day, dateRange.start);
                const isEnd = dateRange.end && isSameDay(day, dateRange.end);

                return (
                  <button
                    key={day.toISOString()}
                    onClick={() => handleDateSelect(day)}
                    className={`
                      p-2 rounded transition-colors
                      ${!isSameMonth(day, calendarMonth) ? "text-gray-300" : ""}
                      ${isSelected || isStart || isEnd ? "bg-blue-500 text-white" : ""}
                      ${isInRange && !isStart && !isEnd ? "bg-blue-100" : ""}
                      ${isToday(day) ? "font-bold" : ""}
                    `}
                  >
                    {format(day, "d")}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}