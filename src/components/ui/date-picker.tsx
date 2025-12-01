"use client";

import * as React from "react";
import { CalendarIcon, X, ChevronLeft, ChevronRight } from "lucide-react";
import type { DateRange } from "react-day-picker";
import { format, addDays, subDays, startOfDay, endOfDay, isToday, isTomorrow, isYesterday, isSameYear, isSameDay } from "date-fns";
import { vi } from "date-fns/locale";

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
  
  // Use controlled or uncontrolled mode
  const [internalRange, setInternalRange] = React.useState<DateRange | undefined>({
    from: startOfDay(new Date()),
    to: endOfDay(new Date()),
  });
  
  const range = value !== undefined ? value : internalRange;
  
  const setRange = React.useCallback((newRange: DateRange | undefined) => {
    if (onChange) {
      onChange(newRange);
    } else {
      setInternalRange(newRange);
    }
  }, [onChange]);

  const setDayRange = React.useCallback((day: Date) => {
    const newRange = {
      from: startOfDay(day),
      to: endOfDay(day),
    };
    setRange(newRange);
  }, [setRange]);

  const resetToToday = () => {
    setDayRange(new Date());
    setOpen(false);
  };

  const goToToday = () => {
    setDayRange(new Date());
    setOpen(false);
  };
  const resetToDefault = () => {
    setRange(undefined);
    setOpen(false);
  }

  const goToNextDay = () => {
    if (range?.from) {
      setDayRange(addDays(range.from, 1));
    }
  };

  const goToPreviousDay = () => {
    if (range?.from) {
      setDayRange(subDays(range.from, 1));
    }
  };

  const handleSelect = (selected: DateRange | undefined) => {
    setRange(selected);
  };

  const formatRangeLabel = (range?: DateRange): string => {
    if (!range?.from) return "Pick a date";
    
    const { from, to } = range;

    // Single day selected
    if (!to || isSameDay(from, to)) {
      if (isToday(from)) return "Today";
      if (isTomorrow(from)) return "Tomorrow";
      if (isYesterday(from)) return "Yesterday";

      const now = new Date();
      if (isSameYear(from, now)) return format(from, "MMM d");
      return format(from, "MMM d yy");
    }

    // Date range
    const now = new Date();
    const sameYear = isSameYear(from, to) && isSameYear(from, now);
    if (sameYear) return `${format(from, "MMM d")} → ${format(to, "MMM d")}`;
    return `${format(from, "MMM d yy")} → ${format(to, "MMM d yy")}`;
  };

  const label = formatRangeLabel(range);

  const isTodayRange = range?.from && isToday(range.from) && (!range.to || isSameDay(range.from, range.to));

  return (
    <div className={`relative inline-flex items-center gap-1 ${className || ""}`}>
      {/* Previous Day Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={goToPreviousDay}
        className="h-7 w-7 cursor-pointer"
        title="Previous day"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={`text-muted-foreground relative h-7 w-auto min-w-[100px] cursor-pointer justify-center gap-2 px-2! ${isTodayRange ? "" : "pr-7!"} rounded-[6px] text-[12px] font-semibold`}
          >
            <CalendarIcon className="h-4 w-4" />
            <span>{label}</span>
          </Button>
        </PopoverTrigger>

        <PopoverContent align="center" sideOffset={4} className="relative w-auto px-0! pt-2! pb-3!">
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
              onClick={resetToDefault}
            >
              <span>Reset to default</span>
            </div>
          </div>

          <Separator />

          <Calendar
            mode="range"
            selected={range}
            onSelect={handleSelect}
            numberOfMonths={1}
            locale={vi}
            autoFocus
            className="mt-2 px-3 py-0"
          />
        </PopoverContent>
      </Popover>

      {/* Next Day Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={goToNextDay}
        className="h-7 w-7 cursor-pointer"
        title="Next day"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>

      {/* Reset to Today */}
      {!isTodayRange && (
        <button
          onClick={resetToToday}
          className="text-muted-foreground hover:text-foreground absolute right-10 cursor-pointer text-[12px] font-semibold"
          title="Reset to today"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </div>
  );
}
