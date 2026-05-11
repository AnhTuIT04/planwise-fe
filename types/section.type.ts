import { ITask } from "./task.type";

export interface IBasicSection {
  id: string;
  name: string;
  taskCount: number;
  createdAt: string;
}

export interface ISection extends IBasicSection {
  tasks: ITask[];
}
