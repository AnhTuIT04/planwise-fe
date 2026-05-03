import { IRole } from "./role.type";

export interface IBasicUser {
  id: string;
  email: string;
  fullname: string;
  avatarUrl: string | null;
}

export interface IUser extends IBasicUser {
  workspaceId: string;
  createdAt: string;
}

export interface IProjectMember extends IBasicUser {
  role: IRole;
}

export type IUserInProject = IProjectMember;
