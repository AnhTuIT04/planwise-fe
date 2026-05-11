"use client";

import { useState } from "react";
import { Loader2, Shield } from "lucide-react";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useProjectModalStore } from "@/stores/project-modal.store";
import { usePermission } from "@/hooks/use-permission";
import { useRolesManagement } from "@/hooks/use-roles-management";
import type { IPermissionDto } from "@/hooks/use-permission";

export default function CreateRolesStep() {
  const setStep = useProjectModalStore((s) => s.setStep);
  const createdProjectId = useProjectModalStore((s) => s.createdProjectId);

  const { permissionGroups, isLoadingAvailable } = usePermission(createdProjectId);
  const { roles, createRole, isCreatingRole } = useRolesManagement(createdProjectId || "");

  const [roleName, setRoleName] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  const togglePermission = (permission: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permission) ? prev.filter((p) => p !== permission) : [...prev, permission],
    );
  };

  const customRoles = roles?.filter((r) => !r.default) ?? [];

  const submitRole = async () => {
    if (!createdProjectId) return;
    if (!roleName.trim()) {
      toast.error("Role name is required");
      return;
    }
    if (selectedPermissions.length === 0) {
      toast.error("Select at least one permission");
      return;
    }
    try {
      await createRole({ name: roleName.trim(), permissions: selectedPermissions });
      setRoleName("");
      setSelectedPermissions([]);
    } catch {
      // toast handled by mutation
    }
  };

  const goToSections = () => setStep("sections");

  return (
    <>
      <DialogHeader>
        <DialogTitle>Set up roles</DialogTitle>
        <DialogDescription>Step 2 of 4 — Roles</DialogDescription>
      </DialogHeader>

      <div className="space-y-5 py-2">
        <div className="rounded-md border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
          <p className="flex items-start gap-2">
            <Shield className="mt-0.5 h-4 w-4 shrink-0" />
            <span>
              Every project has two default roles — <strong>Owner</strong> and <strong>Member</strong> — that can&apos;t
              be removed. You can create additional roles now, or skip and add them later from the project&apos;s Roles
              page.
            </span>
          </p>
        </div>

        <div className="space-y-3 rounded-md border bg-white p-4">
          <Label className="text-sm font-medium">Add a custom role (optional)</Label>

          <div>
            <Label htmlFor="wizard-role-name" className="text-xs text-gray-500">
              Role name
            </Label>
            <Input
              id="wizard-role-name"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              placeholder="e.g., Reviewer"
              className="mt-1"
            />
          </div>

          <div>
            <Label className="text-xs text-gray-500">Permissions</Label>
            <div className="mt-2 max-h-56 space-y-3 overflow-y-auto rounded border p-3">
              {isLoadingAvailable ? (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Loader2 className="h-4 w-4 animate-spin" /> Loading permissions...
                </div>
              ) : (
                Object.entries(permissionGroups).map(([category, perms]) => (
                  <div key={category}>
                    <h4 className="mb-2 text-sm font-semibold text-gray-700 capitalize">{category}</h4>
                    <div className="ml-3 space-y-2">
                      {(perms as IPermissionDto[]).map((permission) => (
                        <div key={permission.permission} className="flex items-start gap-2">
                          <Checkbox
                            id={`wizard-perm-${permission.permission}`}
                            checked={selectedPermissions.includes(permission.permission)}
                            onCheckedChange={() => togglePermission(permission.permission)}
                            className="mt-0.5"
                          />
                          <div>
                            <label
                              htmlFor={`wizard-perm-${permission.permission}`}
                              className="block cursor-pointer text-sm font-medium text-gray-700"
                            >
                              {permission.name}
                            </label>
                            <p className="text-xs text-gray-500">{permission.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <Button
            type="button"
            variant="secondary"
            onClick={submitRole}
            disabled={isCreatingRole || !roleName.trim() || selectedPermissions.length === 0}
            className="w-full"
          >
            {isCreatingRole ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Adding role...
              </>
            ) : (
              "Add role"
            )}
          </Button>
        </div>

        {customRoles.length > 0 && (
          <div className="rounded-md border bg-gray-50 p-3 text-sm">
            <p className="mb-2 font-medium text-gray-700">Custom roles added:</p>
            <ul className="space-y-1 text-gray-600">
              {customRoles.map((r) => (
                <li key={r.id}>• {r.name}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={goToSections}>
          Skip
        </Button>
        <Button
          type="button"
          onClick={goToSections}
          className="bg-linear-to-r from-[#D60808] to-[#700404] transition-colors duration-500 hover:cursor-pointer hover:bg-linear-to-r hover:from-[#700404] hover:to-[#D60808]"
        >
          Continue
        </Button>
      </DialogFooter>
    </>
  );
}
