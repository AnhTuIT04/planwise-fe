import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MoreHorizontal, Trash2, Archive, Upload } from "lucide-react";
import { toast } from "sonner";
import { updateTaskStatusApi } from "@/apis/task/task.api";

interface TaskHeaderProps {
  isEditMode: boolean;
  isPersonal: boolean;
  canImport: boolean;
  isImported: boolean;
  status: "TODO" | "RUNNING" | "DONE" | "ARCHIVED";
  selectedSection: string;
  sectionName?: string;
  listSections: any[];
  dueDate?: Date;
  priority: "LOW" | "NORMAL" | "HIGH" | "URGENT";
  showSectionSelect: boolean;
  showDueDatePicker: boolean;
  setShowSectionSelect: (show: boolean) => void;
  setShowDueDatePicker: (show: boolean) => void;
  setPriority: (priority: "LOW" | "NORMAL" | "HIGH" | "URGENT") => void;
  handleMoveTask: (fromSectionId: string, toSectionId: string) => void;
  setSelectedSection: (sectionId: string) => void;
  setDueDate: (date?: Date) => void;
  addSubtask: () => void;
  handleDeleteTask: () => void;
  handleArchiveTask: () => void;
  handleImportTask: () => void;
  handleRestoreTask: () => void;
}

export function TaskHeader({
  isEditMode,
  isPersonal,
  canImport,
  isImported,
  status,
  selectedSection,
  sectionName,
  listSections,
  dueDate,
  priority,
  showSectionSelect,
  showDueDatePicker,
  setShowSectionSelect,
  setShowDueDatePicker,
  setPriority,
  handleMoveTask,
  setSelectedSection,
  setDueDate,
  addSubtask,
  handleDeleteTask,
  handleArchiveTask,
  handleImportTask,
  handleRestoreTask,
}: TaskHeaderProps) {
  return (
    <div className="flex items-center justify-between px-6 py-4 border-b">
      <div className="flex items-center gap-4 flex-1">
        {/* Section selector */}
        <DropdownMenu open={showSectionSelect} onOpenChange={setShowSectionSelect}>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 text-amber-600 font-medium hover:bg-amber-50 px-2 py-1 rounded">
              <span className="text-lg">#</span>
              <span>{listSections.find(s => s.id === selectedSection)?.name || sectionName || "work"}</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            {listSections.map((section) => (
              <DropdownMenuItem
                key={section.id}
                onClick={() => {
                  handleMoveTask(selectedSection, section.id);
                  setSelectedSection(section.id);
                  setShowSectionSelect(false);
                }}
                className="cursor-pointer"
              >
                <span className="text-amber-600 mr-2">#</span>
                {section.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Priority selector */}
        <Select value={priority} onValueChange={(value: "LOW" | "NORMAL" | "HIGH" | "URGENT") => setPriority(value)}>
          <SelectTrigger className="w-[140px] h-8">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="LOW">Low</SelectItem>
            <SelectItem value="NORMAL">Normal</SelectItem>
            <SelectItem value="HIGH">High</SelectItem>
            <SelectItem value="URGENT">Urgent</SelectItem>
          </SelectContent>
        </Select>

        {/* Due date */}
        <Popover open={showDueDatePicker} onOpenChange={setShowDueDatePicker}>
          <PopoverTrigger asChild>
            <button className="text-sm text-gray-600 hover:text-gray-900 font-medium">
              Due {dueDate ? format(dueDate, "MMM dd") : "date"}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            {dueDate && (
              <button
                onClick={() => {
                  setDueDate(undefined);
                  setShowDueDatePicker(false);
                }}
                className="block w-full text-left px-4 py-2 text-sm font-medium text-gray-700 border-b"
              >
                Clear due date
              </button>
            )}

            <Calendar
              mode="single"
              selected={dueDate}
              onSelect={(date) => {
                if (!date) return;

                const today = new Date();
                today.setHours(0, 0, 0, 0);

                const selected = new Date(date);
                selected.setHours(0, 0, 0, 0);

                if (selected < today) {
                  toast.error("Please select today or a future date.");
                  return;
                }

                setDueDate(date);
                setShowDueDatePicker(false);
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        {/* Add subtasks button */}
        <button 
          onClick={addSubtask}
          className="text-sm text-gray-600 hover:text-gray-900 font-medium"
        >
          Add subtasks
        </button>
      </div>

      <div className="flex items-center gap-2">
        {/* Actions menu - only show in edit mode */}
        {isEditMode && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-2 hover:bg-gray-100 rounded">
                <MoreHorizontal className="w-5 h-5 text-gray-600" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={handleDeleteTask} className="cursor-pointer text-red-600">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete task
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleArchiveTask} className="cursor-pointer">
                <Archive className="w-4 h-4 mr-2" />
                Archive task
              </DropdownMenuItem>
              {!isPersonal && canImport && !isImported && (
                <DropdownMenuItem onClick={handleImportTask} className="cursor-pointer">
                  <Upload className="w-4 h-4 mr-2" />
                  Import task
                </DropdownMenuItem>
              )}
              {status === "ARCHIVED" && (
                <DropdownMenuItem 
                  onClick={handleRestoreTask}
                  className="cursor-pointer"
                >
                  <Archive className="w-4 h-4 mr-2" />
                  Restore task
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
}
