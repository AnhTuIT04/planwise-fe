import { cn } from "@/lib/utils";

const styles = {
  disabled: { dot: "bg-rose-500", chip: "bg-rose-500/10 text-rose-600", label: "Disabled" },
  unverified: { dot: "bg-amber-500", chip: "bg-amber-500/10 text-amber-600", label: "Not verified" },
  active: { dot: "bg-emerald-500", chip: "bg-emerald-500/10 text-emerald-600", label: "Active" },
} as const;

export function UserStatusBadge({ user }: { user: { verified: boolean; disabledAt: string | null } }) {
  const style = user.disabledAt ? styles.disabled : user.verified ? styles.active : styles.unverified;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold",
        style.chip,
      )}
    >
      <span className={cn("size-1.5 rounded-full", style.dot)} />
      {style.label}
    </span>
  );
}
