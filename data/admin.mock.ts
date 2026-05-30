export type AdminUserStatus = "Verified" | "Not verified" | "Suspended";
export type ProjectHealth = "On track" | "At risk" | "Needs review";
export type SectionState = "Open" | "In progress" | "Done";
export type TaskState = "Todo" | "Doing" | "Done";
export type ChannelType = "Discussion" | "Announcement" | "Support";

export type AdminUser = {
  id: string;
  avatarUrl: string;
  name: string;
  email: string;
  status: AdminUserStatus;
  projects: number;
  lastActive: string;
};

export type AdminProject = {
  id: string;
  name: string;
  logoUrl: string;
  owner: string;
  status: ProjectHealth;
  progress: number;
  members: number;
  sections: number;
  tasks: number;
  channels: number;
  updatedAt: string;
  description: string;
};

export type AdminSection = {
  id: string;
  projectId: string;
  name: string;
  state: SectionState;
  taskCount: number;
  completedCount: number;
};

export type AdminTask = {
  id: string;
  projectId: string;
  section: string;
  title: string;
  assignee: string;
  priority: "Low" | "Normal" | "High" | "Urgent";
  status: TaskState;
  due: string;
};

export type AdminMember = {
  id: string;
  avatarUrl: string;
  name: string;
  projectId: string;
  role: string;
  workload: string;
  presence: string;
};

export type AdminRole = {
  id: string;
  name: string;
  scope: string;
  members: number;
  permissions: string[];
};

export type AdminChannel = {
  id: string;
  projectId: string;
  name: string;
  type: ChannelType;
  members: number;
  unread: number;
  lastMessage: string;
};

export type AdminProjectDetail = AdminProject & {
  sectionsDetail: AdminSection[];
  tasksDetail: AdminTask[];
  membersDetail: AdminMember[];
  rolesDetail: AdminRole[];
  channelsDetail: AdminChannel[];
};

export type AdminActivity = {
  id: string;
  title: string;
  detail: string;
  timestamp: string;
  tone: "emerald" | "sky" | "amber" | "rose";
};

export const adminOverview = {
  users: 248,
  activeProjects: 18,
  openTasks: 96,
  projectSections: 42,
  projectMembers: 126,
  projectRoles: 14,
  projectChannels: 31,
};

export const adminUsers: AdminUser[] = [
  {
    id: "USR-1001",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80",
    name: "Hana Kim",
    email: "hana@planwise.app",
    status: "Verified",
    projects: 6,
    lastActive: "2 minutes ago",
  },
  {
    id: "USR-1002",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80",
    name: "Diego Rivera",
    email: "diego@planwise.app",
    status: "Verified",
    projects: 5,
    lastActive: "11 minutes ago",
  },
  {
    id: "USR-1003",
    avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=160&q=80",
    name: "Maya Chen",
    email: "maya@planwise.app",
    status: "Verified",
    projects: 4,
    lastActive: "1 hour ago",
  },
  {
    id: "USR-1004",
    avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=160&q=80",
    name: "Noah Ellis",
    email: "noah@planwise.app",
    status: "Not verified",
    projects: 2,
    lastActive: "Pending invite",
  },
  {
    id: "USR-1005",
    avatarUrl: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=160&q=80",
    name: "Avery Patel",
    email: "avery@planwise.app",
    status: "Suspended",
    projects: 1,
    lastActive: "3 days ago",
  },
  {
    id: "USR-1006",
    avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=160&q=80",
    name: "Sofia Alvarez",
    email: "sofia@planwise.app",
    status: "Verified",
    projects: 7,
    lastActive: "Yesterday",
  },
];

