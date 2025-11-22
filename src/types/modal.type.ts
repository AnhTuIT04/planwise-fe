import { ITask } from "@/types/task.type";

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
  task?: ITask;
}

interface IDeleteModalData extends IBaseModalData {
  subDescription?: React.ReactNode;
}

/* ---------------------------- END MODAL DATA REGISTRY ---------------------------- */

export interface IModalData {
  ADD_UPDATE_TASK: IAddUpdateTaskModalData;
  DELETE: IDeleteModalData;

  "": undefined;
}
