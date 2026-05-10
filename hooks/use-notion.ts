"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getConnectionsApi } from "@/services/apis/calendar/get-connections.api";
import { deleteConnectionApi } from "@/services/apis/calendar/disconnect.api";
import {
  searchNotionDatabasesApi,
  getNotionDatabaseTasksApi,
  importNotionTaskApi,
  ImportNotionTaskPayload,
  getNotionPagesApi,
  createNotionDatabaseApi,
  CreateNotionDatabasePayload,
  createNotionPageApi,
  CreateNotionPagePayload,
  getNotionPageDetailsApi,
  updateNotionPagePropertyApi,
  UpdateNotionPropertyPayload,
} from "@/services/apis/notion/notion.api";
import { toast } from "react-toastify";

export function useNotionIntegration() {
  const queryClient = useQueryClient();
  const provider = "NOTION";

  const { data: connections, isLoading: isLoadingConnections } = useQuery({
    queryKey: ["notion-connections"],
    queryFn: async () => {
      const [res, err] = await getConnectionsApi(provider);
      if (err) throw err;
      return res;
    },
  });

  const deleteConnection = useMutation({
    mutationFn: ({ connectionId }: { connectionId: string }) => deleteConnectionApi(provider, connectionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notion-connections"] });
      toast.success("Notion disconnected");
    },
  });

  const searchDatabases = useMutation({
    mutationFn: async (query?: string) => {
      const [res, err] = await searchNotionDatabasesApi(query);
      if (err) throw err;
      return res;
    },
  });

  const getDatabaseTasks = useMutation({
    mutationFn: async (databaseId: string) => {
      const [res, err] = await getNotionDatabaseTasksApi(databaseId);
      if (err) throw err;
      return res;
    },
  });

  const importTask = useMutation({
    mutationFn: async (payload: ImportNotionTaskPayload) => {
      const [res, err] = await importNotionTaskApi(payload);
      if (err) throw err;
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-detail"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Task imported from Notion successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to import task");
    },
  });

  const getPages = useMutation({
    mutationFn: async () => {
      const [res, err] = await getNotionPagesApi();
      if (err) throw err;
      return res;
    },
  });

  const createDatabase = useMutation({
    mutationFn: async (payload: CreateNotionDatabasePayload) => {
      const [res, err] = await createNotionDatabaseApi(payload);
      if (err) throw err;
      return res;
    },
    onSuccess: () => {
      toast.success("Database created on Notion!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create database");
    },
  });

  const createPage = useMutation({
    mutationFn: async (payload: CreateNotionPagePayload) => {
      const [res, err] = await createNotionPageApi(payload);
      if (err) throw err;
      return res;
    },
    onSuccess: () => {
      toast.success("Task created on Notion!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create page");
    },
  });

  const getPageDetails = useMutation({
    mutationFn: async (pageId: string) => {
      const [res, err] = await getNotionPageDetailsApi(pageId);
      if (err) throw err;
      return res;
    },
  });

  const updatePageProperty = useMutation({
    mutationFn: async ({ pageId, payload }: { pageId: string; payload: UpdateNotionPropertyPayload }) => {
      const [res, err] = await updateNotionPagePropertyApi(pageId, payload);
      if (err) throw err;
      return res;
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update Notion property");
    },
  });

  return {
    integrated: (connections?.length ?? 0) > 0,
    connections: connections ?? [],
    isLoadingConnections,
    deleteConnection: deleteConnection.mutateAsync,
    isDeletingConnection: deleteConnection.isPending,

    searchDatabases: searchDatabases.mutateAsync,
    isSearchingDatabases: searchDatabases.isPending,

    getDatabaseTasks: getDatabaseTasks.mutateAsync,
    isGettingTasks: getDatabaseTasks.isPending,

    importTask: importTask.mutateAsync,
    isImporting: importTask.isPending,

    getPages: getPages.mutateAsync,
    isGettingPages: getPages.isPending,

    createDatabase: createDatabase.mutateAsync,
    isCreatingDatabase: createDatabase.isPending,

    createPage: createPage.mutateAsync,
    isCreatingPage: createPage.isPending,

    getPageDetails: getPageDetails.mutateAsync,
    isGettingPageDetails: getPageDetails.isPending,

    updatePageProperty: updatePageProperty.mutateAsync,
    isUpdatingPageProperty: updatePageProperty.isPending,
  };
}
