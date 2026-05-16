"use client";

import { useEffect, useState } from "react";
import { useNotionIntegration } from "@/hooks/use-notion";
import { useProject } from "@/hooks/use-project";
import { useSection } from "@/hooks/use-section";
import { useAuth } from "@/hooks/use-auth";
import { NotionDatabase, NotionPage } from "@/services/apis/notion/notion.api";
import { Loader2, ArrowLeft, Plus, Link as LinkIcon, Download, LogOut } from "lucide-react";
import { toast } from "react-toastify";
import useModal from "@/hooks/use-modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import NotionAuthView from "./components/notion-auth-view";
import NotionDatabaseList from "./components/notion-database-list";
import NotionTaskList from "./components/notion-task-list";
import NotionAddDialog from "./components/notion-add-dialog";
import { useTask } from "@/hooks/use-task";
import { getTaskDetailApi } from "@/services/apis/task/get-task-detail.api";
export default function NotionSidebar() {
  const { user } = useAuth();
  const {
    integrated,
    connections,
    isLoadingConnections,
    searchDatabases,
    isSearchingDatabases,
    getDatabaseTasks,
    isGettingTasks,
    importTask,
    isImporting,
    getPages,
    isGettingPages,
    createDatabase,
    isCreatingDatabase,
    createPage,
    isCreatingPage,
    deleteConnection,
    isDeletingConnection,
  } = useNotionIntegration();

  const [view, setView] = useState<"auth" | "databases" | "tasks">("auth");
  const [databases, setDatabases] = useState<NotionDatabase[]>([]);
  const [tasks, setTasks] = useState<NotionPage[]>([]);
  const [selectedDatabaseId, setSelectedDatabaseId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [importingTaskId, setImportingTaskId] = useState<string | null>(null);
  const [isExportingToDb, setIsExportingToDb] = useState<string | null>(null);

  // Import by Link state
  const [importLink, setImportLink] = useState("");
  const [isImportingByLink, setIsImportingByLink] = useState(false);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newItemTitle, setNewItemTitle] = useState("");
  const [anchorPageId, setAnchorPageId] = useState("");
  const [availablePages, setAvailablePages] = useState<NotionPage[]>([]);
  const [dynamicFields, setDynamicFields] = useState<Record<string, any>>({});

  const { openModal } = useModal<"ADD_UPDATE_TASK">();
  const { openModal: openSectionPicker } = useModal<"NOTION_SECTION_PICKER">();
  const { openModal: openConfirmModal } = useModal<"CONFIRM">();
  const { data: sections } = useSection(user?.workspaceId || "");

  const handleDisconnect = () => {
    const conn = connections?.[0];
    if (!conn) return;
    openConfirmModal({
      type: "CONFIRM",
      data: {
        title: "Disconnect Notion?",
        description: `This will remove the connection${conn.email ? ` for ${conn.email}` : ""}. You can reconnect anytime.`,
        confirmText: "Disconnect",
        cancelText: "Cancel",
      },
      onSubmit: async () => {
        await deleteConnection({ connectionId: conn.id });
      },
    });
  };

  useEffect(() => {
    if (!isLoadingConnections) {
      if (integrated) {
        setView("databases");
        handleSearchDatabases("");
      } else {
        setView("auth");
      }
    }
  }, [integrated, isLoadingConnections]);

  const handleSearchDatabases = async (query: string) => {
    try {
      const results = await searchDatabases(query);
      setDatabases(results);
    } catch (e) {}
  };

  const handleSelectDatabase = async (dbId: string) => {
    setSelectedDatabaseId(dbId);
    setView("tasks");
    try {
      const results = await getDatabaseTasks(dbId);
      setTasks(results);
    } catch (e) {}
  };

  const handleImport = (notionPageId: string) => {
    if (!user?.workspaceId) return;
    const projectId = user.workspaceId;
    const page = tasks.find((t) => t.id === notionPageId);
    const titlePropKey = page && Object.keys(page.properties || {}).find((k) => page.properties[k].type === "title");
    const pageTitle = titlePropKey ? page!.properties[titlePropKey].title?.[0]?.plain_text : undefined;

    openSectionPicker({
      type: "NOTION_SECTION_PICKER",
      data: {
        notionPageId,
        notionPageTitle: pageTitle,
        projectId,
        sections: (sections || []).map((s) => ({ id: s.id, name: s.name })),
        onPick: async (sectionId) => {
          setImportingTaskId(notionPageId);
          try {
            await importTask({ notionPageId, projectId, sectionId });
          } finally {
            setImportingTaskId(null);
          }
        },
      },
    });
  };

  const handleImportByLink = async () => {
    if (!importLink.trim()) return;
    if (!user?.workspaceId) return;
    const projectId = user.workspaceId;

    const match = importLink.match(/[a-f0-9]{32}/i);
    if (!match) {
      toast.error("Invalid Notion URL. Could not find Page ID.");
      return;
    }
    const pageId = match[0];

    openSectionPicker({
      type: "NOTION_SECTION_PICKER",
      data: {
        notionPageId: pageId,
        projectId,
        sections: (sections || []).map((s) => ({ id: s.id, name: s.name })),
        onPick: async (sectionId) => {
          setIsImportingByLink(true);
          try {
            await importTask({ notionPageId: pageId, projectId, sectionId });
            setImportLink("");
          } finally {
            setIsImportingByLink(false);
          }
        },
      },
    });
  };

  const handleDropTaskToNotion = async (dbId: string, taskId: string) => {
    try {
      setIsExportingToDb(dbId);
      const targetDb = databases.find((d) => d.id === dbId);
      if (!targetDb) return;

      const task = await getTaskDetailApi(taskId);
      if (!task) return;

      const realDatabaseId =
        (targetDb as any).object === "data_source" && (targetDb as any).parent?.database_id
          ? (targetDb as any).parent.database_id
          : dbId;

      const properties: any = {};
      const dbProps = targetDb.properties || {};

      // Find title key
      const titleKey = Object.keys(dbProps).find((k) => dbProps[k].type === "title") || "Name";
      properties[titleKey] = { title: [{ text: { content: task.title } }] };

      if (task.description) {
        const descKey = Object.keys(dbProps).find((k) => dbProps[k].type === "rich_text");
        if (descKey) properties[descKey] = { rich_text: [{ text: { content: task.description } }] };
      }

      await createPage({
        title: task.title,
        databaseId: realDatabaseId,
        properties: Object.keys(properties).length > 1 ? properties : undefined,
      } as any);

      toast.success("Task exported to Notion!");
      if (selectedDatabaseId === dbId) {
        handleSelectDatabase(dbId);
      }
    } catch (e) {
      toast.error("Failed to export task to Notion");
    } finally {
      setIsExportingToDb(null);
    }
  };

  const handleOpenAddDialog = async () => {
    setIsAddDialogOpen(true);
    setNewItemTitle("");
    setDynamicFields({});
    if (view === "databases" && availablePages.length === 0) {
      try {
        const res = await getPages();
        setAvailablePages(res);
      } catch (e) {}
    }
  };

  const selectedDb = databases.find((d) => d.id === selectedDatabaseId);

  const handleAddNewItem = async () => {
    if (!newItemTitle.trim()) {
      toast.error("Please enter a title");
      return;
    }

    try {
      if (view === "databases") {
        if (!anchorPageId) {
          toast.error("Please select an anchor page");
          return;
        }
        await createDatabase({ title: newItemTitle, parentPageId: anchorPageId });
        await handleSearchDatabases(searchQuery);
      } else if (view === "tasks" && selectedDatabaseId && selectedDb) {
        const realDatabaseId =
          (selectedDb as any).object === "data_source" && (selectedDb as any).parent?.database_id
            ? (selectedDb as any).parent.database_id
            : selectedDatabaseId;

        const properties: any = {};
        const dbProps = selectedDb.properties || {};
        const titleKey = Object.keys(dbProps).find((k) => dbProps[k].type === "title") || "Name";
        properties[titleKey] = { title: [{ text: { content: newItemTitle } }] };

        Object.entries(dynamicFields).forEach(([key, value]) => {
          if (!value) return;
          const propSchema = dbProps[key];
          if (!propSchema) return;

          switch (propSchema.type) {
            case "status":
              properties[key] = { status: { name: value } };
              break;
            case "select":
              properties[key] = { select: { name: value } };
              break;
            case "date":
              properties[key] = { date: { start: new Date(value).toISOString() } };
              break;
            case "rich_text":
              properties[key] = { rich_text: [{ text: { content: value } }] };
              break;
          }
        });

        await createPage({
          title: newItemTitle,
          databaseId: realDatabaseId,
          properties: Object.keys(properties).length > 1 ? properties : undefined,
        } as any);
        await handleSelectDatabase(selectedDatabaseId);
      }
      setIsAddDialogOpen(false);
      setNewItemTitle("");
      setDynamicFields({});
    } catch (e) {}
  };

  if (isLoadingConnections) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-[#f8f8f9]">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col bg-[#f8f8f9]">
      <div className="flex h-12 items-center justify-between border-b p-4">
        <h2 className="flex items-center gap-2 text-[16px] font-semibold text-[#787878]">
          {view === "tasks" && (
            <button onClick={() => setView("databases")} className="rounded p-1 hover:bg-gray-200">
              <ArrowLeft className="h-4 w-4" />
            </button>
          )}
          Notion Integration
        </h2>
        {integrated && (
          <button
            type="button"
            title="Disconnect Notion"
            onClick={handleDisconnect}
            disabled={isDeletingConnection}
            className="text-muted-foreground hover:text-red-500 shrink-0 rounded p-1 transition-colors disabled:opacity-50"
          >
            <LogOut className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
        {view === "auth" ? (
          <NotionAuthView />
        ) : (
          <>
            {/* Import by Link Section — only show in tasks view (manage-database area hides it) */}
            {view !== "databases" && (
              <div className="flex flex-col gap-2 rounded-lg border border-blue-100/50 bg-blue-50/50 p-3">
                <label className="flex items-center gap-1.5 text-[10px] font-bold text-blue-600 uppercase">
                  <LinkIcon className="h-3 w-3" />
                  Quick Import by Link
                </label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Paste Notion URL..."
                    className="h-8 flex-1 bg-white text-xs"
                    value={importLink}
                    onChange={(e) => setImportLink(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleImportByLink()}
                  />
                  <Button
                    size="sm"
                    className="h-8 bg-blue-600 px-2 hover:bg-blue-700"
                    disabled={isImportingByLink || !importLink.trim()}
                    onClick={handleImportByLink}
                  >
                    {isImportingByLink ? <Loader2 className="h-3 w-3 animate-spin" /> : <Download className="h-3 w-3" />}
                  </Button>
                </div>
              </div>
            )}

            {view === "databases" ? (
              <NotionDatabaseList
                databases={databases}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onSearch={handleSearchDatabases}
                isSearching={isSearchingDatabases}
                onSelectDatabase={handleSelectDatabase}
                onOpenAddDialog={handleOpenAddDialog}
                onDropTaskToDb={handleDropTaskToNotion}
                isExportingToDb={isExportingToDb}
              />
            ) : (
              <NotionTaskList
                tasks={tasks}
                isGettingTasks={isGettingTasks}
                onImport={handleImport}
                importingTaskId={importingTaskId}
                onOpenAddDialog={handleOpenAddDialog}
              />
            )}
          </>
        )}
      </div>

      <NotionAddDialog
        isOpen={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        view={view as any}
        newItemTitle={newItemTitle}
        setNewItemTitle={setNewItemTitle}
        anchorPageId={anchorPageId}
        setAnchorPageId={setAnchorPageId}
        availablePages={availablePages}
        isGettingPages={isGettingPages}
        selectedDb={selectedDb}
        dynamicFields={dynamicFields}
        setDynamicFields={setDynamicFields}
        handleAddNewItem={handleAddNewItem}
        isCreatingDatabase={isCreatingDatabase}
        isCreatingPage={isCreatingPage}
      />
    </div>
  );
}
