"use client";

import { useState, useEffect, useRef } from "react";
import { Check, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { Popover, PopoverArrow, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const PRIORITIES: string[] = [
  "5m",
  "10m",
  "15m",
  "20m",
  "25m",
  "30m",
  "45m",
  "1h",
  "1h 30m",
  "2h",
  "2h 30m",
  "3h",
  "4h",
  "5h",
  "6h",
  "7h",
  "8h",
  "1d",
  "2d",
  "3d",
  "4d",
  "5d",
  "6d",
  "7d",
];

export default function TaskEstimateTime({
  taskId,
  timeEstimate,
  timeSpent,
}: {
  taskId: string;
  timeEstimate: number;
  timeSpent: number;
}) {
  const [open, setOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [inputClicked, setInputClicked] = useState(false);
  const [day, setDay] = useState(0);
  const [hour, setHour] = useState(0);
  const [min, setMin] = useState(0);

  const dayInputRef = useRef<HTMLInputElement>(null);

  const convertMinutesToTimeString = (totalMinutes: number): string => {
    if (!totalMinutes || totalMinutes <= 0) return "20m";

    const days = Math.floor(totalMinutes / (24 * 60));
    const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
    const minutes = totalMinutes % 60;

    const parts = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);

    return parts.length > 0 ? parts.join(" ") : "0m";
  };

  const displayTimeString = convertMinutesToTimeString(timeEstimate);

  useEffect(() => {
    if (!timeEstimate || timeEstimate <= 0) {
      setDay(0);
      setHour(0);
      setMin(20);
      return;
    }

    const days = Math.floor(timeEstimate / (24 * 60));
    const hours = Math.floor((timeEstimate % (24 * 60)) / 60);
    const minutes = timeEstimate % 60;

    setDay(days);
    setHour(hours);
    setMin(minutes);
  }, [timeEstimate, open]);

  useEffect(() => {
    if (inputClicked && dayInputRef.current) {
      dayInputRef.current.focus();
    }
  }, [inputClicked]);

  const formatValue = (val: number) => val.toString().padStart(2, "0");

  const handleInputChange = (
    setter: React.Dispatch<React.SetStateAction<number>>,
    max: number | null,
    value: string,
  ) => {
    let num = parseInt(value) || 0;
    if (num < 0) num = 0;
    if (max !== null && num >= max) num = max - 1;
    setter(num);
  };

  const handleEstimateTimeChange = async (newEstimateTime: string) => {
    setIsUpdating(true);
    console.log("Saving estimate time:", newEstimateTime, "for task", taskId);
    await new Promise((r) => setTimeout(r, 500));
    setIsUpdating(false);
    setOpen(false);
    setInputClicked(false);
  };

  const handleSave = async () => {
    const formatted = `${formatValue(day)}:${formatValue(hour)}:${formatValue(min)}`;
    await handleEstimateTimeChange(formatted);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <span className="inline-flex cursor-pointer items-center rounded-[5px] bg-[#f0f0f0] px-2 py-0.5 text-[10px] font-semibold text-[#787878]">
          {timeSpent > 0 && (
            <>
              <span>{convertMinutesToTimeString(timeSpent)}</span>
              <span className="mb-0.5 px-1">/</span>
            </>
          )}

          <span>{displayTimeString}</span>
        </span>
      </PopoverTrigger>

      <PopoverContent
        className="relative w-44 rounded-[5px] px-0! py-2.5! shadow-[0_6px_12px_#0003]!"
        align="end"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <PopoverArrow stroke="2" />
        <div className="mb-2 px-4 text-xs font-normal text-[#787878]">Select estimate time</div>

        <form
          className="mb-2 flex items-center justify-between px-4"
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
          onClick={() => setInputClicked(true)}
        >
          <div className="flex items-center space-x-1">
            <Input
              ref={dayInputRef}
              type="number"
              min={0}
              max={99}
              disabled={isUpdating}
              value={formatValue(day)}
              onChange={(e) => handleInputChange(setDay, 100, e.target.value)}
              className="h-6 w-4 [appearance:textfield] border-none p-0 text-center text-xs font-medium text-[#413f39] shadow-none focus-visible:ring-0 focus-visible:outline-none disabled:opacity-50 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
            <span className="text-xs font-semibold text-[#413f39]">:</span>
            <Input
              type="number"
              min={0}
              max={23}
              disabled={isUpdating}
              value={formatValue(hour)}
              onChange={(e) => handleInputChange(setHour, 24, e.target.value)}
              className="h-6 w-4 [appearance:textfield] border-none p-0 text-center text-xs font-medium text-[#413f39] shadow-none focus-visible:ring-0 focus-visible:outline-none disabled:opacity-50 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
            <span className="text-xs font-semibold text-[#413f39]">:</span>
            <Input
              type="number"
              min={0}
              max={59}
              disabled={isUpdating}
              value={formatValue(min)}
              onChange={(e) => handleInputChange(setMin, 60, e.target.value)}
              className="h-6 w-4 [appearance:textfield] border-none p-0 text-center text-xs font-medium text-[#413f39] shadow-none focus-visible:ring-0 focus-visible:outline-none disabled:opacity-50 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
          </div>

          {inputClicked && (
            <Button
              size="sm"
              type="submit"
              tabIndex={-1}
              disabled={isUpdating}
              className="h-6 cursor-pointer bg-transparent text-[11px] font-semibold hover:bg-transparent"
            >
              {isUpdating ? (
                <Loader2 className="h-4 w-4 animate-spin text-[#2ca7ff]" />
              ) : (
                <Check className="h-4 w-4 text-[#2ca7ff]" />
              )}
            </Button>
          )}
        </form>

        <Separator className={cn("h-0! border-b", inputClicked && "border-b-[#2ca7ff]")} />

        <div className="max-h-60 overflow-y-auto">
          {PRIORITIES.map((estimateOption) => (
            <button
              key={estimateOption}
              onClick={() => handleEstimateTimeChange(estimateOption)}
              disabled={isUpdating}
              className="flex w-full cursor-pointer items-center justify-between px-4 py-1.5 text-left text-xs transition-colors hover:bg-gray-100 focus:ring-0 focus:outline-none disabled:opacity-50"
            >
              <span className="inline-flex items-center text-[12px] font-medium text-[#413f39]">{estimateOption}</span>
              {estimateOption === displayTimeString && <Check className="h-4 w-4 text-[#413f39]" />}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
