import { ITask } from "./task.type";

export interface ISection {
  id: string;
  name: string;
  tasks: ITask[];
  createdAt: string;
}
