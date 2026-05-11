import { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  iconColor: string;
  iconBgColor: string;
  value: string | number;
  label: string;
  subLabel?: string;
  subLabelColor?: string;
  progress?: number;
}

export default function StatCard({
  icon: Icon,
  iconColor,
  iconBgColor,
  value,
  label,
  subLabel,
  subLabelColor = "text-gray-400",
  progress,
}: StatCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-gray-200 hover:shadow-lg">
      <div className="flex items-start gap-4">
        <div className={`rounded-xl ${iconBgColor} p-3 transition-transform duration-300 group-hover:scale-110`}>
          <Icon className={iconColor} size={22} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-3xl leading-none font-bold tracking-tight text-gray-900 tabular-nums">{value}</p>
          <p className="mt-1.5 text-sm font-medium text-gray-600">{label}</p>
          {subLabel && <p className={`mt-0.5 text-xs ${subLabelColor}`}>{subLabel}</p>}
          {progress !== undefined && (
            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-orange-400 to-orange-600 transition-all duration-500"
                style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
