"use client";

import { NotionDatabase } from "@/services/apis/notion/notion.api";
import { Database, ExternalLink, ChevronRight, Loader2 } from "lucide-react";
import { useState } from "react";

interface NotionDatabaseItemProps {
  db: NotionDatabase;
  onSelect: (id: string) => void;
  onDropTask: (dbId: string, taskId: string) => Promise<void>;
  isExportingToDb?: string | null;
}

export default function NotionDatabaseItem({ 
  db, 
  onSelect, 
  onDropTask,
  isExportingToDb 
}: NotionDatabaseItemProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const taskId = e.dataTransfer.getData("taskId") || e.dataTransfer.getData("text/plain");
    if (taskId) {
      await onDropTask(db.id, taskId);
    }
  };

  return (
    <div 
      onClick={() => onSelect(db.id)}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`flex items-center justify-between p-3 bg-white rounded-md border shadow-sm cursor-pointer transition-all group ${
        isDragOver ? "border-blue-500 bg-blue-50 scale-[1.02]" : "border-gray-100 hover:border-gray-300"
      } ${isExportingToDb === db.id ? "opacity-70" : ""}`}
    >
      <div className="flex items-center gap-3 overflow-hidden">
        {isExportingToDb === db.id ? (
          <Loader2 className="w-4 h-4 animate-spin text-blue-500 flex-shrink-0" />
        ) : (
          <Database className={`w-4 h-4 flex-shrink-0 ${isDragOver ? "text-blue-500" : "text-gray-400"}`} />
        )}
        <span className={`text-sm font-medium truncate ${isDragOver ? "text-blue-600" : ""}`}>
          {db.title?.[0]?.plain_text || "Untitled Database"}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <button 
           className="p-1.5 rounded-md hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition"
           onClick={(e) => {
             e.stopPropagation();
             const dbId = (db as any).parent?.database_id || db.id;
             const url = `https://www.notion.so/${dbId.replace(/-/g, "")}`;
             window.open(url, "_blank");
           }}
        >
          <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
        </button>
        <ChevronRight className="w-4 h-4 text-gray-300" />
      </div>
    </div>
  );
}
