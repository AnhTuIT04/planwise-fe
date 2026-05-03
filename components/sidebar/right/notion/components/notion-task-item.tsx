"use client";

import { NotionPage } from "@/services/apis/notion/notion.api";
import { FileText, ExternalLink, Calendar, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NotionTaskItemProps {
  task: NotionPage;
  onImport: (id: string) => void;
  importingTaskId: string | null;
}

export default function NotionTaskItem({ task, onImport, importingTaskId }: NotionTaskItemProps) {
  const titlePropKey = Object.keys(task.properties || {}).find(
    k => task.properties[k].type === "title"
  );
  const titleText = titlePropKey && task.properties[titlePropKey].title?.[0]?.plain_text 
    ? task.properties[titlePropKey].title[0].plain_text 
    : "Untitled Task";

  const statusPropKey = Object.keys(task.properties || {}).find(
    k => task.properties[k].type === "status" || task.properties[k].type === "select"
  );
  const statusObj = statusPropKey && (task.properties[statusPropKey].status || task.properties[statusPropKey].select);
  
  const datePropKey = Object.keys(task.properties || {}).find(
    k => task.properties[k].type === "date"
  );
  const dateStr = datePropKey && task.properties[datePropKey].date?.start;
  
  const descPropKey = Object.keys(task.properties || {}).find(
    k => task.properties[k].type === "rich_text"
  );
  const descText = descPropKey && task.properties[descPropKey].rich_text?.[0]?.plain_text;

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("notionPageId", task.id);
    e.dataTransfer.setData("text/plain", task.id); // Fallback
    e.dataTransfer.effectAllowed = "all";
  };

  return (
    <div 
      className="flex flex-col p-3 bg-white rounded-md border border-gray-100 shadow-sm gap-3 cursor-grab active:cursor-grabbing hover:border-blue-300 transition group"
      draggable
      onDragStart={handleDragStart}
    >
      <div className="flex flex-col gap-1.5 overflow-hidden">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-2">
            <FileText className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
            <span className="text-sm font-medium leading-tight" title={titleText}>{titleText}</span>
          </div>
          <button 
            className="p-1 rounded-md hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition shrink-0"
            onClick={(e) => {
              e.stopPropagation();
              const url = `https://www.notion.so/${task.id.replace(/-/g, "")}`;
              window.open(url, "_blank");
            }}
          >
            <ExternalLink className="w-3 h-3 text-gray-400" />
          </button>
        </div>
        
        {descText && (
           <p className="text-xs text-gray-500 line-clamp-2 ml-6 font-normal">{descText}</p>
        )}
        
        {(statusObj || dateStr) && (
           <div className="flex items-center gap-2 ml-6 mt-1 flex-wrap">
             {statusObj?.name && (
               <span 
                 className="px-2 py-0.5 text-[10px] font-medium rounded-sm"
                 style={{
                   backgroundColor: statusObj.color ? `${statusObj.color === 'default' ? '#f1f1f0' : statusObj.color}20` : '#f1f1f0',
                   color: statusObj.color === 'default' ? '#37352f' : statusObj.color
                 }}
               >
                 {statusObj.name}
               </span>
             )}
             {dateStr && (
               <div className="flex items-center text-[10px] text-gray-500 gap-1 mt-0.5">
                  <Calendar className="w-3 h-3" />
                  {new Date(dateStr).toLocaleDateString()}
               </div>
             )}
           </div>
        )}
      </div>
      <Button 
        size="sm" 
        variant="outline"
        className="w-full text-xs h-7"
        disabled={importingTaskId === task.id}
        onClick={() => onImport(task.id)}
      >
        {importingTaskId === task.id ? (
          <Loader2 className="w-3 h-3 animate-spin mr-2" />
        ) : (
          <Download className="w-3 h-3 mr-2" />
        )}
        Import
      </Button>
    </div>
  );
}