export const adminProjects: AdminProject[] = [
  {
    id: "PRJ-2001",
    name: "Atlas Launch",
    logoUrl: "/logo.svg",
    owner: "Hana Kim",
    status: "On track",
    progress: 86,
    members: 16,
    sections: 8,
    tasks: 42,
    channels: 5,
    updatedAt: "Today, 08:25",
    description: "A flagship rollout for onboarding, release coordination, and launch readiness.",
  },
  {
    id: "PRJ-2002",
    name: "Nimbus Mobile",
    logoUrl: "/logo.svg",
    owner: "Diego Rivera",
    status: "At risk",
    progress: 62,
    members: 12,
    sections: 6,
    tasks: 31,
    channels: 4,
    updatedAt: "Today, 09:10",
    description: "A mobile delivery stream focused on stability, UX polish, and release health.",
  },
  {
    id: "PRJ-2003",
    name: "Orion CRM",
    logoUrl: "/logo.svg",
    owner: "Maya Chen",
    status: "Needs review",
    progress: 48,
    members: 10,
    sections: 5,
    tasks: 22,
    channels: 3,
    updatedAt: "Yesterday, 17:40",
    description: "A CRM rebuild centered on data model decisions and operational workflow cleanup.",
  },
  {
    id: "PRJ-2004",
    name: "Studio OS",
    logoUrl: "/logo.svg",
    owner: "Sofia Alvarez",
    status: "On track",
    progress: 74,
    members: 14,
    sections: 7,
    tasks: 35,
    channels: 6,
    updatedAt: "Yesterday, 11:15",
    description: "An internal platform expansion covering integrations, support, and delivery planning.",
  },
];

export const adminSections: AdminSection[] = [
  { id: "SEC-3001", projectId: "PRJ-2001", name: "Planning", state: "Done", taskCount: 6, completedCount: 6 },
  { id: "SEC-3002", projectId: "PRJ-2001", name: "Release", state: "In progress", taskCount: 8, completedCount: 5 },
  { id: "SEC-3003", projectId: "PRJ-2002", name: "Design", state: "In progress", taskCount: 7, completedCount: 4 },
  { id: "SEC-3004", projectId: "PRJ-2002", name: "Testing", state: "Open", taskCount: 5, completedCount: 1 },
  { id: "SEC-3005", projectId: "PRJ-2003", name: "Data model", state: "Done", taskCount: 4, completedCount: 4 },
  {
    id: "SEC-3006",
    projectId: "PRJ-2004",
    name: "Integrations",
    state: "In progress",
    taskCount: 9,
    completedCount: 6,
  },
];

export const adminTasks: AdminTask[] = [
  {
    id: "TSK-4001",
    projectId: "PRJ-2001",
    section: "Release",
    title: "Freeze release notes",
    assignee: "Hana Kim",
    priority: "High",
    status: "Doing",
    due: "May 30",
  },
  {
    id: "TSK-4002",
    projectId: "PRJ-2001",
    section: "Release",
    title: "Approve rollout checklist",
    assignee: "Maya Chen",
    priority: "Normal",
    status: "Todo",
    due: "Jun 01",
  },
  {
    id: "TSK-4003",
    projectId: "PRJ-2002",
    section: "Design",
    title: "Finalize onboarding screens",
    assignee: "Sofia Alvarez",
    priority: "Urgent",
    status: "Doing",
    due: "May 29",
  },
  {
    id: "TSK-4004",
    projectId: "PRJ-2002",
    section: "Testing",
    title: "Regression pass on beta build",
    assignee: "Avery Patel",
    priority: "High",
    status: "Todo",
    due: "Jun 02",
  },
  {
    id: "TSK-4005",
    projectId: "PRJ-2003",
    section: "Data model",
    title: "Document schema changes",
    assignee: "Diego Rivera",
    priority: "Normal",
    status: "Done",
    due: "May 27",
  },
  {
    id: "TSK-4006",
    projectId: "PRJ-2004",
    section: "Integrations",
    title: "Review API limits",
    assignee: "Noah Ellis",
    priority: "Low",
    status: "Doing",
    due: "Jun 03",
  },
];

