/**
 * Example component demonstrating role-based permission system usage
 * This shows how to conditionally render UI elements based on user permissions
 */

"use client";

import React from "react";
import { usePermission, PERMISSIONS } from "@/hooks/usePermission";
import { Button } from "@/components/ui/button";
import { AlertCircle, Lock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface TaskActionExampleProps {
  projectId: string;
  taskId: string;
  onCreateTask?: () => void;
  onEditTask?: () => void;
  onDeleteTask?: () => void;
  onArchiveTask?: () => void;
}

/**
 * Example component showing how to use permission system in UI
 */
export default function TaskActionExample({
  projectId,
  taskId,
  onCreateTask,
  onEditTask,
  onDeleteTask,
  onArchiveTask,
}: TaskActionExampleProps) {
  const {
    hasPermission,
    hasAllPermissions,
    hasAnyPermission,
    userPermissions,
    availablePermissions,
    isLoadingPermissions,
    permissionsError,
  } = usePermission(projectId);

  if (isLoadingPermissions) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="animate-pulse h-8 bg-gray-200 rounded"></div>
        </CardContent>
      </Card>
    );
  }

  if (permissionsError) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="pt-6">
          <div className="flex gap-2 items-center text-red-600">
            <AlertCircle size={16} />
            Failed to load permissions
          </div>
        </CardContent>
      </Card>
    );
  }

  // Check if user is an editor (has create, update, and delete permissions)
  const isEditor = hasAllPermissions([
    PERMISSIONS.TASK_CREATE,
    PERMISSIONS.TASK_UPDATE,
    PERMISSIONS.TASK_DELETE,
  ]);

  // Check if user can perform any modification
  const canModifyContent = hasAllPermissions([PERMISSIONS.TASK_CREATE, PERMISSIONS.TASK_UPDATE]);

  // Check if user can perform read-only operations
  const canViewTasks = hasPermission(PERMISSIONS.TASK_READ);

  return (
    <div className="space-y-6">
      {/* Display current role and permissions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Your Role & Permissions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-sm text-gray-600">
              <strong>Role:</strong> {userPermissions?.roleName || "No role"}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              You have <strong>{userPermissions?.permissions.length || 0}</strong> permissions
            </p>
          </div>

          {isEditor && (
            <div className="inline-block rounded-lg bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
              ✓ Editor Mode
            </div>
          )}

          {canViewTasks && !isEditor && (
            <div className="inline-block rounded-lg bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
              ✓ Viewer Mode
            </div>
          )}
        </CardContent>
      </Card>

      {/* Task Management Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Task Management</CardTitle>
          <CardDescription>Available actions based on your permissions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Create Button */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Create New Task</p>
              <p className="text-xs text-gray-500">
                {hasPermission(PERMISSIONS.TASK_CREATE)
                  ? "You can create new tasks"
                  : "You don't have permission to create tasks"}
              </p>
            </div>
            {hasPermission(PERMISSIONS.TASK_CREATE) ? (
              <Button onClick={onCreateTask} variant="default" size="sm">
                Create
              </Button>
            ) : (
              <div className="flex gap-2 items-center text-gray-400">
                <Lock size={16} />
              </div>
            )}
          </div>

          {/* Edit Button */}
          <div className="flex items-center justify-between border-t pt-4">
            <div>
              <p className="font-medium text-sm">Edit Task</p>
              <p className="text-xs text-gray-500">
                {hasPermission(PERMISSIONS.TASK_UPDATE)
                  ? "You can edit tasks"
                  : "You can't edit tasks"}
              </p>
            </div>
            {hasPermission(PERMISSIONS.TASK_UPDATE) ? (
              <Button
                onClick={onEditTask}
                variant="secondary"
                size="sm"
                disabled={!taskId}
              >
                Edit
              </Button>
            ) : (
              <div className="flex gap-2 items-center text-gray-400">
                <Lock size={16} />
              </div>
            )}
          </div>

          {/* Delete Button */}
          <div className="flex items-center justify-between border-t pt-4">
            <div>
              <p className="font-medium text-sm">Delete Task</p>
              <p className="text-xs text-gray-500">
                {hasPermission(PERMISSIONS.TASK_DELETE)
                  ? "You can delete tasks permanently"
                  : "You can't delete tasks"}
              </p>
            </div>
            {hasPermission(PERMISSIONS.TASK_DELETE) ? (
              <Button
                onClick={onDeleteTask}
                variant="destructive"
                size="sm"
                disabled={!taskId}
              >
                Delete
              </Button>
            ) : (
              <div className="flex gap-2 items-center text-gray-400">
                <Lock size={16} />
              </div>
            )}
          </div>

          {/* Archive Button */}
          <div className="flex items-center justify-between border-t pt-4">
            <div>
              <p className="font-medium text-sm">Archive/Restore Task</p>
              <p className="text-xs text-gray-500">
                {hasPermission(PERMISSIONS.TASK_ARCHIVE)
                  ? "You can archive and restore tasks"
                  : "You can't archive tasks"}
              </p>
            </div>
            {hasPermission(PERMISSIONS.TASK_ARCHIVE) ? (
              <Button
                onClick={onArchiveTask}
                variant="outline"
                size="sm"
                disabled={!taskId}
              >
                Archive
              </Button>
            ) : (
              <div className="flex gap-2 items-center text-gray-400">
                <Lock size={16} />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Permissions List */}
      {userPermissions?.permissions && userPermissions.permissions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Your Permissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {userPermissions.permissions.map((perm) => (
                <div key={perm.permission} className="rounded-lg bg-gray-50 p-2">
                  <p className="text-xs font-medium text-gray-700">{perm.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{perm.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
