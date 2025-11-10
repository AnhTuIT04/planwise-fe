import { ITask } from "./task.type";
export interface ISection {
  id: string;
  name: string;
  projectId: string;
  listOfTask: string;
  tasks: ITask[];
}
