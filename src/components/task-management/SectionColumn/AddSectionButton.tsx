// components/task-management/SectionColumn/AddSectionButton.tsx
import { Button } from "@/components/ui/button";

interface AddSectionButtonProps {
  onClick: () => void;
}

export default function AddSectionButton({ onClick }: AddSectionButtonProps) {
  return (
    <div className="p-4 flex justify-center">
      <Button variant="outline" onClick={onClick}>
        + Add Section
      </Button>
    </div>
  );
}