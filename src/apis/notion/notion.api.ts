import api from "@/lib/api";

export interface NotionProperty {
  id: string;
  type: string;
  [key: string]: any;
}

export interface NotionPage {
  id: string;
  object: "page";
  properties: Record<string, NotionProperty>;
  url: string;
  parent: {
    type: string;
    database_id?: string;
    page_id?: string;
    workspace?: boolean;
  };
}

export interface NotionDatabase {
  id: string;
  object: "database" | "data_source";
  title: Array<{ plain_text: string }>;
  properties: Record<string, any>;
  url: string;
}

export interface ImportNotionTaskRequest {
  notionPageId: string;
  projectId: string;
  sectionId?: string;
}

export interface QueryNotionDatabaseRequest {
  query?: string;
}

export interface CreateNotionDatabaseRequest {
  parentPageId: string;
  title: string;
  properties?: Record<string, any>;
}

export interface CreateNotionPageRequest {
  databaseId: string;
  title: string;
  properties?: Record<string, any>;
}

export interface UpdateNotionPropertyRequest {
  propertyId: string;
  value: any;
  type: string;
}

// API Functions

export async function searchNotionDatabasesApi(query?: string): Promise<NotionDatabase[]> {
  const res = await api.get<NotionDatabase[]>("notion/databases", { params: { query } });
  return res.data;
}

export async function getNotionDatabaseTasksApi(databaseId: string): Promise<NotionPage[]> {
  const res = await api.get<NotionPage[]>(`notion/databases/${databaseId}/tasks`);
  return res.data;
}

export async function importNotionTaskApi(payload: ImportNotionTaskRequest): Promise<any> {
  const res = await api.post("notion/import", payload);
  return res.data;
}

export async function getNotionPagesApi(): Promise<any[]> {
  const res = await api.get<any[]>("notion/pages");
  return res.data;
}

export async function createNotionDatabaseApi(payload: CreateNotionDatabaseRequest): Promise<NotionDatabase> {
  const res = await api.post<NotionDatabase>("notion/databases", payload);
  return res.data;
}

export async function createNotionPageApi(payload: CreateNotionPageRequest): Promise<NotionPage> {
  const res = await api.post<NotionPage>("notion/pages", payload);
  return res.data;
}

export async function getNotionPageDetailApi(pageId: string): Promise<NotionPage> {
  const res = await api.get<NotionPage>(`notion/pages/${pageId}`);
  return res.data;
}

export async function updateNotionPagePropertyApi(pageId: string, payload: UpdateNotionPropertyRequest): Promise<NotionPage> {
  const res = await api.patch<NotionPage>(`notion/pages/${pageId}/properties`, payload);
  return res.data;
}
