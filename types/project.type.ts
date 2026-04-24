import { IBasicUser } from "./user.type";

export interface IBasicProject {
  id: string;
  name: string;
  logoUrl: string | null;
  description: string | null;
  createdAt: string;
}

export interface IProject extends IBasicProject {
  owner: IBasicUser;
  isPersonal: boolean;
  memberCount: number;
  sectionCount: number;
  taskCount: number;
}
