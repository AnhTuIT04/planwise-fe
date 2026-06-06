export interface IAdminAccount {
  id: string;
  email: string;
  fullname: string;
}

export interface IAdminUser {
  id: string;
  email: string;
  fullname: string;
  avatarUrl: string | null;
  verified: boolean;
  disabledAt: string | null;
  ownedProjectCount: number;
  membershipCount: number;
  createdAt: string;
}

export interface IAdminUserProject {
  id: string;
  name: string;
  logoUrl: string | null;
  isPersonal: boolean;
  roleName: string;
  isOwner: boolean;
}

export interface IAdminUserDetail extends IAdminUser {
  updatedAt: string;
  oauthProviders: string[];
  projects: IAdminUserProject[];
}

export interface IAdminProject {
  id: string;
  name: string;
  logoUrl: string | null;
  description: string | null;
  isPersonal: boolean;
  owner: {
    id: string;
    email: string;
    fullname: string;
    avatarUrl: string | null;
  };
  memberCount: number;
  sectionCount: number;
  taskCount: number;
  createdAt: string;
}

export interface IAdminProjectMember {
  user: {
    id: string;
    email: string;
    fullname: string;
    avatarUrl: string | null;
  };
  roleName: string;
  disabled: boolean;
}

export interface IAdminProjectDetail extends IAdminProject {
  channelCount: number;
  members: IAdminProjectMember[];
}

export interface IAdminStats {
  totals: {
    users: number;
    verifiedUsers: number;
    disabledUsers: number;
    projects: number;
    personalProjects: number;
    teamProjects: number;
  };
  growth: {
    newUsersThisWeek: number;
    newUsersLastWeek: number;
    newProjectsThisWeek: number;
    newProjectsLastWeek: number;
  };
  daily: {
    date: string;
    users: number;
    projects: number;
  }[];
  recentUsers: {
    id: string;
    email: string;
    fullname: string;
    avatarUrl: string | null;
    createdAt: string;
  }[];
  recentProjects: {
    id: string;
    name: string;
    logoUrl: string | null;
    isPersonal: boolean;
    ownerName: string;
    createdAt: string;
  }[];
}

export interface IOffsetPagination {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}
