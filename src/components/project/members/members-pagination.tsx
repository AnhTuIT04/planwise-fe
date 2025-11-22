"use client";

import { Button } from "@/components/ui/button";

interface MembersPaginationProps {
  currentPage: number;
  totalPages: number;
  startIndex: number;
  itemsPerPage: number;
  totalMembers: number;
  onPageChange: (page: number) => void;
}

export default function MembersPagination({
  currentPage,
  totalPages,
  startIndex,
  itemsPerPage,
  totalMembers,
  onPageChange,
}: MembersPaginationProps) {
  return (
    <div className="bg-card border-t px-6 py-3">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-sm">
          Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, totalMembers)} of{" "}
          {totalMembers} members
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(page)}
              className="min-w-9 bg-linear-to-r from-[#D60808] to-[#700404] transition-colors duration-500 hover:bg-linear-to-r hover:from-[#700404] hover:to-[#D60808]"
            >
              {page}
            </Button>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}