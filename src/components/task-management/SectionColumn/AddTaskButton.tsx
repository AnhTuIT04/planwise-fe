// components/task-management/SectionColumn/AddTaskButton.tsx
import { Button } from "@/components/ui/button";

interface AddTaskButtonProps {
  onClick: () => void;
}

export default function AddTaskButton({ onClick }: AddTaskButtonProps) {
  return (
    <Button className="w-full mb-3" variant="outline" size="sm" onClick={onClick}>
      + Add task
    </Button>
  );
}