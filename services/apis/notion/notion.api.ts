import api from "@/lib/api";

export interface NotionDatabase {
  id: string;
  title: any[];
  url: string;
  properties?: Record<string, any>;
  object?: string;
  parent?: any;
}

export interface NotionPage {
  id: string;
  url: string;
  properties: any;
}

export function searchNotionDatabasesApi(query?: string) {
  return api.safeExec<NotionDatabase[]>({
    method: "GET",
    url: `/notion/databases`,
    params: { query },
  });
}

export function getNotionDatabaseTasksApi(databaseId: string) {
  return api.safeExec<NotionPage[]>({
    method: "GET",
    url: `/notion/databases/${databaseId}/tasks`,
  });
}

export interface ImportNotionTaskPayload {
  notionPageId: string;
  projectId: string;
  sectionId?: string;
}

export function importNotionTaskApi(payload: ImportNotionTaskPayload) {
  return api.safeExec<any>({
    method: "POST",
    url: `/notion/import`,
    data: payload,
  });
}

export function getNotionPagesApi() {
  return api.safeExec<NotionPage[]>({
    method: "GET",
    url: `/notion/pages`,
  });
}

export interface CreateNotionDatabasePayload {
  title: string;
  parentPageId: string;
}

export function createNotionDatabaseApi(payload: CreateNotionDatabasePayload) {
  return api.safeExec<any>({
    method: "POST",
    url: `/notion/databases`,
    data: payload,
  });
}

export interface CreateNotionPagePayload {
  title: string;
  databaseId: string;
}

export function createNotionPageApi(payload: CreateNotionPagePayload) {
  return api.safeExec<any>({
    method: "POST",
    url: `/notion/pages`,
    data: payload,
  });
}

export function getNotionPageDetailsApi(pageId: string) {
  return api.safeExec<any>({
    method: "GET",
    url: `/notion/pages/${pageId}`,
  });
}

export interface UpdateNotionPropertyPayload {
  propertyId: string;
  value: any;
  type: string;
}

export function updateNotionPagePropertyApi(pageId: string, payload: UpdateNotionPropertyPayload) {
  return api.safeExec<any>({
    method: "PATCH",
    url: `/notion/pages/${pageId}/properties`,
    data: payload,
  });
}
