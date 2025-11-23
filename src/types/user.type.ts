export interface IUser {
  id: string;
  email: string;
  fullname: string;
  avatarUrl: string | null;
  verified: boolean;
  createdAt: string;
}

export interface IBasicUser {
  id: string;
  email: string;
  fullname: string;
  avatarUrl: string | null;
}

export interface IUserInProject extends IBasicUser {
  role: {
    id: string;
    name: string;
    permissions: Array<{
      id: string;
      name: string;
    }>;
  };
}
