import { ITask } from "@/types/task.type";
import { IProject } from "@/types/project.type";
import { IListSection } from "@/types/list-section.type";
import { IBasicUser, IUserInProject } from "@/types/user.type";
import { IRole } from "@/types/role.type";
import { CreateEventRequest } from "./event.type";
interface IBaseModalData {
  title?: React.ReactNode;
  description?: React.ReactNode;
}

/* --------------------------- BEGIN MODAL DATA REGISTRY --------------------------- */

interface IAddUpdateTaskModalData extends IBaseModalData {
  action: "ADD" | "UPDATE";
  sectionId: string;
  sectionName: string;
  projectId: string;
  isPersonal: boolean;
  listSections: IListSection[];
  listSectionsPersonal: IListSection[];
  task?: ITask;
  member: IBasicUser[];
  isNotionMode?: boolean;
  notionDatabaseId?: string;
  onCreateNotion?: (payload: { title: string, description?: string, deadline?: string, status: string }) => Promise<void>;
}

interface IDeleteModalData extends IBaseModalData {
  subDescription?: React.ReactNode;
}

interface IAddMemberModalData extends IBaseModalData {
  project: IProject;
}

interface IEditMemberModalData extends IBaseModalData {
  member: IUserInProject;
  projectId: string;
  roles: IRole[];
}

interface IConfirmModalData extends IBaseModalData {
  confirmText?: string;
  cancelText?: string;
}

interface IAssignTaskModalData extends IBaseModalData {
  task: ITask;
  previousTask: ITask;
  projectId: string;
  isPersonal: boolean;
  member: IBasicUser[];
  isSubtask?: boolean;
}
interface IAddUpdateProjectModalData extends IBaseModalData {
  action: "ADD" | "UPDATE";
  project?: IProject;
}

interface ICreateUpdateEventModalData {
  action: "CREATE" | "UPDATE";
  externalEventId?: string;
  event: CreateEventRequest;
}

interface INotionSectionPickerModalData extends IBaseModalData {
  notionPageId: string;
  notionPageTitle?: string;
  projectId: string;
  sections: { id: string; name: string }[];
  onPick: (sectionId: string) => Promise<void> | void;
}

/* ---------------------------- END MODAL DATA REGISTRY ---------------------------- */

export interface IModalData {
  ADD_UPDATE_TASK: IAddUpdateTaskModalData;
  DELETE: IDeleteModalData;
  ADD_MEMBER: IAddMemberModalData;
  EDIT_MEMBER: IEditMemberModalData;
  CONFIRM: IConfirmModalData;
  ASSIGN_TASK: IAssignTaskModalData;
  ADD_UPDATE_PROJECT: IAddUpdateProjectModalData;
  CREATE_UPDATE_EVENT: ICreateUpdateEventModalData;
  NOTION_SECTION_PICKER: INotionSectionPickerModalData;
  "": undefined;
}