export const adminMembers: AdminMember[] = [
  {
    id: "MBR-5001",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80",
    name: "Hana Kim",
    projectId: "PRJ-2001",
    role: "Owner",
    workload: "68%",
    presence: "Online",
  },
  {
    id: "MBR-5002",
    avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=160&q=80",
    name: "Maya Chen",
    projectId: "PRJ-2001",
    role: "Manager",
    workload: "52%",
    presence: "In meeting",
  },
  {
    id: "MBR-5003",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80",
    name: "Diego Rivera",
    projectId: "PRJ-2002",
    role: "Admin",
    workload: "74%",
    presence: "Online",
  },
  {
    id: "MBR-5004",
    avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=160&q=80",
    name: "Sofia Alvarez",
    projectId: "PRJ-2004",
    role: "Admin",
    workload: "61%",
    presence: "Offline",
  },
  {
    id: "MBR-5005",
    avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=160&q=80",
    name: "Noah Ellis",
    projectId: "PRJ-2004",
    role: "Member",
    workload: "45%",
    presence: "Online",
  },
  {
    id: "MBR-5006",
    avatarUrl: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=160&q=80",
    name: "Avery Patel",
    projectId: "PRJ-2003",
    role: "Member",
    workload: "33%",
    presence: "Away",
  },
];

export const adminRoles: AdminRole[] = [
  {
    id: "RLE-6001",
    name: "Owner",
    scope: "Workspace-wide",
    members: 8,
    permissions: ["Manage billing", "Edit roles", "Remove members", "Archive projects"],
  },
  {
    id: "RLE-6002",
    name: "Admin",
    scope: "Project administration",
    members: 19,
    permissions: ["Create projects", "Manage members", "Edit channels", "Move tasks"],
  },
  {
    id: "RLE-6003",
    name: "Manager",
    scope: "Delivery control",
    members: 36,
    permissions: ["Manage sections", "Assign tasks", "Review activity"],
  },
  {
    id: "RLE-6004",
    name: "Member",
    scope: "Standard access",
    members: 141,
    permissions: ["Update tasks", "Join channels", "Comment"],
  },
];

export const adminChannels: AdminChannel[] = [
  {
    id: "CHN-7001",
    projectId: "PRJ-2001",
    name: "release-room",
    type: "Discussion",
    members: 16,
    unread: 4,
    lastMessage: "Waiting on release checklist approval.",
  },
  {
    id: "CHN-7002",
    projectId: "PRJ-2001",
    name: "launch-announcements",
    type: "Announcement",
    members: 18,
    unread: 0,
    lastMessage: "Timeline updated for the rollout window.",
  },
  {
    id: "CHN-7003",
    projectId: "PRJ-2002",
    name: "qa-support",
    type: "Support",
    members: 10,
    unread: 6,
    lastMessage: "Crash reports collected from beta testers.",
  },
  {
    id: "CHN-7004",
    projectId: "PRJ-2003",
    name: "crm-planning",
    type: "Discussion",
    members: 9,
    unread: 2,
    lastMessage: "Need a decision on the schema migration.",
  },
  {
    id: "CHN-7005",
    projectId: "PRJ-2004",
    name: "integration-watch",
    type: "Support",
    members: 13,
    unread: 1,
    lastMessage: "API rate limit review scheduled for tomorrow.",
  },
];

