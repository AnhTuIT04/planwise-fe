import { ITask } from "./task.type";
import { IBasicUser } from "./user.type";

export interface IProject {
  id: string;
  owner: IBasicUser;
  members: IBasicUser[];
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
