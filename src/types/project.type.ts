import { ISection } from "./section.type";
export interface IProject {
  id: string;
  name: string;
  isPersonal: boolean;
  sections: ISection[];
}