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
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className={`rounded-2xl ${iconBgColor} p-4`}>
          <Icon className={iconColor} />
        </div>
        <div className="flex-1">
          <p className="text-2xl font-semibold">{value}</p>
          <p className="text-sm text-gray-500">{label}</p>
          {subLabel && <p className={`text-xs ${subLabelColor}`}>{subLabel}</p>}
          {progress !== undefined && (
            <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
              <div className="h-2 rounded-full bg-orange-500" style={{ width: `${progress}%` }} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
