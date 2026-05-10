"use client";

import { useState, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import { Search, X, UserPlus, UserMinus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTaskMutations } from "@/hooks/use-task";
import { useSubtaskMutations } from "@/hooks/use-subtask";
import { IBasicUser } from "@/types/user.type";
import { useMembers } from "@/hooks/use-members-management";
import { useTaskModalStore } from "@/stores/task-modal.store";
import { useAssignTaskModalStore } from "@/stores/assign-task-modal.store";

export default function AssignTaskModal() {
  const isOpen = useAssignTaskModalStore((s) => s.open);
  const closeModal = useAssignTaskModalStore((s) => s.closeModal);
  const task = useAssignTaskModalStore((s) => s.task);
  const projectId = useAssignTaskModalStore((s) => s.projectId);
  const previousTask = useAssignTaskModalStore((s) => s.previousTask);
  const isPersonal = useAssignTaskModalStore((s) => s.isPersonal);
  const member = useAssignTaskModalStore((s) => s.member);
  const isSubtask = useAssignTaskModalStore((s) => s.isSubtask);
  const { openModal: openUpdateTaskModal } = useTaskModalStore();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const { assignTaskToUsersMutation, updateTaskMutation } = useTaskMutations();
  const { updateSubtaskAssigneeIdsMutation } = useSubtaskMutations();
  const [searchQuery, setSearchQuery] = useState("");
  const [assignedUsers, setAssignedUsers] = useState<IBasicUser[]>([]);
  const [projectMembers, setProjectMembers] = useState<IBasicUser[]>([]);
  const [isLoadingMembers, setIsLoadingMembers] = useState(false);
  const { members } = useMembers(projectId || "", searchQuery, currentPage, itemsPerPage);
  // Store the task modal data that was open before this modal
  const [previousTaskModalData, setPreviousTaskModalData] = useState<any>(null);

  // Initialize assigned users from task and store previous modal data
  useEffect(() => {
    if (isOpen && task) {
      setAssignedUsers(task.assignees || []);
      // Store all the data needed to reopen the task modal
      setPreviousTaskModalData({
        task,
        projectId,
        isPersonal,
        previousTask,
        mode: useTaskModalStore.getState().mode, // Preserve mode
      });
    }
  }, [isOpen, task, projectId, isPersonal]);

  // Fetch project members
  useEffect(() => {
    if (!isOpen || !projectId) return;

    const fetchMembers = async () => {
      setIsLoadingMembers(true);
      try {
        setProjectMembers(members || []);
      } catch (error: any) {
        toast.error("Failed to load project members");
        console.error("Fetch members error:", error);
      } finally {
        setIsLoadingMembers(false);
      }
    };

    fetchMembers();
  }, [isOpen, projectId, members]);

  // Filter members based on search query
  const filteredMembers = useMemo(() => {
    if (!searchQuery.trim()) return projectMembers;

    const query = searchQuery.toLowerCase();
    return projectMembers.filter(
      (member) => member.fullname.toLowerCase().includes(query) || member.email.toLowerCase().includes(query),
    );
  }, [projectMembers, searchQuery]);

  // Get available members (not yet assigned)
  const availableMembers = useMemo(() => {
    const assignedIds = new Set(assignedUsers.map((u) => u.id));
    return filteredMembers.filter((member) => !assignedIds.has(member.id));
  }, [filteredMembers, assignedUsers]);

  // Get filtered assigned users
  const filteredAssignedUsers = useMemo(() => {
    if (!searchQuery.trim()) return assignedUsers;

    const query = searchQuery.toLowerCase();
    return assignedUsers.filter(
      (user) => user.fullname.toLowerCase().includes(query) || user.email.toLowerCase().includes(query),
    );
  }, [assignedUsers, searchQuery]);

  const handleAddUser = (user: IBasicUser) => {
    if (!assignedUsers.find((u) => u.id === user.id)) {
      setAssignedUsers([...assignedUsers, user]);
    }
  };

  const handleRemoveUser = (userId: string) => {
    setAssignedUsers(assignedUsers.filter((u) => u.id !== userId));
  };

  const handleCloseAndReopenTask = (newAssignees?: IBasicUser[]) => {
    closeModal();

    if (previousTaskModalData) {
      setTimeout(() => {
        openUpdateTaskModal({
          mode: previousTaskModalData.mode,
          projectId: previousTaskModalData.projectId,
          sectionId: previousTaskModalData.task.sectionId,
          ...previousTaskModalData.task,
          assignees: newAssignees || assignedUsers, // Pass new assignees
        });
      }, 100);
    }
  };

  const handleSave = async () => {
    if (!task) return;

    // If it's a new task (no ID), just update the local store and reopen
    if (!task.id) {
      toast.success("Assignees updated locally");
      handleCloseAndReopenTask(assignedUsers);
      return;
    }

    try {
      const assigneeIds = assignedUsers.map((u) => u.id);

      if (isSubtask) {
        await updateSubtaskAssigneeIdsMutation.mutateAsync({
          id: task.id,
          payload: { assigneeIds },
        });
      } else {
        await assignTaskToUsersMutation.mutateAsync({
          taskId: task.id,
          assigneeIds: assigneeIds,
        });
      }

      toast.success(`${isSubtask ? "Subtask" : "Task"} assignments updated`);
      handleCloseAndReopenTask(assignedUsers);
    } catch (error: any) {
      // Error already handled by useTask hook
      console.error("Update assignments error:", error);
    }
  };

  // Don't render for personal projects
  // if (isPersonal) {
  //   return null;
  // }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleCloseAndReopenTask()}>
      <DialogContent className="flex max-h-[80vh] flex-col sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Assign {isSubtask ? "Subtask" : "Task"}</DialogTitle>
          {/* <DialogDescription>
            {isPersonal 
              ? "This is a personal project. You cannot assign members to tasks."
              : `Add or remove team members assigned to this ${isSubtask ? "subtask" : "task"}`
            }
          </DialogDescription> */}
        </DialogHeader>

        {/* Search */}
        <div className="relative">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or email..."
            className="pl-9"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Content - scrollable */}
        <div className="flex-1 space-y-4 overflow-y-auto py-2">
          {/* Assigned Users Section */}
          <div>
            <h3 className="mb-2 text-sm font-medium text-gray-700">Assigned ({assignedUsers.length})</h3>
            {filteredAssignedUsers.length > 0 ? (
              <div className="space-y-1">
                {filteredAssignedUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between rounded-lg p-2 transition-colors hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatarUrl || undefined} alt={user.fullname} />
                        <AvatarFallback className="bg-blue-500 text-xs text-white">
                          {user.fullname.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{user.fullname}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveUser(user.id)}
                      className="text-red-600 hover:bg-red-50 hover:text-red-700"
                      disabled={isPersonal}
                    >
                      <UserMinus className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="py-4 text-center text-sm text-gray-400">
                {searchQuery ? "No assigned users match your search" : "No users assigned yet"}
              </p>
            )}
          </div>

          {/* Available Members Section */}
          {!isPersonal && availableMembers.length > 0 && (
            <div>
              <h3 className="mb-2 text-sm font-medium text-gray-700">Available Members ({availableMembers.length})</h3>
              {isLoadingMembers ? (
                <p className="py-4 text-center text-sm text-gray-400">Loading members...</p>
              ) : (
                <div className="space-y-1">
                  {availableMembers.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between rounded-lg p-2 transition-colors hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={member.avatarUrl || undefined} alt={member.fullname} />
                          <AvatarFallback className="bg-gray-500 text-xs text-white">
                            {member.fullname.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{member.fullname}</p>
                          <p className="text-xs text-gray-500">{member.email}</p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleAddUser(member)}
                        className="text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                      >
                        <UserPlus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleCloseAndReopenTask()}
            disabled={assignTaskToUsersMutation.isPending || updateSubtaskAssigneeIdsMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={assignTaskToUsersMutation.isPending || updateSubtaskAssigneeIdsMutation.isPending || isPersonal}
          >
            {assignTaskToUsersMutation.isPending || updateSubtaskAssigneeIdsMutation.isPending ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
