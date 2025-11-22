import { ITask } from "@/types/task.type";
import { IProject } from "@/types/project.type";

interface IBaseModalData {
  title?: React.ReactNode;
  description?: React.ReactNode;
}

/* --------------------------- BEGIN MODAL DATA REGISTRY --------------------------- */

interface IAddUpdateTaskModalData extends IBaseModalData {
  action: "ADD" | "UPDATE";
  sectionId: string;
  sectionName: string;
  task?: ITask;
}

interface IDeleteModalData extends IBaseModalData {
  subDescription?: React.ReactNode;
}

interface IAddMemberModalData extends IBaseModalData {
  project: IProject;
}

/* ---------------------------- END MODAL DATA REGISTRY ---------------------------- */

export interface IModalData {
  ADD_UPDATE_TASK: IAddUpdateTaskModalData;
  DELETE: IDeleteModalData;
  ADD_MEMBER: IAddMemberModalData;

  "": undefined;
}
