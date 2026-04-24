"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Loader2 } from "lucide-react";

import { cn, convertMillisecondsToTimeString, formatTimeLabel } from "@/lib/utils";
import { ITaskStatus } from "@/types/task.type";
import { Popover, PopoverArrow, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const PRIORITIES: Record<string, number> = {
  "5m": 5 * 60 * 1000,
  "10m": 10 * 60 * 1000,
  "15m": 15 * 60 * 1000,
  "20m": 20 * 60 * 1000,
  "25m": 25 * 60 * 1000,
  "30m": 30 * 60 * 1000,
  "45m": 45 * 60 * 1000,

  "1h": 1 * 60 * 60 * 1000,
  "1h 30m": (1 * 60 + 30) * 60 * 1000,
  "2h": 2 * 60 * 60 * 1000,
  "2h 30m": (2 * 60 + 30) * 60 * 1000,
  "3h": 3 * 60 * 60 * 1000,
  "4h": 4 * 60 * 60 * 1000,
  "5h": 5 * 60 * 60 * 1000,
  "6h": 6 * 60 * 60 * 1000,
  "7h": 7 * 60 * 60 * 1000,
  "8h": 8 * 60 * 60 * 1000,

  "1d": 1 * 24 * 60 * 60 * 1000,
  "2d": 2 * 24 * 60 * 60 * 1000,
  "3d": 3 * 24 * 60 * 60 * 1000,
  "4d": 4 * 24 * 60 * 60 * 1000,
  "5d": 5 * 24 * 60 * 60 * 1000,
  "6d": 6 * 24 * 60 * 60 * 1000,
  "7d": 7 * 24 * 60 * 60 * 1000,
};

interface TaskEstimateTimeProps {
  estimate: number;
  spent?: number;
  lastStarted?: string;
  status?: ITaskStatus;
  onChangeEstimateTime: (newEstimateTime: number) => Promise<void>;
  changeable: boolean;
  className?: string;
}

export default function TaskEstimateTime({
  estimate,
  spent,
  lastStarted,
  status,
  onChangeEstimateTime,
  changeable,
  className,
}: TaskEstimateTimeProps) {
  const [open, setOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [inputClicked, setInputClicked] = useState(false);

  const [draftMs, setDraftMs] = useState(estimate);
  const dayInputRef = useRef<HTMLInputElement>(null);

  const [now, setNow] = useState(() => Date.now());
  const isRunning = status === "RUNNING";

  useEffect(() => {
    if (!isRunning || !lastStarted) return;

    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, lastStarted]);

  const offset = isRunning && lastStarted ? now - new Date(lastStarted).getTime() : 0;
  const liveSpent = (spent ?? 0) + offset;

  const formatValue = (val: number) => val.toString().padStart(2, "0");

  // ===== derived time  =====
  const totalMinutes = Math.floor(draftMs / (60 * 1000));

  const day = Math.floor(totalMinutes / (24 * 60));
  const hour = Math.floor((totalMinutes % (24 * 60)) / 60);
  const min = totalMinutes % 60;

  // ===== handlers =====
  const updateTimePart = (type: "day" | "hour" | "min", value: number) => {
    const totalMinutes = Math.floor(draftMs / (60 * 1000));

    let d = Math.floor(totalMinutes / (24 * 60));
    let h = Math.floor((totalMinutes % (24 * 60)) / 60);
    let m = totalMinutes % 60;

    if (type === "day") d = value;
    if (type === "hour") h = value;
    if (type === "min") m = value;

    const newMs = d * 86400000 + h * 3600000 + m * 60000;

    setDraftMs(newMs);
  };

  const handleInputChange = (type: "day" | "hour" | "min", max: number, value: string) => {
    let num = parseInt(value) || 0;
    if (num < 0) num = 0;
    if (num >= max) num = max - 1;

    updateTimePart(type, num);
  };

  const handleEstimateTimeChange = async (newEstimateTime: number) => {
    setIsUpdating(true);
    await onChangeEstimateTime(newEstimateTime);
    setIsUpdating(false);
    setOpen(false);
    setInputClicked(false);
  };

  const handleSave = async () => {
    await handleEstimateTimeChange(draftMs);
  };

  const handleOnOpenChange = (open: boolean) => {
    setOpen(open);
    if (open) {
      setDraftMs(estimate);
    } else {
      setInputClicked(false);
    }
  };

  // ===== display =====
  const displayTimeString = convertMillisecondsToTimeString(estimate);
  const compactEstimateTimeString = formatTimeLabel(estimate);
  const spentTimeString = !liveSpent || liveSpent <= 0 ? null : convertMillisecondsToTimeString(liveSpent);
  const compactSpentTimeString = !liveSpent || liveSpent <= 0 ? null : formatTimeLabel(liveSpent);

  const titleLabel = !spentTimeString ? displayTimeString : `${spentTimeString} / ${displayTimeString}`;
  const displayLabel = !compactSpentTimeString
    ? compactEstimateTimeString
    : `${compactSpentTimeString} / ${compactEstimateTimeString}`;

  return (
    <Popover open={open} onOpenChange={(open) => changeable && handleOnOpenChange(open)}>
      <TooltipProvider delayDuration={700}>
        <Tooltip>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              <span
                data-stop-task-open="true"
                onPointerDown={(event) => event.stopPropagation()}
                onClick={(event) => event.stopPropagation()}
                className={cn(
                  "inline-flex max-w-full min-w-0 cursor-pointer items-center overflow-hidden rounded-[5px] px-2 py-1.25 text-[10px] leading-none font-semibold text-ellipsis whitespace-nowrap text-[#787878]",
                  isRunning ? "bg-[#4dcd7d] text-white" : "bg-[#f0f0f0]",
                  !changeable && "cursor-default",
                  className,
                )}
              >
                {displayLabel}
              </span>
            </PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent
            className="rounded-none border-2 border-black bg-white px-2 py-0.5 text-[12px] font-light text-black select-none [&>span]:hidden!"
            side="bottom"
          >
            {titleLabel}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <PopoverContent
        data-stop-task-open="true"
        className="relative w-44 rounded-[5px] px-0! py-2.5! shadow-[0_6px_12px_#0003]!"
        align="end"
        onPointerDown={(event) => event.stopPropagation()}
        onClick={(event) => event.stopPropagation()}
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
              onChange={(e) => handleInputChange("day", 100, e.target.value)}
              className="h-6 w-5 [appearance:textfield] border-none p-0 text-center text-xs font-medium text-[#413f39] shadow-none focus-visible:ring-0 focus-visible:outline-none disabled:bg-white disabled:opacity-50 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
            <span className="text-xs font-semibold text-[#413f39]">:</span>
            <Input
              type="number"
              min={0}
              max={23}
              disabled={isUpdating}
              value={formatValue(hour)}
              onChange={(e) => handleInputChange("hour", 24, e.target.value)}
              className="h-6 w-5 [appearance:textfield] border-none p-0 text-center text-xs font-medium text-[#413f39] shadow-none focus-visible:ring-0 focus-visible:outline-none disabled:bg-white disabled:opacity-50 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
            <span className="text-xs font-semibold text-[#413f39]">:</span>
            <Input
              type="number"
              min={0}
              max={59}
              disabled={isUpdating}
              value={formatValue(min)}
              onChange={(e) => handleInputChange("min", 60, e.target.value)}
              className="h-6 w-5 [appearance:textfield] border-none p-0 text-center text-xs font-medium text-[#413f39] shadow-none focus-visible:ring-0 focus-visible:outline-none disabled:bg-white disabled:opacity-50 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
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
          {Object.entries(PRIORITIES).map(([label, ms]) => (
            <button
              key={label}
              onClick={() => handleEstimateTimeChange(ms)}
              disabled={isUpdating}
              className="flex w-full cursor-pointer items-center justify-between px-4 py-1.5 text-left text-xs transition-colors hover:bg-gray-100"
            >
              <span className="text-[12px] font-medium text-[#413f39]">{label}</span>

              {label === displayTimeString && <Check className="h-4 w-4 text-[#413f39]" />}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
