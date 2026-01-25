export interface Permission {
  id: string;
  name: string;
  color: string;
}

export interface Member {
  id: string;
  name: string;
  avatarUrl?: string;
}

// IRole from API - permissions as string array
// export interface IRole {
//   id: string;
//   name: string;
//   permissions: string[];
//   // members: Member[];
//   // isAdmin?: boolean;
// }

interface IPermission {
  permission: string;
  name: string;
  description: string;
}
export interface IRole {
  id: string;
  name: string;
  default: boolean;
  permissions: IPermission[];
}

// Role for frontend display - permissions as Permission objects
export interface Role {
  id: string;
  name: string;
  permissions: Permission[];
  members: Member[];
  isAdmin?: boolean;
}

// Helper to convert IRole to Role for display
// export const mapIRoleToRole = (iRole: IRole, allPermissions: Permission[]): Role => {
//   return {
//     id: iRole.id,
//     name: iRole.name,
//     permissions: iRole.permissions
//       .map(permId => allPermissions.find(p => p.id === permId))
//       .filter((p): p is Permission => p !== undefined),
//     members: [],
//     isAdmin: false,
//   };
// };

export const PERMISSIONS: Permission[] = [
  { id: "create-edit-tasks", name: "Create & Edit Tasks", color: "bg-green-100 text-green-800" },
  { id: "manage-team", name: "Manage Team", color: "bg-blue-100 text-blue-800" },
  { id: "delete-projects", name: "Delete Projects", color: "bg-red-100 text-red-800" },
  { id: "full-access", name: "Full Access", color: "bg-purple-100 text-purple-800" },
];
