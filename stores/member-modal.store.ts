import { create } from "zustand";
import { IProject } from "@/types/project.type";
import { IRole } from "@/types/role.type";
import { IBasicUser } from "@/types/user.type";

type MemberStoreState = {
  mode: "add" | "update";
  open: boolean;
  setOpen: (open: boolean) => void;

  project?: IProject;
  member?: any; // To support whatever member type EditMemberModal uses
  projectId?: string;
  roles?: IRole[];

  openModal: (state: {
    mode: "add" | "update";
    project?: IProject;
    member?: any;
    projectId?: string;
    roles?: IRole[];
  }) => void;
  closeModal: () => void;
  setField: (field: string, value: any) => void;
};

export const useMemberModalStore = create<MemberStoreState>()((set) => ({
  mode: "add",
  open: false,
  setOpen: (open) => set(() => ({ open })),

  project: undefined,
  member: {},
  projectId: undefined,
  roles: undefined,

  openModal: ({ mode, project, member, projectId, roles }) =>
    set(() => ({
      mode,
      open: true,
      project,
      member: member || {},
      projectId,
      roles,
    })),
  closeModal: () =>
    set(() => ({ open: false, project: undefined, member: {}, projectId: undefined, roles: undefined })),
  setField: (field, value) => 
    set((prev) => ({ 
      member: { ...(prev.member || {}), [field]: value } 
    })),
}));
