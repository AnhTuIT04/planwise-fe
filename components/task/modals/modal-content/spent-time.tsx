import { useEffect, useState } from "react";

import { cn, convertMillisecondsToTimeString, formatTimeLabel } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function SpentTime({
  spentTime,
  lastStarted,
  running,
}: {
  spentTime: number;
  lastStarted: string | null;
  running: boolean;
}) {
  const [now, setNow] = useState(() => Date.now());
  const offset = running && lastStarted ? now - new Date(lastStarted).getTime() : 0;
  const currTime = (spentTime ?? 0) + offset;

  useEffect(() => {
    if (!running) return;

    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, [running]);

  const fullFormattedTime = convertMillisecondsToTimeString(currTime);
  const compactFormattedTime = formatTimeLabel(currTime);

  return (
    <TooltipProvider delayDuration={700}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            className={cn(
              "inline-flex items-center justify-center overflow-hidden rounded-[5px] bg-transparent px-2 py-1.5 text-[10px] leading-none font-semibold text-ellipsis whitespace-nowrap text-[#787878]",
              running && "text-[#4dcd7d]",
            )}
          >
            {compactFormattedTime}
          </span>
        </TooltipTrigger>
        <TooltipContent
          className="rounded-none border-2 border-black bg-white px-2 py-0.5 text-[12px] font-light text-black select-none [&>span]:hidden!"
          side="bottom"
        >
          {fullFormattedTime}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
