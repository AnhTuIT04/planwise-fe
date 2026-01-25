import { INotification } from "@/types/notification.type";

export const mockNotifications: INotification[] = [
  {
    id: "1",
    type: "TASK_OVERDUE",
    title: "Task Overdue: Website Redesign Review",
    message: "This task was due today and requires immediate attention",
    isRead: false,
    createdAt: "2025-11-21T17:00:00Z",
    task: {
      id: "task-1",
      title: "Website Redesign Review",
      deadline: "2025-11-21T17:00:00Z",
    },
    project: {
      id: "proj-1",
      name: "Marketing Website",
    },
  },
  {
    id: "2",
    type: "PROJECT_INVITATION",
    title: "Invitation Expiring: Mobile App Project",
    message: "Your invitation to join this project expires today",
    isRead: false,
    createdAt: "2025-11-21T11:59:00Z",
    user: {
      id: "user-1",
      email: "sarah.chen@example.com",
      fullname: "Sarah Chen",
      avatarUrl: null,
    },
    project: {
      id: "proj-2",
      name: "Mobile App Project",
    },
    metadata: {
      role: "Frontend Developer",
      invitationId: "inv-1",
    },
  },
  {
    id: "3",
    type: "PROJECT_INVITATION",
    title: 'Mike Johnson invited you to join "E-commerce Platform"',
    message:
      "You've been invited as a Frontend Developer to work on the new e-commerce platform project.",
    isRead: false,
    createdAt: "2025-11-19T10:00:00Z",
    user: {
      id: "user-2",
      email: "mike.johnson@example.com",
      fullname: "Mike Johnson",
      avatarUrl: null,
    },
    project: {
      id: "proj-3",
      name: "E-commerce Platform",
    },
    metadata: {
      role: "Frontend Developer",
      invitationId: "inv-2",
    },
  },
  {
    id: "4",
    type: "PROJECT_INVITATION",
    title: 'Emma Wilson invited you to join "Data Analytics Dashboard"',
    message:
      "Join the team to build an advanced analytics dashboard for client reporting.",
    isRead: false,
    createdAt: "2025-11-18T14:30:00Z",
    user: {
      id: "user-3",
      email: "emma.wilson@example.com",
      fullname: "Emma Wilson",
      avatarUrl: null,
    },
    project: {
      id: "proj-4",
      name: "Data Analytics Dashboard",
    },
    metadata: {
      role: "Full Stack Developer",
      invitationId: "inv-3",
    },
  },
  {
    id: "5",
    type: "PROJECT_UPDATE",
    title: 'Alex Rodriguez joined "Mobile App Redesign"',
    message:
      "Alex has accepted the invitation and is now part of the Mobile App Redesign team as a UX Designer.",
    isRead: false,
    createdAt: "2025-11-20T09:15:00Z",
    user: {
      id: "user-4",
      email: "alex.rodriguez@example.com",
      fullname: "Alex Rodriguez",
      avatarUrl: null,
    },
    project: {
      id: "proj-5",
      name: "Mobile App Redesign",
    },
    metadata: {
      action: "joined",
      role: "UX Designer",
    },
  },
  {
    id: "6",
    type: "PROJECT_UPDATE",
    title: 'Jessica Park declined "Cloud Migration Project"',
    message:
      "Jessica has declined the invitation to join the Cloud Migration Project. You may want to find another team member.",
    isRead: false,
    createdAt: "2025-11-19T16:45:00Z",
    user: {
      id: "user-5",
      email: "jessica.park@example.com",
      fullname: "Jessica Park",
      avatarUrl: null,
    },
    project: {
      id: "proj-6",
      name: "Cloud Migration Project",
    },
    metadata: {
      action: "declined",
    },
  },
];