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
      <p className="text-xs text-[#9095a1]">
        {from}–{to} of {totalItems}
      </p>
      <div className="flex items-center gap-1.5">
        <Button
          variant="ghost"
          size="icon-sm"
          className="rounded-lg text-[#6b7280] hover:bg-black/5"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft className="size-4" />
        </Button>
        <span className="min-w-16 text-center text-xs font-medium text-[#16181d]">
          {page} / {totalPages}
        </span>
        <Button
          variant="ghost"
          size="icon-sm"
          className="rounded-lg text-[#6b7280] hover:bg-black/5"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
