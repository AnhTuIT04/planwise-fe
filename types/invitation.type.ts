export interface IInvitation {
  inviteeId: string;
  invitee : {
    id: string;
    email: string;
    fullname: string;
    avatarUrl: string | null;
    verified: boolean;
    workspaceId: string;
    createdAt: string;
    updatedAt: string;
  }
  inviterId: string;
  inviter: {
    id: string;
    email: string;
    fullname: string;
    avatarUrl: string | null;
    verified: boolean;
    workspaceId: string;
    createdAt: string;
    updatedAt: string;
  }
  status: "PENDING" | "ACCEPTED" | "DECLINED";
  roleId: string;
  roleName: string;
  createdAt: string;
}