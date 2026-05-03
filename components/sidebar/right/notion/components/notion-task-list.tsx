"use client";

import { NotionPage } from "@/services/apis/notion/notion.api";
import { Search, Plus, Loader2, Filter, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useMemo } from "react";
import NotionTaskItem from "./notion-task-item";

interface NotionTaskListProps {
  tasks: NotionPage[];
  isGettingTasks: boolean;
  onImport: (id: string) => void;
  importingTaskId: string | null;
  onOpenAddDialog: () => void;
  sections: any[];
  selectedSectionId: string;
  setSelectedSectionId: (id: string) => void;
}

export default function NotionTaskList({
  tasks,
  isGettingTasks,
  onImport,
  importingTaskId,
  onOpenAddDialog,
  sections,
  selectedSectionId,
  setSelectedSectionId
}: NotionTaskListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [showFilters, setShowFilters] = useState(false);

  // Extract unique statuses from tasks
  const availableStatuses = useMemo(() => {
    const statuses = new Set<string>();
    tasks.forEach(task => {
      const statusPropKey = Object.keys(task.properties || {}).find(
        k => task.properties[k].type === "status" || task.properties[k].type === "select"
      );
      const statusObj = statusPropKey && (task.properties[statusPropKey].status || task.properties[statusPropKey].select);
      if (statusObj?.name) statuses.add(statusObj.name);
    });
    return Array.from(statuses);
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const titlePropKey = Object.keys(task.properties || {}).find(
        k => task.properties[k].type === "title"
      );
      const titleText = titlePropKey && task.properties[titlePropKey].title?.[0]?.plain_text || "Untitled Task";
      
      const matchesSearch = titleText.toLowerCase().includes(searchTerm.toLowerCase());
      
      const statusPropKey = Object.keys(task.properties || {}).find(
        k => task.properties[k].type === "status" || task.properties[k].type === "select"
      );
      const statusObj = statusPropKey && (task.properties[statusPropKey].status || task.properties[statusPropKey].select);
      const matchesStatus = statusFilter === "ALL" || statusObj?.name === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [tasks, searchTerm, statusFilter]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold text-gray-500 uppercase">Import To Section</label>
        <Select value={selectedSectionId} onValueChange={setSelectedSectionId}>
          <SelectTrigger className="w-full bg-white">
            <SelectValue placeholder="Select a section" />
          </SelectTrigger>
          <SelectContent>
            {sections?.map(section => (
              <SelectItem key={section.id} value={section.id}>
                {section.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="h-px bg-gray-200 my-1" />

      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-gray-500" />
            <Input 
              placeholder="Search tasks..." 
              className="pl-8 h-8 text-sm bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button 
            variant="outline" 
            size="icon" 
            className={`h-8 w-8 ${showFilters ? 'bg-blue-50 text-blue-600 border-blue-200' : ''}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-3.5 w-3.5" />
          </Button>
        </div>

        {showFilters && (
          <div className="p-3 bg-gray-50 rounded-md border border-gray-200 flex flex-col gap-2 animate-in slide-in-from-top-1 duration-200">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-gray-400 uppercase">Filters</span>
              <button onClick={() => {setStatusFilter("ALL"); setSearchTerm("");}} className="text-[10px] text-blue-600 hover:underline">Reset</button>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-gray-500 font-medium">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-7 text-xs bg-white">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Statuses</SelectItem>
                  {availableStatuses.map(status => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        <Button 
          variant="outline" 
          className="w-full border-dashed border-2 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 transition-colors flex items-center justify-center gap-2 text-gray-500"
          onClick={onOpenAddDialog}
        >
          <Plus className="w-4 h-4" />
          Create New Page in Notion
        </Button>

        {isGettingTasks ? (
          <div className="flex justify-center p-4">
            <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filteredTasks.length === 0 ? (
               <p className="text-sm text-gray-500 text-center py-4">
                 {searchTerm || statusFilter !== "ALL" ? "No matching tasks" : "No tasks found"}
               </p>
            ) : (
              filteredTasks.map(task => (
                <NotionTaskItem 
                  key={task.id} 
                  task={task} 
                  onImport={onImport} 
                  importingTaskId={importingTaskId} 
                />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
