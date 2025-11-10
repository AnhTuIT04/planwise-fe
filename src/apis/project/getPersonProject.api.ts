import api from "@/lib/api";
import {ISection} from "../../types/section.type";
import {IProject} from "../../types/project.type";
import {ITask} from "../../types/task.type";
interface IProjectResponse {
  id: string;
  name: string;
  description: string | null;
  isPersonal: boolean;
  listOfSection: string;
  createdAt: string;
  owner: string;
  sections: ISectionResponse[];
  taskCount: number;
}
interface ISectionResponse {
  id: string;
  name: string;
  listOfTask: string;
  createdAt: string;
  projectId: string;
  tasks: ITaskResponse[];
}
interface ITaskResponse {
  id: string;
  title: string;
  description: string | null;
  status: "TODO" | "DONE";
  priority: "LOW" | "MEDIUM" | "HIGH" | null;
  startDate: string | null;
  dueDate: string | null;
  createdAt: string;
  updatedAt?: string;
  createdBy?: string;
  sectionId: string;
  parentTaskId: string | null;
  supervisorId: string | null;
  projectId: string;
  assignees: { id: string }[];
}
interface IRequest {
  page: number;
  limit: number;
}

interface IResponse {
  userId: string;
  id: string;
  title: string;
  body: string;
}
function toProject(data: IProjectResponse): IProject {
  return {
    id: data.id,
    name: data.name,
    // description: data.description,
    isPersonal: data.isPersonal,
    sections: data.sections.map(
        (section) => transformSection(section)
    ),
  };
}
export function getPersonalProjectApi() {
  return api.safeExec<IProject>(
    {
      method: "GET",
      url: "project/personal"
    },
    toProject
  );
}
const transformSection = (section: any): ISection => {
  const rawTasks: any[] = section.tasks || [];

  const taskMap = new Map<string, ITask>();
  const rootTasks: ITask[] = [];
  const subtaskMap = new Map<string, ITask[]>();

  rawTasks.forEach((raw: any) => {
    const isSubtask = raw.parentTaskId !== null;

    if (isSubtask && raw.parentTaskId) {
      const sub: ITask = {
        id: raw.id,
        title: raw.title,
        description: raw.description || null,
        priority: raw.priority || null,
        startDate: raw.startDate || null,
        dueDate: raw.dueDate || null,
        createdAt: raw.createdAt,
        createdBy: raw.createdBy || "",
        status: raw.status || "TODO",
        projectId: raw.projectId,
        sectionId: raw.sectionId,
        subTask: [],
        assignees: raw.assignees || [],
      };

      if (!subtaskMap.has(raw.parentTaskId)) {
        subtaskMap.set(raw.parentTaskId, []);
      }
      subtaskMap.get(raw.parentTaskId)!.push(sub);
    } else if (!isSubtask) {
      const task: ITask = {
        id: raw.id,
        title: raw.title,
        description: raw.description || null,
        subTask: [],
        priority: raw.priority || null,
        startDate: raw.startDate || null,
        dueDate: raw.dueDate || null,
        createdAt: raw.createdAt,
        createdBy: raw.createdBy || "",
        status: raw.status || "TODO",
        projectId: raw.projectId,
        sectionId: raw.sectionId,
        assignees: raw.assignees || [],
      };
      taskMap.set(task.id, task);
      rootTasks.push(task);
    }
  });

  // Gán subtasks vào task cha
  rootTasks.forEach((task) => {
    if (subtaskMap.has(task.id)) {
      task.subTask = subtaskMap.get(task.id)!;
    }
  });

  console.log(" taskMap", rootTasks);
  const order = section.listOfTask
    .replaceAll('\"', "")
    .split(",")
    .map((id: string) => id.trim())
    .filter((id: string) => id && taskMap.has(id));
  console.log(" order: ", order);
  const orderedTasks = order.length > 0 ? order.map((id: string) => taskMap.get(id)!) : rootTasks;
  console.log(" order task: ", orderedTasks);
  const newListOfTask = orderedTasks.map((t: ITask) => t.id).join(",");

  return {
    id: section.id,
    name: section.name,
    projectId: section.projectId,
    listOfTask: newListOfTask,
    tasks: orderedTasks,
  };
};