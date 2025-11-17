import { DateRangePicker } from "@/components/ui/date-picker";

export default function ProjectNav() {
  return (
    <div className="flex h-12 items-center justify-between border-b p-2">
      <div>
        <DateRangePicker />
      </div>
      <div className="border">board</div>
    </div>
  );
}
