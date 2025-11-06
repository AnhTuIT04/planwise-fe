"use client";

import { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  format,
  isToday,
  isSameDay,
  isWithinInterval,
  addDays,
  subDays,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  addMonths,
  subMonths,
} from "date-fns";

interface DateFilterDropdownProps {
  dateFilter: "all" | "selected_date" | "date_range";
  selectedDate: Date;
  dateRange: { start: Date | null; end: Date | null };
  isSelectingRange: boolean;
  calendarMonth: Date;
  show: boolean;
  isFilterLoading: boolean;
  onToggle: () => void;
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

export default function DateFilterDropdown({
  dateFilter,
  selectedDate,
  dateRange,
  isSelectingRange,
  calendarMonth,
  show,
  isFilterLoading,
  onToggle,
  onDateSelect,
  onRangeStart,
  onRangeCancel,
  onResetDate,
  onPrevMonth,
  onNextMonth,
  onGoToToday,
  onGoToNextDay,
  onGoToPreviousDay,
}: DateFilterDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        onToggle();
      }
    };
    if (show) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [show, onToggle]);

  const getLabel = () => {
    if (dateFilter === "selected_date") return isToday(selectedDate) ? "Today" : format(selectedDate, "MMM dd");
    if (dateFilter === "date_range" && dateRange.start && dateRange.end)
      return `${format(dateRange.start, "MMM dd")} - ${format(dateRange.end, "MMM dd")}`;
    if (isSelectingRange && dateRange.start) return `${format(dateRange.start, "MMM dd")} - ...`;
    return "Today";
  };

  const generateDays = () => {
    const start = startOfMonth(calendarMonth);
    const end = endOfMonth(calendarMonth);
    const days = eachDayOfInterval({ start, end });
    const startDay = start.getDay();
    return [...Array(startDay).fill(null), ...days];
  };

  if (!show) return null;

  return (
    <div ref={dropdownRef} className="absolute top-full left-0 z-50 mt-1 w-80 rounded-md border bg-white shadow-lg">
      <div className="p-4">
        {/* Quick Actions */}
        <div className="mb-4 space-y-2 border-b pb-4">
          <button
            onClick={onResetDate}
            disabled={isFilterLoading}
            className={`flex w-full items-center justify-between rounded px-3 py-2 text-left text-sm hover:bg-gray-100 ${
              dateFilter === "all" ? "bg-blue-50 text-blue-700" : ""
            }`}
          >
            <span>All Tasks</span>
          </button>
          <button onClick={onGoToToday} disabled={isFilterLoading} className="flex w-full justify-between rounded px-3 py-2 text-left text-sm hover:bg-gray-100">
            <span>Go to today</span>
            <span className="text-xs text-gray-400">⌘ Space</span>
          </button>
          <button onClick={onGoToNextDay} disabled={isFilterLoading} className="flex w-full justify-between rounded px-3 py-2 text-left text-sm hover:bg-gray-100">
            <span>Go to next day</span>
            <span className="text-xs text-gray-400">⌘ →</span>
          </button>
          <button onClick={onGoToPreviousDay} disabled={isFilterLoading} className="flex w-full justify-between rounded px-3 py-2 text-left text-sm hover:bg-gray-100">
            <span>Go to previous day</span>
            <span className="text-xs text-gray-400">⌘ ←</span>
          </button>

          {!isSelectingRange ? (
            <button
              onClick={onRangeStart}
              disabled={isFilterLoading}
              className={`flex w-full justify-between rounded px-3 py-2 text-left text-sm hover:bg-gray-100 ${
                dateFilter === "date_range" ? "bg-blue-50 text-blue-700" : ""
              }`}
            >
              <span>Select date range</span>
            </button>
          ) : (
            <div className="rounded bg-blue-50 px-3 py-2 text-sm">
              <div className="mb-2 flex justify-between">
                <span className="font-medium text-blue-700">
                  {!dateRange.start ? "Click start date" : "Click end date"}
                </span>
                <button onClick={onRangeCancel} className="text-xs text-red-600">Cancel</button>
              </div>
              {dateRange.start && (
                <div className="text-xs text-blue-600">
                  Start: {format(dateRange.start, "MMM dd, yyyy")}
                  {dateRange.end && <div className="mt-1">End: {format(dateRange.end, "MMM dd, yyyy")}</div>}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Calendar */}
        <div>
          <div className="mb-4 flex justify-between">
            <button onClick={onPrevMonth} className="rounded p-1 hover:bg-gray-100">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h3 className="text-sm font-medium">{format(calendarMonth, "MMMM yyyy")}</h3>
            <button onClick={onNextMonth} className="rounded p-1 hover:bg-gray-100">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <div className="mb-2 grid grid-cols-7 gap-1 text-xs text-gray-500">
            {["M", "T", "W", "T", "F", "S", "S"].map((d) => (
              <div key={d} className="p-1 text-center">{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {generateDays().map((day, i) => {
              if (!day) return <div key={i} className="p-2" />;
              const isCurrentMonth = isSameMonth(day, calendarMonth);
              const isTodayDate = isToday(day);
              const isSelected = dateFilter === "selected_date" && isSameDay(day, selectedDate);
              const isRangeStart = dateRange.start && isSameDay(day, dateRange.start);
              const isRangeEnd = dateRange.end && isSameDay(day, dateRange.end);
              const isInRange =
                dateRange.start && dateRange.end && isWithinInterval(day, { start: dateRange.start, end: dateRange.end }) &&
                !isSameDay(day, dateRange.start) && !isSameDay(day, dateRange.end);

              let className = `rounded p-2 text-xs transition-colors hover:bg-gray-100 ${
                !isCurrentMonth ? "text-gray-300" : "text-gray-700"
              }`;
              if (isSelected || isRangeStart || isRangeEnd) className += " bg-blue-500 text-white";
              else if (isInRange) className += " bg-blue-100 text-blue-700";
              else if (isTodayDate) className += " bg-blue-50 text-blue-600 font-semibold";

              return (
                <button
                  key={day.toISOString()}
                  onClick={() => onDateSelect(day)}
                  disabled={isFilterLoading}
                  className={className}
                >
                  {format(day, "d")}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}