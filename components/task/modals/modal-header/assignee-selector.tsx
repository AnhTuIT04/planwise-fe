import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAssignTaskModalStore } from "@/stores/assign-task-modal.store";
import useModal from "@/hooks/use-modal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function AssigneeSelector() {
  const task = useAssignTaskModalStore((s) => s.task);
  const projectId = useAssignTaskModalStore((s) => s.projectId);
  const closeAssignModal = useAssignTaskModalStore((s) => s.closeModal);
  const openAssignTaskModal = useAssignTaskModalStore((s) => s.openModal);
  if (!projectId) return null; // Don't show in my-tasks view

  const handleAssign = () => {
    openAssignTaskModal({
      task,
      projectId,
      isPersonal: false,
      isSubtask: false,
      member: undefined,
      previousTask: null,
    });
  };

  return (
    <Button
      onClick={handleAssign}
      variant="ghost"
      className="cursor-pointer rounded-[5px] px-2 py-1.5 text-[12px] text-[#b4b4b4] hover:bg-[#f7f8fa] hover:text-[#413f39] hover:opacity-80 active:translate-y-0!"
      tabIndex={-1}
    >
      {task?.assignees && task.assignees.length > 0 ? (
        <div className="flex -space-x-1.5 mr-1">
          {task.assignees.slice(0, 3).map((assignee) => (
            <Avatar key={assignee.id} className="h-4 w-4 border-[1px] border-white">
              <AvatarImage src={assignee.avatarUrl || undefined} />
              <AvatarFallback className="text-[8px] bg-blue-500 text-white">
                {assignee.fullname.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          ))}
          {task.assignees.length > 3 && (
            <div className="flex h-4 w-4 items-center justify-center rounded-full bg-gray-100 border-[1px] border-white text-[8px] text-gray-600">
              +{task.assignees.length - 3}
            </div>
          )}
        </div>
      ) : (
        <UserPlus className="size-3.5 mr-1" />
      )}
      <span>Assign</span>
    </Button>
  );
}
