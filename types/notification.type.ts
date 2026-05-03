export type INotificationType =
  | "TASK_ASSIGNED"
  | "TASK_UPDATED"
  | "TASK_DEADLINE_REMINDER"
  | "TASK_DEADLINE_MISSED"
  | "PROJECT_INVITATION"
  | "INVITATION_ACCEPTED"
  | "INVITATION_DECLINED"
  | "PROJECT_NEW_MEMBER";

export type INotificationCategory = "all" | "workspace" | "invitation";

export interface INotificationActor {
  id: string;
  fullname: string;
  avatarUrl: string | null;
}

export interface INotificationProject {
  id: string;
  name: string;
  description?: string | null;
  logoUrl?: string | null;
}

export interface INotificationTask {
  id: string;
  title: string;
  status: "TODO" | "RUNNING" | "DONE" | "ARCHIVED";
  priority: "LOW" | "NORMAL" | "HIGH" | "URGENT";
  deadline: string | null;
  sectionId: string;
}

export interface INotificationRole {
  id: string;
  name: string;
}

export interface INotification {
  id: string;
  type: INotificationType;
  isRead: boolean;
  payload: {
    task?: INotificationTask;
    project?: INotificationProject;
    actor?: INotificationActor | null;
    inviter?: INotificationActor;
    invitee?: INotificationActor;
    newMember?: INotificationActor;
    role?: INotificationRole;
    changes?: string[];
  };
  projectId: string | null;
  taskId: string | null;
  createdAt: string;
}
