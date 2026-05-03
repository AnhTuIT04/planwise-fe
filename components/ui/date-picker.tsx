"use client";

import * as React from "react";
import { CalendarIcon, X } from "lucide-react";
import type { DateRange } from "react-day-picker";
import { format, isToday, isTomorrow, isYesterday, isSameYear, addDays, subDays, startOfDay, endOfDay } from "date-fns";

import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverArrow, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export interface DateRangePickerProps {
  value?: DateRange;
  onChange?: (range: DateRange | undefined) => void;
  className?: string;
}

export function DateRangePicker({ value, onChange, className }: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [range, setRange] = React.useState<DateRange>(value || { from: undefined, to: undefined });

  // Sync internal state with value prop
  React.useEffect(() => {
    if (value) {
      setRange(value);
    }
  }, [value]);

  const setDayRange = (day: Date) => {
    const newRange = {
      from: startOfDay(day),
      to: endOfDay(day),
    };
    setRange(newRange);
    onChange?.(newRange);
  };

  const clearRange = () => {
    setRange({ from: undefined, to: undefined });
    onChange?.(undefined);
    setOpen(false);
  };

  const goToToday = () => {
    setDayRange(new Date());
    setOpen(false);
  };

  const goToNextDay = () => {
    const baseDate = range.from || new Date();
    setDayRange(addDays(baseDate, 1));
    setOpen(false);
  };

  const goToPreviousDay = () => {
    const baseDate = range.from || new Date();
    setDayRange(subDays(baseDate, 1));
    setOpen(false);
  };

  const handleSelect = (selected: DateRange) => {
    setRange(selected);
    onChange?.(selected);
    if (selected?.from && selected?.to) {
      setOpen(false);
    }
  };

  const formatDateLabel = (date: Date): string => {
    if (isToday(date)) return "Today";
    if (isTomorrow(date)) return "Tomorrow";
    if (isYesterday(date)) return "Yesterday";

    const now = new Date();
    if (isSameYear(date, now)) return format(date, "d MMM");
    return format(date, "d MMM y");
  };

  const formatRangeLabel = (range: DateRange): string => {
    if (!range.from) return "Deadline";

    const { from, to } = range;

    // Nếu chỉ có from hoặc from === to
    if (!to || from.toDateString() === to.toDateString()) {
      return formatDateLabel(from);
    }

    // Nếu có range từ from đến to
    const now = new Date();
    const fromLabel = formatDateLabel(from);
    const toLabel = formatDateLabel(to);

    // Nếu cả 2 ngày đều cùng năm hiện tại
    if (isSameYear(from, now) && isSameYear(to, now)) {
      return `${fromLabel} → ${toLabel}`;
    }

    // Nếu from cùng năm hiện tại nhưng to khác năm
    if (isSameYear(from, now) && !isSameYear(to, now)) {
      return `${fromLabel} → ${format(to, "d MMM y")}`;
    }

    // Nếu from khác năm hiện tại nhưng to cùng năm hiện tại
    if (!isSameYear(from, now) && isSameYear(to, now)) {
      return `${format(from, "d MMM y")} → ${toLabel}`;
    }

    // Nếu cả 2 đều khác năm hiện tại
    return `${format(from, "d MMM y")} → ${format(to, "d MMM y")}`;
  };

  const label = formatRangeLabel(range);
  const hasSelection = range.from !== undefined;

  return (
    <div className={`relative inline-flex items-center ${className || ""}`}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={`text-muted-foreground relative h-7 w-auto cursor-pointer justify-start gap-2 px-2! ${hasSelection ? "pr-8!" : ""} rounded-[6px] text-[12px] font-semibold`}
          >
            <CalendarIcon className="h-4 w-4" />
            <span>{label}</span>
          </Button>
        </PopoverTrigger>

        <PopoverContent align="start" sideOffset={4} className="relative w-auto px-0! pt-2! pb-3!">
          <PopoverArrow stroke="2" />

          <div className="mb-2 space-y-1 text-sm">
            <div
              className="hover:bg-accent flex cursor-pointer items-center justify-between px-4 py-1"
              onClick={goToToday}
            >
              <span>Go to today</span>
            </div>
            <div
              className="hover:bg-accent flex cursor-pointer items-center justify-between px-4 py-1"
              onClick={goToNextDay}
            >
              <span>Go to next day</span>
            </div>
            <div
              className="hover:bg-accent flex cursor-pointer items-center justify-between px-4 py-1"
              onClick={goToPreviousDay}
            >
              <span>Go to previous day</span>
            </div>
          </div>

          <Separator />

          <Calendar
            required
            mode="range"
            selected={range}
            onSelect={handleSelect}
            numberOfMonths={1}
            autoFocus
            className="mt-2 px-3 py-0"
          />
        </PopoverContent>
      </Popover>

      {hasSelection && (
        <button
          onClick={clearRange}
          className="text-muted-foreground hover:text-foreground absolute right-2 cursor-pointer text-[12px] font-semibold"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
