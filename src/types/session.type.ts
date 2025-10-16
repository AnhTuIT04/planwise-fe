export interface IAuth {
  id: number;
  email: string;
  accessToken: string;
  refreshToken: string;
}

export type ISession = {
  user: Omit<IAuth, "accessToken" | "refreshToken"> | null;
  iat?: number;
  exp?: number;
};
