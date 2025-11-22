import { useState } from "react";
import { Role, Permission, PERMISSIONS } from "@/types/role.type";

export function useRolesManagement() {
  const [newRoleName, setNewRoleName] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  // Mock data - replace with actual API call
  const [roles, setRoles] = useState<Role[]>([
    {
      id: "1",
      name: "Project Manager",
      isAdmin: true,
      permissions: [
        { id: "create-edit-tasks", name: "Create & Edit Tasks", color: "bg-green-100 text-green-800" },
        { id: "manage-team", name: "Manage Team", color: "bg-blue-100 text-blue-800" },
        { id: "delete-projects", name: "Delete Projects", color: "bg-red-100 text-red-800" },
        { id: "full-access", name: "Full Access", color: "bg-purple-100 text-purple-800" },
      ],
      members: [
        { id: "1", name: "John Doe", avatarUrl: "/images/avatar1.jpg" },
        { id: "2", name: "Jane Smith", avatarUrl: "/images/avatar2.jpg" },
      ],
    },
    {
      id: "2",
      name: "Project Manager",
      permissions: [
        { id: "create-edit-tasks", name: "Create & Edit Tasks", color: "bg-green-100 text-green-800" },
        { id: "manage-team", name: "Manage Team", color: "bg-blue-100 text-blue-800" },
        { id: "delete-projects", name: "Delete Projects", color: "bg-red-100 text-red-800" },
        { id: "full-access", name: "Full Access", color: "bg-purple-100 text-purple-800" },
      ],
      members: [
        { id: "3", name: "Mike Johnson", avatarUrl: "/images/avatar3.jpg" },
        { id: "4", name: "Sarah Wilson", avatarUrl: "/images/avatar4.jpg" },
      ],
    },
    {
      id: "3",
      name: "Project Manager",
      permissions: [
        { id: "create-edit-tasks", name: "Create & Edit Tasks", color: "bg-green-100 text-green-800" },
        { id: "manage-team", name: "Manage Team", color: "bg-blue-100 text-blue-800" },
        { id: "delete-projects", name: "Delete Projects", color: "bg-red-100 text-red-800" },
        { id: "full-access", name: "Full Access", color: "bg-purple-100 text-purple-800" },
      ],
      members: [
        { id: "5", name: "Alex Brown", avatarUrl: "/images/avatar5.jpg" },
        { id: "6", name: "Emma Davis", avatarUrl: "/images/avatar6.jpg" },
      ],
    },
  ]);

  const handleCreateRole = () => {
    if (!newRoleName.trim() || selectedPermissions.length === 0) return;

    const selectedPerms = PERMISSIONS.filter((p) => selectedPermissions.includes(p.id));

    const newRole: Role = {
      id: Date.now().toString(),
      name: newRoleName,
      permissions: selectedPerms,
      members: [],
    };

    setRoles([...roles, newRole]);
    setNewRoleName("");
    setSelectedPermissions([]);
  };

  const handleDeleteRole = (roleId: string) => {
    setRoles(roles.filter((role) => role.id !== roleId));
  };

  const handleEditRole = (role: Role) => {
    // TODO: Implement edit role functionality
    console.log("Edit role:", role);
  };

  return {
    roles,
    newRoleName,
    setNewRoleName,
    selectedPermissions,
    setSelectedPermissions,
    handleCreateRole,
    handleDeleteRole,
    handleEditRole,
  };
}
