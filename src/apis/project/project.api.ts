import api from "@/lib/api";

export interface CreateProjectRequest {
  name: string;
  description?: string;
  isPersonal?: boolean;
}

export interface UpdateProjectRequest {
  name?: string;
  description?: string;
}

export interface SectionInProject {
  id: string;
  name: string;
  listOfTask: string;
  createdAt: string;
  projectId: string;
  tasks: any[];
}

export interface ProjectResponse {
  id: string;
  name: string;
  description: string | null;
  isPersonal: boolean;
  listOfSection: string;
  createdAt: string;
  owner: string;
  sections: SectionInProject[];
  taskCount: number;
}

// === Response Interfaces (phù hợp với backend thật) ===
interface IProjectListResponseRaw {
  projects: ProjectResponse[];
}

interface IProjectDetailResponseRaw extends ProjectResponse {
  toProject(): ProjectResponse;
}

// === Enhanced Response ===
export interface IProjectListResponse extends IProjectListResponseRaw {
  toProjects(): ProjectResponse[];
}

export interface IProjectDetailResponse extends IProjectDetailResponseRaw {
  toProject(): ProjectResponse;
}

// === Helper: Identity function (vì backend đã trả đúng) ===
const toProject = (data: ProjectResponse): ProjectResponse => data;
const toProjects = (data: { projects: ProjectResponse[] }): ProjectResponse[] => data.projects;

// === API Functions ===
export async function createProjectApi(
  payload: CreateProjectRequest
): Promise<IProjectDetailResponse> {
  const res = await api.post<ProjectResponse & { toProject(): ProjectResponse }>("project", payload);
  return {
    ...res.data,
    toProject: () => toProject(res.data),
  };
}

export async function getAllProjectsApi(): Promise<IProjectListResponse> {
  const res = await api.get<IProjectListResponseRaw>("project");
  return {
    ...res.data,
    toProjects: () => toProjects(res.data),
  };
}

export async function getPersonalProjectApi(): Promise<IProjectDetailResponse> {
  // Backend trả về ProjectResponse + toProject()
  const res = await api.get<ProjectResponse & { toProject(): ProjectResponse }>("project/personal");
  console.log("res personal project", res.data);
  res.data.sections.forEach((section) => {
    console.log("section personal", section, section.tasks);
  });
  return {
    ...res.data,
    toProject: () => toProject(res.data),
  };
}

export async function getDetailedProjectApi(
  id: string
): Promise<IProjectDetailResponse> {
  const res = await api.get<ProjectResponse & { toProject(): ProjectResponse }>(`project/${id}`);
  return {
    ...res.data,
    toProject: () => toProject(res.data),
  };
}

export async function updateProjectApi(
  id: string,
  payload: UpdateProjectRequest
): Promise<IProjectDetailResponse> {
  const res = await api.patch<ProjectResponse & { toProject(): ProjectResponse }>(`project/${id}`, payload);
  return {
    ...res.data,
    toProject: () => toProject(res.data),
  };
}

export async function deleteProjectApi(id: string): Promise<void> {
  await api.delete(`project/${id}`);
}