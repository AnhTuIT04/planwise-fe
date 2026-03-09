"use client";

import { Button } from "@/components/ui/button";
import { CalendarDayView } from "@/components/sidebar/right-sidebar/calendar-sidebar/calendar-day-view";
import { useCalendarIntegration } from "@/hooks/useCalendarIntegration";
import { apiBaseURL } from "@/lib/consts";
import { useRouter } from "next/navigation";

export default function CalendarSidebar() {
  const { integrated, isLoading } = useCalendarIntegration("GOOGLE_CALENDAR");
  const router = useRouter();

  const handleIntegrate = () => {
    router.push(`${apiBaseURL}/integrations/connect/GOOGLE_CALENDAR`)
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col bg-[#f8f8f9]">
      <div className="flex h-12 items-center justify-between border-b px-4">
        <h2 className="text-[16px] font-semibold text-[#787878]">
          Google Calendar
        </h2>
      </div>

      {!integrated ? (
        <div className="flex flex-1 items-center justify-center">
          <Button
            className="inline-flex items-center rounded-md bg-linear-to-r from-[#D60808] to-[#700404] px-3 py-1 font-semibold text-white shadow-sm transition-colors duration-500 hover:cursor-pointer hover:bg-linear-to-r hover:from-[#700404] hover:to-[#D60808] sm:px-4 sm:py-2"
            onClick={handleIntegrate}
          >
            Integrate with your Google Calendar
          </Button>
        </div>
      ) : (
        <CalendarDayView />
      )}
    </div>
  );
}