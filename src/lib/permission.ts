/**
 * Frontend utilities for permission checking and management
 */

export const PERMISSIONS = {
  // Project
  PROJECT_READ: "project:read",
  PROJECT_UPDATE: "project:update",
  PROJECT_DELETE: "project:delete",
  PROJECT_VIEW_MEMBERS: "project:view-members",
  PROJECT_MANAGE_MEMBERS: "project:manage-members",
  PROJECT_MANAGE_ROLES: "project:manage-roles",

  // Task
  TASK_CREATE: "task:create",
  TASK_READ: "task:read",
  TASK_UPDATE: "task:update",
  TASK_DELETE: "task:delete",
  TASK_ARCHIVE: "task:archive",
  TASK_ASSIGN: "task:assign",

  // Subtask
  SUBTASK_CREATE: "subtask:create",
  SUBTASK_READ: "subtask:read",
  SUBTASK_UPDATE: "subtask:update",
  SUBTASK_DELETE: "subtask:delete",

  // Section
  SECTION_CREATE: "section:create",
  SECTION_READ: "section:read",
  SECTION_UPDATE: "section:update",
  SECTION_DELETE: "section:delete",

  // Comment
  COMMENT_CREATE: "comment:create",
  COMMENT_READ: "comment:read",
  COMMENT_UPDATE: "comment:update",
  COMMENT_DELETE: "comment:delete",
} as const;

/**
 * Check if user has a specific permission
 */
export const hasPermission = (userPermissions: string[], permission: string): boolean => {
  return userPermissions.includes(permission);
};

/**
 * Check if user has any of the specified permissions
 */
export const hasAnyPermission = (userPermissions: string[], permissions: string[]): boolean => {
  return permissions.some((permission) => userPermissions.includes(permission));
};

/**
 * Check if user has all specified permissions
 */
export const hasAllPermissions = (userPermissions: string[], permissions: string[]): boolean => {
  return permissions.every((permission) => userPermissions.includes(permission));
};

/**
 * Get permission display names (human-readable)
 */
export const getPermissionDisplayName = (permission: string): string => {
  const names: Record<string, string> = {
    "project:read": "View Project",
    "project:update": "Edit Project",
    "project:delete": "Delete Project",
    "project:view-members": "View Members",
    "project:manage-members": "Manage Members",
    "project:manage-roles": "Manage Roles",
    "task:create": "Create Tasks",
    "task:read": "View Tasks",
    "task:update": "Edit Tasks",
    "task:delete": "Delete Tasks",
    "task:archive": "Archive Tasks",
    "task:assign": "Assign Tasks",
    "subtask:create": "Create Subtasks",
    "subtask:read": "View Subtasks",
    "subtask:update": "Edit Subtasks",
    "subtask:delete": "Delete Subtasks",
    "section:create": "Create Sections",
    "section:read": "View Sections",
    "section:update": "Edit Sections",
    "section:delete": "Delete Sections",
    "comment:create": "Create Comments",
    "comment:read": "View Comments",
    "comment:update": "Edit Comments",
    "comment:delete": "Delete Comments",
  };

  return names[permission] || permission;
};

/**
 * Get permission description
 */
export const getPermissionDescription = (permission: string): string => {
  const descriptions: Record<string, string> = {
    "project:read": "Can view project details",
    "project:update": "Can update project information",
    "project:delete": "Can delete the project",
    "project:view-members": "Can view project members",
    "project:manage-members": "Can invite and remove members",
    "project:manage-roles": "Can create and modify roles",
    "task:create": "Can create new tasks",
    "task:read": "Can view tasks",
    "task:update": "Can edit tasks",
    "task:delete": "Can delete tasks",
    "task:archive": "Can archive and restore tasks",
    "task:assign": "Can assign tasks to users",
    "subtask:create": "Can create subtasks",
    "subtask:read": "Can view subtasks",
    "subtask:update": "Can edit subtasks",
    "subtask:delete": "Can delete subtasks",
    "section:create": "Can create sections",
    "section:read": "Can view sections",
    "section:update": "Can edit sections",
    "section:delete": "Can delete sections",
    "comment:create": "Can create comments",
    "comment:read": "Can view comments",
    "comment:update": "Can edit own comments",
    "comment:delete": "Can delete comments",
  };

  return descriptions[permission] || "";
};
