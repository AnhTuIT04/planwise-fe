"use client";

import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
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
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import useModal from "@/hooks/useModal";
import { useTask } from "@/hooks/useTask";
import { IBasicUser } from "@/types/user.type";

export default function AssignTaskModal() {
  const { data, isOpen, closeModal } = useModal<"ASSIGN_TASK">();
  const { task, projectId, isPersonal } = data || {};
  
  const { updateTask, isUpdatingTask } = useTask();

  const [searchQuery, setSearchQuery] = useState("");
  const [assignedUsers, setAssignedUsers] = useState<IBasicUser[]>([]);
  const [projectMembers, setProjectMembers] = useState<IBasicUser[]>([]);
  const [isLoadingMembers, setIsLoadingMembers] = useState(false);

  // Initialize assigned users from task
  useEffect(() => {
    if (isOpen && task) {
      setAssignedUsers(task.assignees || []);
    }
  }, [isOpen, task]);

  // Fetch project members
  useEffect(() => {
    if (!isOpen || !projectId || isPersonal) return;

    const fetchMembers = async () => {
      setIsLoadingMembers(true);
      try {
        // TODO: Replace with actual API call
        // const [members, error] = await getProjectMembersApi(projectId);
        // if (error) throw error;
        // setProjectMembers(members || []);
        
        // Mock data for now
        const mockMembers: IBasicUser[] = [
          {
            id: "1",
            email: "john@example.com",
            fullname: "John Doe",
            avatarUrl: null,
          },
          {
            id: "2",
            email: "jane@example.com",
            fullname: "Jane Smith",
            avatarUrl: null,
          },
          {
            id: "3",
            email: "bob@example.com",
            fullname: "Bob Johnson",
            avatarUrl: null,
          },
        ];
        setProjectMembers(mockMembers);
      } catch (error: any) {
        toast.error("Failed to load project members");
        console.error("Fetch members error:", error);
      } finally {
        setIsLoadingMembers(false);
      }
    };

    fetchMembers();
  }, [isOpen, projectId, isPersonal]);

  // Filter members based on search query
  const filteredMembers = useMemo(() => {
    if (!searchQuery.trim()) return projectMembers;
    
    const query = searchQuery.toLowerCase();
    return projectMembers.filter(
      (member) =>
        member.fullname.toLowerCase().includes(query) ||
        member.email.toLowerCase().includes(query)
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
      (user) =>
        user.fullname.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query)
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

  const handleSave = async () => {
    if (!task) return;

    try {
      const assigneeIds = assignedUsers.map((u) => u.id);
      
      await updateTask({
        id: task.id,
        payload: {
          assigneeIds,
        },
      });

      toast.success("Task assignments updated");
      closeModal();
    } catch (error: any) {
      // Error already handled by useTask hook
      console.error("Update assignments error:", error);
    }
  };

  // Don't render for personal projects
  if (isPersonal) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Assign Task</DialogTitle>
          <DialogDescription>
            Add or remove team members assigned to this task
          </DialogDescription>
        </DialogHeader>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or email..."
            className="pl-9"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Content - scrollable */}
        <div className="flex-1 overflow-y-auto space-y-4 py-2">
          {/* Assigned Users Section */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Assigned ({assignedUsers.length})
            </h3>
            {filteredAssignedUsers.length > 0 ? (
              <div className="space-y-1">
                {filteredAssignedUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatarUrl || undefined} alt={user.fullname} />
                        <AvatarFallback className="bg-blue-500 text-white text-xs">
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
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <UserMinus className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 py-4 text-center">
                {searchQuery ? "No assigned users match your search" : "No users assigned yet"}
              </p>
            )}
          </div>

          {/* Available Members Section */}
          {availableMembers.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Available Members ({availableMembers.length})
              </h3>
              {isLoadingMembers ? (
                <p className="text-sm text-gray-400 py-4 text-center">Loading members...</p>
              ) : (
                <div className="space-y-1">
                  {availableMembers.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={member.avatarUrl || undefined} alt={member.fullname} />
                          <AvatarFallback className="bg-gray-500 text-white text-xs">
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
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
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
            onClick={closeModal}
            disabled={isUpdatingTask}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={isUpdatingTask}
          >
            {isUpdatingTask ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
