import api from "@/lib/api";
import { ISection } from "@/types/section.type";

interface IRequest {
  name: string;
  projectId: string;
  listOfTask?: string;
}

interface IResponse {
  section: {
    id: string;
    name: string;
    projectId: string;
    listOfTask: string | null;
    createdAt: string;
    updatedAt: string;
  };
}

function toSection(data: IResponse): ISection {
  return {
    name: data.section.name,
    description: "I don't know",
    tasks: [],
  };
}

export function createSectionApi(payload: IRequest) {
  return api.safeExec<ISection>(
    {
      method: "POST",
      url: "section",
      data: payload,
    },
    toSection,
  );
}
