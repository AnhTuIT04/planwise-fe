export interface ITask {
  id: string;
  title: string;
  description: string | null;
  subTask: ITask[];
  priority: "LOW" | "MEDIUM" | "HIGH" | null;
  startDate: string | null;
  dueDate: string | null;
  createdAt: string | null;
  createdBy: string | null;
  status: "TODO" | "DONE";
  projectId: string | null;
  sectionId: string | null;
  assignees: string[] | null;
}