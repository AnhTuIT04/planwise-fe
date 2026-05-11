"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { NotionDatabase, NotionPage } from "@/services/apis/notion/notion.api";

interface NotionAddDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  view: "databases" | "tasks";
  newItemTitle: string;
  setNewItemTitle: (val: string) => void;
  anchorPageId: string;
  setAnchorPageId: (val: string) => void;
  availablePages: NotionPage[];
  isGettingPages: boolean;
  selectedDb: NotionDatabase | undefined;
  dynamicFields: Record<string, any>;
  setDynamicFields: (val: any) => void;
  handleAddNewItem: () => void;
  isCreatingDatabase: boolean;
  isCreatingPage: boolean;
}

export default function NotionAddDialog({
  isOpen,
  onOpenChange,
  view,
  newItemTitle,
  setNewItemTitle,
  anchorPageId,
  setAnchorPageId,
  availablePages,
  isGettingPages,
  selectedDb,
  dynamicFields,
  setDynamicFields,
  handleAddNewItem,
  isCreatingDatabase,
  isCreatingPage
}: NotionAddDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>
            {view === "databases" ? "Create Notion Database" : "Create Task (Notion Page)"}
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-gray-500 uppercase">Title</label>
            <Input 
              value={newItemTitle} 
              onChange={e => setNewItemTitle(e.target.value)} 
              placeholder="Enter title..."
              autoFocus
            />
          </div>
          
          {view === "databases" ? (
             <div className="flex flex-col gap-2">
               <label className="text-xs font-semibold text-gray-500 uppercase">Parent Page (Anchor)</label>
               <Select value={anchorPageId} onValueChange={setAnchorPageId}>
                 <SelectTrigger className="w-full">
                   <SelectValue placeholder="Select a Notion Page" />
                 </SelectTrigger>
                 <SelectContent>
                   {isGettingPages ? (
                     <div className="flex justify-center p-2"><Loader2 className="w-4 h-4 animate-spin text-gray-400" /></div>
                   ) : availablePages.length === 0 ? (
                     <div className="p-2 text-sm text-gray-500">No pages found</div>
                   ) : (
                     availablePages.map(page => {
                       const titlePropKey = Object.keys(page.properties || {}).find(
                         k => page.properties[k].type === "title"
                       );
                       const titleText = titlePropKey && page.properties[titlePropKey].title?.[0]?.plain_text || "Untitled Page";
                       return (
                         <SelectItem key={page.id} value={page.id}>
                           {titleText}
                         </SelectItem>
                       )
                     })
                   )}
                 </SelectContent>
               </Select>
               <p className="text-[10px] text-gray-400 mt-1">Notion requires databases to be created inside an existing page.</p>
             </div>
          ) : (
             <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto mt-2 pr-2">
               {selectedDb && Object.keys(selectedDb.properties || {}).filter(k => selectedDb.properties?.[k]?.type !== 'title').map(key => {
                  const prop = selectedDb.properties?.[key];
                  if (!prop) return null;
                  if (prop.type === "status" || prop.type === "select") {
                     const options = prop.status?.options || prop.select?.options || [];
                     return (
                       <div key={key} className="flex flex-col gap-2">
                         <label className="text-xs font-semibold text-gray-500 uppercase">{key}</label>
                         <Select 
                            value={dynamicFields[key] || ""} 
                            onValueChange={(val) => setDynamicFields((prev: any) => ({...prev, [key]: val}))}
                         >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder={`Select ${key}`} />
                            </SelectTrigger>
                            <SelectContent>
                              {options.map((opt: any) => (
                                <SelectItem key={opt.id || opt.name} value={opt.name}>
                                  <span className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full bg-${opt.color || 'gray'}-500`} style={opt.color ? {backgroundColor: opt.color} : {}}></div>
                                    {opt.name}
                                  </span>
                                </SelectItem>
                              ))}
                            </SelectContent>
                         </Select>
                       </div>
                     );
                  }
                  
                  if (prop.type === "date") {
                     return (
                       <div key={key} className="flex flex-col gap-2">
                         <label className="text-xs font-semibold text-gray-500 uppercase">{key}</label>
                         <Input 
                           type="date"
                           value={dynamicFields[key] || ""} 
                           onChange={(e) => setDynamicFields((prev: any) => ({...prev, [key]: e.target.value}))}
                         />
                       </div>
                     );
                  }

                  if (prop.type === "rich_text") {
                     return (
                       <div key={key} className="flex flex-col gap-2">
                         <label className="text-xs font-semibold text-gray-500 uppercase">{key}</label>
                         <Input 
                           placeholder={`Enter ${key}...`}
                           value={dynamicFields[key] || ""} 
                           onChange={(e) => setDynamicFields((prev: any) => ({...prev, [key]: e.target.value}))}
                         />
                       </div>
                     );
                  }

                  return null;
               })}
             </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button 
            onClick={handleAddNewItem}
            disabled={isCreatingDatabase || isCreatingPage || !newItemTitle || (view === "databases" && !anchorPageId)}
          >
            {(isCreatingDatabase || isCreatingPage) && <Loader2 className="w-3 h-3 animate-spin mr-2" />}
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
