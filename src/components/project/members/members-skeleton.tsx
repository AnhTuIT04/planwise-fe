import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function MembersSkeleton() {
  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-background">
      {/* Header Skeleton */}
      <div className="border-b bg-card px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-9 w-32" />
        </div>
      </div>

      {/* Search Bar Skeleton */}
      <div className="border-b bg-card px-6 py-3">
        <Skeleton className="h-9 w-full" />
      </div>

      {/* Table Skeleton */}
      <div className="flex-1 overflow-auto m-3 rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Member</TableHead>
              <TableHead>
                <div className="flex items-center gap-1">Role</div>
              </TableHead>
              <TableHead>Joined Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 8 }).map((_, i) => (
              <TableRow key={i}>
                {/* Member cell */}
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Skeleton className="size-10 rounded-full" />
                    <div className="flex flex-col gap-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-48" />
                    </div>
                  </div>
                </TableCell>
                {/* Role cell */}
                <TableCell>
                  <Skeleton className="h-9 w-[180px]" />
                </TableCell>
                {/* Joined Date cell */}
                <TableCell>
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                {/* Status cell */}
                <TableCell>
                  <Skeleton className="h-6 w-16" />
                </TableCell>
                {/* Actions cell */}
                <TableCell>
                  <div className="flex items-center justify-end gap-2">
                    <Skeleton className="size-8" />
                    <Skeleton className="size-8" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Skeleton */}
      <div className="border-t bg-card px-6 py-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-48" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-9" />
            <Skeleton className="h-8 w-9" />
            <Skeleton className="h-8 w-16" />
          </div>
        </div>
      </div>
    </div>
  );
}
