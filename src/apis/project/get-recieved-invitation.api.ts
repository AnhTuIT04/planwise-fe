import api from "@/lib/api";
interface IGetReceivedInvitationsResponse {
  data: IInvitation[];
  message: string;
  pagination: {
    totalItems: number;
    totalPages: number;
    page: number;
    limit: number;
  };
}
interface IInvitation {
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
function toInvitaion (data: IGetReceivedInvitationsResponse): IInvitation[] {
  return data.data;
}
export async function getReceivedInvitationsApi() {
  return api.safeExec<IInvitation[]>(
    {
      method: "GET",
      url: "project/invitations/received",
    },
    toInvitaion,
  );
}