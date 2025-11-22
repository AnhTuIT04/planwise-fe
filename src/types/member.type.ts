import { IBasicUser } from "./user.type";

export enum MemberRole {
  OWNER = "Owner",
  PROJECT_MANAGER = "Project Manager",
  DEVELOPER = "Developer",
  VIEWER = "Viewer",
}

export enum MemberStatus {
  ACTIVE = "Active",
  INACTIVE = "Inactive",
  PENDING = "Pending",
}

export interface IMember extends IBasicUser {
  role: MemberRole;
  status: MemberStatus;
  joinedDate: string;
}
