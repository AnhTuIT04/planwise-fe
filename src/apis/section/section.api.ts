import api from "@/lib/api";

export interface CreateSectionRequest {
  name: string;
  projectId: string;
  listOfTask?: string; // có thể là chuỗi ID hoặc mảng? → hiện tại là string
}

export interface UpdateSectionRequest {
  name?: string;
  listOfTask?: string;
}

export interface SectionResponse {
  id: string;
  name: string;
  projectId: string;
  listOfTask: string | null;
  createdAt: string;
  updatedAt: string;
}

interface ISectionResponse {
  section: SectionResponse;
  toSection(): SectionResponse;
}

function toSection(data: ISectionResponse): SectionResponse {
  return data.section;
}

// CREATE
export async function createSectionApi(
  payload: CreateSectionRequest
): Promise<ISectionResponse> {
  try {
    const res = await api.post<ISectionResponse>("section", payload);
    return {
      ...res.data,
      toSection: () => toSection(res.data),
    };
  } catch (error: any) {
    console.error("createSectionApi error:", error);
    throw error;
  }
}

// UPDATE
export async function updateSectionApi(
  id: string,
  payload: UpdateSectionRequest
): Promise<ISectionResponse> {
  try {
    const res = await api.patch<ISectionResponse>(`section/${id}`, payload);
    return {
      ...res.data,
      toSection: () => toSection(res.data),
    };
  } catch (error: any) {
    console.error("updateSectionApi error:", error);
    throw error;
  }
}

// DELETE
export async function deleteSectionApi(id: string): Promise<void> {
  try {
    await api.delete(`section/${id}`);
  } catch (error: any) {
    console.error("deleteSectionApi error:", error);
    throw error;
  }
}