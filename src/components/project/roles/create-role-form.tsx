import React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Permission, PERMISSIONS } from "@/types/role.type";

interface CreateRoleFormProps {
  newRoleName: string;
  setNewRoleName: (name: string) => void;
  selectedPermissions: string[];
  setSelectedPermissions: (permissions: string[]) => void;
  onCreateRole: () => void;
}

export default function CreateRoleForm({
  newRoleName,
  setNewRoleName,
  selectedPermissions,
  setSelectedPermissions,
  onCreateRole,
}: CreateRoleFormProps) {
  return (
    <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6">
      <div className="mb-4 flex items-center gap-4">
        <div className="rounded-lg bg-blue-50 p-2">
          <Plus className="h-5 w-5 text-blue-600" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900">Create New Role</h2>
      </div>

      <div className="grid grid-cols-1 items-end gap-4 md:grid-cols-3">
        <div>
          <label htmlFor="roleName" className="mb-2 block text-sm font-medium text-gray-700">
            Role Name
          </label>
          <Input
            id="roleName"
            value={newRoleName}
            onChange={(e) => setNewRoleName(e.target.value)}
            placeholder="Enter role name"
            className="w-full"
          />
        </div>

        <div>
          <label htmlFor="permissions" className="mb-2 block text-sm font-medium text-gray-700">
            Permissions
          </label>
          <Select
            value=""
            onValueChange={(value) => {
              if (!selectedPermissions.includes(value)) {
                setSelectedPermissions([...selectedPermissions, value]);
              }
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select permissions..." />
            </SelectTrigger>
            <SelectContent>
              {PERMISSIONS.map((permission) => (
                <SelectItem
                  key={permission.id}
                  value={permission.id}
                  disabled={selectedPermissions.includes(permission.id)}
                >
                  {permission.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          
        </div>

        <Button
          onClick={onCreateRole}
          disabled={!newRoleName.trim() || selectedPermissions.length === 0}
          className="bg-linear-to-r from-[#D60808] to-[#700404] transition-colors duration-500 hover:bg-linear-to-r hover:from-[#700404] hover:to-[#D60808]"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Role
        </Button>
      </div>
      {selectedPermissions.length > 0 && (
            <div className="mt-2 flex flex-wrap justify-center gap-2">
              {selectedPermissions.map((permId) => {
                const permission = PERMISSIONS.find((p) => p.id === permId);
                return permission ? (
                  <Badge
                    key={permId}
                    variant="secondary"
                    className="cursor-pointer text-xs"
                    onClick={() => setSelectedPermissions(selectedPermissions.filter((p) => p !== permId))}
                  >
                    {permission.name} ×
                  </Badge>
                ) : null;
              })}
            </div>
          )}
    </div>
  );
}
