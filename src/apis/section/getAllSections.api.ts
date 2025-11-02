import api from "@/lib/api";
import { ISection } from "@/types/section.type";

interface IRequest {
  page: number;
  limit: number;
  status?: "DONE" | "IN_PROGRESS" | "TODO";
  search?: string;
}

interface IResponse {
  userId: string;
  id: string;
  title: string;
  body: string;
}

function toSessionList(data: IResponse[]): ISection[] {
  return data.map((item) => ({
    name: item.title,
    description: item.body,
    tasks: [],
  }));
}

export function getAllSectionsApi(params: IRequest) {
  return api.safeExec<ISection[]>(
    {
      method: "GET",
      url: "https://jsonplaceholder.typicode.com/posts",
      params,
    },
    toSessionList,
  );
}
