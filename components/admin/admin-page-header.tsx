import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function AdminPageHeader({
  eyebrow,
  title,
  description,
  tags = [],
  className,
}: {
  eyebrow: string;
  title: string;
  description: string;
  tags?: string[];
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mb-5 flex flex-col gap-3 rounded-3xl border border-[#dcdcdc] bg-white p-5 shadow-[0_14px_36px_-30px_rgba(0,0,0,0.6)]",
        className,
      )}
    >
      <div className="flex flex-wrap items-center gap-2">
        <p className="text-[11px] font-semibold tracking-[0.22em] text-[#787878] uppercase">{eyebrow}</p>
        {tags.map((tag) => (
          <Badge key={tag} variant="outline" className="border-[#dcdcdc] bg-[#f9f7f2] text-[#57534e]">
            {tag}
          </Badge>
        ))}
      </div>
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight text-[#2d2b27] sm:text-3xl">{title}</h2>
        <p className="max-w-3xl text-sm leading-6 text-[#787878] sm:text-[15px]">{description}</p>
      </div>
    </div>
  );
}
