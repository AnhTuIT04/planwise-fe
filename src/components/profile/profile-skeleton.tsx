import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header Skeleton */}
        <div className="mb-8">
          <Skeleton className="mb-2 h-9 w-64" />
          <Skeleton className="h-5 w-96" />
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Profile Summary Card Skeleton */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar Skeleton */}
                <div className="flex flex-col items-center space-y-4">
                  <Skeleton className="h-24 w-24 rounded-full" />
                  <Skeleton className="h-8 w-32" />
                </div>

                {/* User Info Skeleton */}
                <div className="space-y-4">
                  <div className="space-y-2 text-center">
                    <Skeleton className="mx-auto h-6 w-40" />
                    <Skeleton className="mx-auto h-4 w-48" />
                  </div>

                  <div className="flex justify-center">
                    <Skeleton className="h-6 w-28" />
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <Skeleton className="mx-auto h-4 w-36" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Edit Form Skeleton */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-64" />
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Form Fields Skeleton */}
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-9 w-full" />
                </div>

                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-9 w-full" />
                  <Skeleton className="h-3 w-72" />
                </div>

                <div className="space-y-3">
                  <Skeleton className="h-4 w-24" />
                  <div className="rounded-lg bg-gray-50 p-3">
                    <Skeleton className="mb-1 h-4 w-32" />
                    <Skeleton className="h-3 w-56" />
                  </div>
                </div>

                {/* Save Button Skeleton */}
                <div className="flex justify-end border-t border-gray-200 pt-6">
                  <Skeleton className="h-9 w-32" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
