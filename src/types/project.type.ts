import { ITask } from "./task.type";
import { IBasicUser, IUserInProject } from "./user.type";

export interface IProject {
  id: string;
  owner: IUserInProject;
  members: IUserInProject[];
  name: string;
  description: string | null;
  logoUrl: string | null;
  isPersonal: boolean;
  sections: {
    id: string;
    name: string;
    createdAt: string;
    tasks: ITask[];
  }[];
  sectionCount: number;
  taskCount: number;
  createdAt: string;
}
