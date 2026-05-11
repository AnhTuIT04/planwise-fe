import { IBasicSection } from "@/types/section.type";

export default function SectionKanbanOverlay({ section }: { section: IBasicSection }) {
  return (
    <section className="flex w-64 min-w-64 flex-col overflow-hidden rounded-lg bg-white opacity-50">
      <div className="group flex items-center justify-between px-5 py-3">
        <h2 className="h-6 w-fit cursor-pointer truncate border border-transparent border-b-transparent text-[16px] font-semibold text-[#413f39]">
          {section.name}
        </h2>
      </div>
    </section>
  );
}
