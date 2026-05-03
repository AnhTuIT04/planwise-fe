import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function CalendarHeader({
  date,
  onPrev,
  onNext,
}: {
  date: Date;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <div className="flex items-center justify-between border-b px-4 py-2">
      <Button variant="ghost" size="icon" onClick={onPrev}>
        <ChevronLeft size={16} />
      </Button>

      <div className="font-medium">
        {date.toLocaleDateString(undefined, {
          weekday: "short",
          day: "numeric",
          month: "short",
        })}
      </div>

      <Button variant="ghost" size="icon" onClick={onNext}>
        <ChevronRight size={16} />
      </Button>
    </div>
  );
}