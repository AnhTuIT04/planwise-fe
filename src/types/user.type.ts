export interface IUser {
  id: string;
  email: string;
  fullname: string;
  avatarUrl: string | null;
  verified: boolean;
  createdAt: string;
  workspaceId: string;
}

export interface IBasicUser {
  id: string;
  email: string;
  fullname: string;
  avatarUrl: string | null;
}

export interface IUserInProject extends IBasicUser {
  id: string;
  email: string;
  avatarUrl: string | null;
  fullname: string;
  role: {
    id: string;
    name: string;
    default: boolean;
    permissions: string[];
  }
}
