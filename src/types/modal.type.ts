import { ITask } from "@/types/task.type";
import { IProject } from "@/types/project.type";
import { IListSection } from "@/types/list-section.type";
import { IBasicUser } from "@/types/user.type";
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
}

interface IDeleteModalData extends IBaseModalData {
  subDescription?: React.ReactNode;
}

interface IAddMemberModalData extends IBaseModalData {
  project: IProject;
}

interface IAssignTaskModalData extends IBaseModalData {
  task: ITask;
  projectId: string;
  isPersonal: boolean;
  member: IBasicUser[];
  isSubtask?: boolean;
}
interface IAddUpdateProjectModalData extends IBaseModalData {
  action: "ADD" | "UPDATE";
  project?: IProject;
}
/* ---------------------------- END MODAL DATA REGISTRY ---------------------------- */

export interface IModalData {
  ADD_UPDATE_TASK: IAddUpdateTaskModalData;
  DELETE: IDeleteModalData;
  ADD_MEMBER: IAddMemberModalData;
  ASSIGN_TASK: IAssignTaskModalData;
  ADD_UPDATE_PROJECT: IAddUpdateProjectModalData;
  "": undefined;
}
