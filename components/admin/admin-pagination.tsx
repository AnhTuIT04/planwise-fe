"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { IOffsetPagination } from "@/types/admin.type";

export function AdminPagination({
  pagination,
  onPageChange,
}: {
  pagination: IOffsetPagination;
  onPageChange: (page: number) => void;
}) {
  const { page, limit, totalItems, totalPages } = pagination;
  if (totalItems === 0) return null;

  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, totalItems);

  return (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
      <p className="text-sm text-[#787878]">
        Showing {from}–{to} of {totalItems}
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="size-8 border-[#dcdcdc] bg-white text-[#413f39]"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft className="size-4" />
        </Button>
        <span className="text-sm text-[#57534e]">
          Page {page} of {totalPages}
        </span>
        <Button
          variant="outline"
          size="icon"
          className="size-8 border-[#dcdcdc] bg-white text-[#413f39]"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
