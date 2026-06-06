"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { IRole } from "@/types/role.type";
import { Pencil, Trash2 } from "lucide-react";

interface RoleCardProps {
  role: IRole;
  onEdit: (role: IRole) => void;
  onDelete: (roleId: string) => void;
}

export default function RoleCard({ role, onEdit, onDelete }: RoleCardProps) {
  const visiblePermissions = role.permissions.slice(0, 4);
  const extraPermissions = Math.max(role.permissions.length - visiblePermissions.length, 0);

  return (
    <Card className="group flex h-full flex-col border-[#e2e2e4] bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <CardHeader className="space-y-3 border-b bg-gradient-to-br from-white to-[#f9f9fb] pb-4">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2">
            <CardTitle className="text-lg font-semibold text-[#1f1f23]">{role.name}</CardTitle>
            <CardDescription className="text-muted-foreground text-sm">
              {role.permissions.length} permission{role.permissions.length === 1 ? "" : "s"}
            </CardDescription>
          </div>
          <Badge
            variant="outline"
            className={role.default ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-[#dcdcdc] bg-white"}
          >
            {role.default ? "Default" : "Custom"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-4 pt-4">
        <div className="flex flex-wrap gap-2">
          {visiblePermissions.length > 0 ? (
            <>
              {visiblePermissions.map((permission) => (
                <Badge
                  key={permission.permission}
                  variant="secondary"
                  className="border border-[#ececef] bg-[#f7f7f9] text-xs font-medium text-[#44444c]"
                >
                  {permission.name}
                </Badge>
              ))}
              {extraPermissions > 0 && (
                <Badge variant="secondary" className="border border-[#ececef] bg-[#f7f7f9] text-xs text-[#6b6b73]">
                  +{extraPermissions} more
                </Badge>
              )}
            </>
          ) : (
            <p className="text-muted-foreground text-sm">No permissions assigned</p>
          )}
        </div>

        {!role.default && (
          <div className="mt-auto flex gap-2 pt-2">
            <Button variant="outline" size="sm" className="flex-1 gap-2" onClick={() => onEdit(role)}>
              <Pencil className="size-4" />
              Edit
            </Button>
            <Button variant="destructive" size="sm" className="gap-2" onClick={() => onDelete(role.id)}>
              <Trash2 className="size-4" />
              Delete
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
