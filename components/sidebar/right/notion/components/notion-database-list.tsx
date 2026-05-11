"use client";

import { NotionDatabase } from "@/services/apis/notion/notion.api";
import { Search, Plus, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import NotionDatabaseItem from "./notion-database-item";

interface NotionDatabaseListProps {
  databases: NotionDatabase[];
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  onSearch: (query: string) => void;
  isSearching: boolean;
  onSelectDatabase: (id: string) => void;
  onOpenAddDialog: () => void;
  onDropTaskToDb: (dbId: string, taskId: string) => Promise<void>;
  isExportingToDb?: string | null;
}

export default function NotionDatabaseList({
  databases,
  searchQuery,
  setSearchQuery,
  onSearch,
  isSearching,
  onSelectDatabase,
  onOpenAddDialog,
  onDropTaskToDb,
  isExportingToDb
}: NotionDatabaseListProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
        <Input 
          placeholder="Search databases..." 
          className="pl-9 bg-white"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSearch(searchQuery)}
        />
      </div>
      
      {isSearching ? (
        <div className="flex justify-center p-4">
          <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <Button 
            variant="outline" 
            className="w-full border-dashed border-2 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 transition-colors flex items-center justify-center gap-2 mb-2 text-gray-500"
            onClick={onOpenAddDialog}
          >
            <Plus className="w-4 h-4" />
            Create New Database
          </Button>
          {databases.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">No databases found</p>
          ) : (
            databases.map(db => (
              <NotionDatabaseItem 
                key={db.id} 
                db={db} 
                onSelect={onSelectDatabase} 
                onDropTask={onDropTaskToDb}
                isExportingToDb={isExportingToDb}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}
