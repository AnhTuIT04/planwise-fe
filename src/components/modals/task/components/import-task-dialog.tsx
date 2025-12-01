import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ImportTaskDialogProps {
  isOpen: boolean;
  selectedSection: string;
  listSectionsPersonal?: any[];
  onOpenChange: (open: boolean) => void;
  onSectionChange: (sectionId: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ImportTaskDialog({
  isOpen,
  selectedSection,
  listSectionsPersonal,
  onOpenChange,
  onSectionChange,
  onConfirm,
  onCancel,
}: ImportTaskDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-md">
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold">Import Task to Personal Project</h2>
            <p className="text-sm text-gray-600 mt-1">
              Select a section in your personal project to import this task
            </p>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Section</Label>
            <Select value={selectedSection} onValueChange={onSectionChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a section" />
              </SelectTrigger>
              <SelectContent>
                {listSectionsPersonal?.map((section: any) => (
                  <SelectItem key={section.id} value={section.id}>
                    {section.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button 
              onClick={onConfirm}
              disabled={!selectedSection}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Import
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
