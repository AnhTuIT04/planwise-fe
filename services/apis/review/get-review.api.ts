import api from "@/lib/api";
import { IReviewPeriod, IReviewSummary } from "@/types/review.type";

interface IRequest {
  period: IReviewPeriod;
  date?: string;
}

interface IResponse {
  data: IReviewSummary;
  message: string;
}

export async function getMyReviewApi({ period, date }: IRequest): Promise<IReviewSummary> {
  const res = await api.get<IResponse>("reviews/me", {
    params: { period, ...(date ? { date } : {}) },
  });
  return res.data.data;
}
