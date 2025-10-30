export interface IUser {
  id: string;
  email: string;
  fullname: string;
  avatarUrl: string | null;
  verified: boolean;
  createdAt: string;
}
