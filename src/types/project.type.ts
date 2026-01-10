import { ITask } from "./task.type";
import { IBasicUser, IUserInProject, IUser } from "./user.type";
// import {}
export interface IProject {
  id: string;
  owner: IBasicUser;
  // members: IUserInProject[];
  name: string;
  description: string | null;
  logoUrl: string | null;
  isPersonal: boolean;
  // sections: {
  //   id: string;
  //   name: string;
  //   createdAt: string;
  //   tasks: ITask[];
  // }[];
  memberCount: number;
  sectionCount: number;
  taskCount: number;
  createdAt: string;
}
export interface IBasicProject {
  id: string;
  name: string;
  logoUrl: string | null;
  description: string | null;
  createdAt: string;
}
