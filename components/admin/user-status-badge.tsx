import { Badge } from "@/components/ui/badge";

export function UserStatusBadge({ user }: { user: { verified: boolean; disabledAt: string | null } }) {
  if (user.disabledAt) {
    return (
      <Badge variant="outline" className="border-rose-200 bg-rose-50 text-rose-700">
        Disabled
      </Badge>
    );
  }
  if (!user.verified) {
    return (
      <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700">
        Not verified
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700">
      Active
    </Badge>
  );
}
