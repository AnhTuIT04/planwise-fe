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

export interface Role {
  id: string;
  name: string;
  permissions: Permission[];
  members: Member[];
  isAdmin?: boolean;
}

export const PERMISSIONS: Permission[] = [
  { id: "create-edit-tasks", name: "Create & Edit Tasks", color: "bg-green-100 text-green-800" },
  { id: "manage-team", name: "Manage Team", color: "bg-blue-100 text-blue-800" },
  { id: "delete-projects", name: "Delete Projects", color: "bg-red-100 text-red-800" },
  { id: "full-access", name: "Full Access", color: "bg-purple-100 text-purple-800" },
];
