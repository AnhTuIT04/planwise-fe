"use client";

import * as React from "react";
import { CalendarIcon, X } from "lucide-react";
import type { DateRange } from "react-day-picker";
import { format, addDays, subDays, startOfDay, endOfDay, isToday, isTomorrow, isYesterday, isSameYear } from "date-fns";

import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverArrow, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export function DateRangePicker() {
  const [open, setOpen] = React.useState(false);
  const [range, setRange] = React.useState<DateRange | undefined>({
    from: startOfDay(new Date()),
    to: endOfDay(new Date()),
  });

  const setDayRange = (day: Date) => {
    setRange({
      from: startOfDay(day),
      to: endOfDay(day),
    });
  };

  const resetToToday = () => {
    setDayRange(new Date());
    setOpen(false);
  };

  const goToToday = () => {
    setDayRange(new Date());
    setOpen(false);
  };
  const goToNextDay = () => {
    if (range?.from) {
      setDayRange(addDays(range.from, 1));
      setOpen(false);
    }
  };
  const goToPreviousDay = () => {
    if (range?.from) {
      setDayRange(subDays(range.from, 1));
      setOpen(false);
    }
  };

  const handleSelect = (selected: DateRange | undefined) => {
    setRange(selected);
  };

  const formatRangeLabel = (range?: DateRange): string => {
    if (!range?.from || !range?.to) return "Pick a date range";

    const { from, to } = range;

    if (from.toDateString() === to.toDateString()) {
      if (isToday(from)) return "Today";
      if (isTomorrow(from)) return "Tomorrow";
      if (isYesterday(from)) return "Yesterday";

      const now = new Date();
      if (isSameYear(from, now)) return format(from, "MMM d");
      return format(from, "MMM d yy");
    }

    const now = new Date();
    const sameYear = isSameYear(from, to) && isSameYear(from, now);
    if (sameYear) return `${format(from, "MMM d")} → ${format(to, "MMM d")}`;
    return `${format(from, "MMM d yy")} → ${format(to, "MMM d yy")}`;
  };

  const label = formatRangeLabel(range);

  const isTodayRange =
    range?.from && range?.to && range.from.toDateString() === range.to.toDateString() && isToday(range.from);

  return (
    <div className="relative inline-flex items-center">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={`text-muted-foreground relative h-7 w-auto cursor-pointer justify-start gap-2 px-2! ${isTodayRange ? "" : "pr-8!"} rounded-[6px] text-[12px] font-semibold`}
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
            mode="range"
            selected={range}
            onSelect={handleSelect}
            numberOfMonths={1}
            autoFocus
            className="mt-2 px-3 py-0"
          />
        </PopoverContent>
      </Popover>

      {!isTodayRange && (
        <button
          onClick={resetToToday}
          className="text-muted-foreground hover:text-foreground absolute right-2 cursor-pointer text-[12px] font-semibold"
          title="Reset to today"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
