import { ChevronRight } from "lucide-react";

import { IBasicSection } from "@/types/section.type";

export default function SectionListOverlay({ section }: { section: IBasicSection }) {
  return (
    <div className="flex h-10 w-[640px] items-center gap-2 rounded border border-[#dcdcdc] bg-[#f8f8f9] px-3 opacity-80 shadow-[0_3px_8px_#00000024]">
      <span className="flex h-5 w-5 shrink-0 items-center justify-center text-[#787878]">
        <ChevronRight className="h-4 w-4 rotate-90" />
      </span>
      <h2 className="h-6 truncate text-[14px] font-semibold text-[#413f39]">{section.name}</h2>
      <span className="text-[12px] font-medium text-[#787878]">{section.taskCount}</span>
    </div>
  );
}
