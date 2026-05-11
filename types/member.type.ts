import { IBasicUser } from "./user.type";

export enum MemberStatus {
  ACTIVE = "Active",
  INACTIVE = "Inactive",
  PENDING = "Pending",
}

export interface IMember extends IBasicUser {
  role: {
    id: string;
    name: string;
    isDefault?: boolean;
  };
  status: MemberStatus;
  joinedDate: string;
}
