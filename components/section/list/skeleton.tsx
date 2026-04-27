import { Skeleton } from "@/components/ui/skeleton";

export default function SectionListSkeleton() {
  return (
    <div>
      <div className="flex h-10 items-center gap-2 border-b border-[#e8e8e8] bg-[#f8f8f9] px-3">
        <Skeleton className="h-4 w-4 rounded bg-[#eeeeee]" />
        <Skeleton className="h-5 w-32 bg-[#eeeeee]" />
        <Skeleton className="h-4 w-6 bg-[#eeeeee]" />
      </div>
      <div className="divide-y divide-[#f0f0f0]">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="grid grid-cols-[24px_1fr_88px_104px_120px_96px_24px] items-center gap-3 bg-white py-3 pr-3 pl-3"
          >
            <Skeleton className="h-4 w-4 rounded-full bg-[#eeeeee]" />
            <Skeleton className="h-4 w-48 bg-[#eeeeee]" />
            <Skeleton className="h-4 w-12 bg-[#eeeeee]" />
            <Skeleton className="h-4 w-14 bg-[#eeeeee]" />
            <Skeleton className="h-3 w-16 bg-[#eeeeee]" />
            <Skeleton className="h-5 w-20 bg-[#eeeeee]" />
            <span />
          </div>
        ))}
      </div>
    </div>
  );
}
