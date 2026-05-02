import { useQuery } from "@tanstack/react-query";

import { getMyReviewApi } from "@/services/apis/review/get-review.api";
import { IReviewPeriod, IReviewSummary } from "@/types/review.type";

export function useReview(userId: string | undefined, period: IReviewPeriod, anchor: string) {
  return useQuery<IReviewSummary>({
    queryKey: ["review", userId, period, anchor],
    queryFn: () => getMyReviewApi({ period, date: anchor }),
    enabled: !!userId,
  });
}