export const adminProjectDetails: AdminProjectDetail[] = [
  {
    ...adminProjects[0],
    sectionsDetail: adminSections.filter((section) => section.projectId === "PRJ-2001"),
    tasksDetail: adminTasks.filter((task) => task.projectId === "PRJ-2001"),
    membersDetail: adminMembers.filter((member) => member.projectId === "PRJ-2001"),
    rolesDetail: [
      {
        id: "RLE-6001",
        name: "Owner",
        scope: "Workspace-wide",
        members: 2,
        permissions: ["Manage billing", "Edit roles", "Remove members", "Archive projects"],
      },
      {
        id: "RLE-6002",
        name: "Admin",
        scope: "Project administration",
        members: 5,
        permissions: ["Create projects", "Manage members", "Edit channels", "Move tasks"],
      },
      {
        id: "RLE-6004",
        name: "Member",
        scope: "Standard access",
        members: 9,
        permissions: ["Update tasks", "Join channels", "Comment"],
      },
    ],
    channelsDetail: adminChannels.filter((channel) => channel.projectId === "PRJ-2001"),
  },
  {
    ...adminProjects[1],
    sectionsDetail: adminSections.filter((section) => section.projectId === "PRJ-2002"),
    tasksDetail: adminTasks.filter((task) => task.projectId === "PRJ-2002"),
    membersDetail: adminMembers.filter((member) => member.projectId === "PRJ-2002"),
    rolesDetail: [
      {
        id: "RLE-6101",
        name: "Admin",
        scope: "Project administration",
        members: 4,
        permissions: ["Create projects", "Manage members", "Edit channels", "Move tasks"],
      },
      {
        id: "RLE-6102",
        name: "Member",
        scope: "Standard access",
        members: 8,
        permissions: ["Update tasks", "Join channels", "Comment"],
      },
    ],
    channelsDetail: adminChannels.filter((channel) => channel.projectId === "PRJ-2002"),
  },
  {
    ...adminProjects[2],
    sectionsDetail: adminSections.filter((section) => section.projectId === "PRJ-2003"),
    tasksDetail: adminTasks.filter((task) => task.projectId === "PRJ-2003"),
    membersDetail: adminMembers.filter((member) => member.projectId === "PRJ-2003"),
    rolesDetail: [
      {
        id: "RLE-6201",
        name: "Manager",
        scope: "Delivery control",
        members: 3,
        permissions: ["Manage sections", "Assign tasks", "Review activity"],
      },
      {
        id: "RLE-6202",
        name: "Member",
        scope: "Standard access",
        members: 7,
        permissions: ["Update tasks", "Join channels", "Comment"],
      },
    ],
    channelsDetail: adminChannels.filter((channel) => channel.projectId === "PRJ-2003"),
  },
  {
    ...adminProjects[3],
    sectionsDetail: adminSections.filter((section) => section.projectId === "PRJ-2004"),
    tasksDetail: adminTasks.filter((task) => task.projectId === "PRJ-2004"),
    membersDetail: adminMembers.filter((member) => member.projectId === "PRJ-2004"),
    rolesDetail: [
      {
        id: "RLE-6301",
        name: "Admin",
        scope: "Project administration",
        members: 4,
        permissions: ["Create projects", "Manage members", "Edit channels", "Move tasks"],
      },
      {
        id: "RLE-6302",
        name: "Member",
        scope: "Standard access",
        members: 10,
        permissions: ["Update tasks", "Join channels", "Comment"],
      },
    ],
    channelsDetail: adminChannels.filter((channel) => channel.projectId === "PRJ-2004"),
  },
];

export const adminActivity: AdminActivity[] = [
  {
    id: "ACT-8001",
    title: "Role updated",
    detail: "Maya Chen was promoted to Manager on Atlas Launch.",
    timestamp: "8 minutes ago",
    tone: "emerald",
  },
  {
    id: "ACT-8002",
    title: "Project flagged",
    detail: "Nimbus Mobile moved to At risk after a QA delay.",
    timestamp: "24 minutes ago",
    tone: "amber",
  },
  {
    id: "ACT-8003",
    title: "Task completed",
    detail: "Schema documentation was marked done in Orion CRM.",
    timestamp: "52 minutes ago",
    tone: "sky",
  },
  {
    id: "ACT-8004",
    title: "Channel created",
    detail: "A support channel was added for Studio OS integrations.",
    timestamp: "1 hour ago",
    tone: "rose",
  },
];
