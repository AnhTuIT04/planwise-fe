import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const tones = {
  emerald: "bg-emerald-100 text-emerald-700 ring-emerald-200",
  sky: "bg-sky-100 text-sky-700 ring-sky-200",
  amber: "bg-amber-100 text-amber-700 ring-amber-200",
  rose: "bg-rose-100 text-rose-700 ring-rose-200",
  slate: "bg-slate-100 text-slate-700 ring-slate-200",
} as const;

export function AdminMetricCard({
  label,
  value,
  hint,
  tone = "slate",
}: {
  label: string;
  value: string;
  hint: string;
  tone?: keyof typeof tones;
}) {
  return (
    <Card size="sm" className="gap-0 border-[#dcdcdc] bg-white shadow-[0_14px_36px_-30px_rgba(0,0,0,0.55)]">
      <CardHeader className="gap-3 border-b border-[#f1eee7] pb-3">
        <div className="flex items-center justify-between gap-3">
          <p className="text-[11px] font-semibold tracking-[0.18em] text-[#787878] uppercase">{label}</p>
          <span
            className={cn(
              "rounded-full px-2 py-1 text-[10px] font-semibold tracking-[0.16em] uppercase ring-1",
              tones[tone],
            )}
          >
            Live
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-1 pt-4">
        <div className="text-3xl font-semibold tracking-tight text-[#2d2b27]">{value}</div>
        <p className="text-sm leading-6 text-[#787878]">{hint}</p>
      </CardContent>
    </Card>
  );
}
