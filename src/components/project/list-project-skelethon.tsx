"use client";

import { Card } from "@/components/ui/card";

type Props = {
  count?: number;
};

export default function ListProjectSkelethon({ count = 6 }: Props) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <Card
          key={i}
          className="flex w-full animate-pulse flex-col gap-4 rounded-2xl border bg-white p-4 shadow-sm sm:p-6"
        >
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 shrink-0 rounded-full bg-gray-200" />
            <div className="flex min-w-0 flex-col">
              <div className="mb-2 h-5 w-40 rounded bg-gray-200" />
              <div className="h-3 w-full max-w-[220px] rounded bg-gray-200" />
              <div className="mt-2 h-3 w-28 rounded bg-gray-200" />
            </div>
          </div>

          <div className="h-px bg-gray-100" />

          <div className="flex w-full flex-col gap-4 sm:flex-row sm:justify-between">
            <div className="flex w-full items-start gap-3 sm:w-1/2 sm:pr-4">
              <div className="h-5 w-5 rounded bg-gray-200" />
              <div className="flex min-w-0 flex-col text-sm">
                <div className="mb-1 h-4 w-32 rounded bg-gray-200" />
                <div className="h-3 w-44 rounded bg-gray-200" />
              </div>
            </div>

            <div className="flex w-full flex-col text-xs text-gray-600 sm:w-1/2">
              <div className="mb-2 flex flex-wrap gap-2">
                <div className="h-3 w-20 rounded bg-gray-200" />
                <div className="h-3 w-20 rounded bg-gray-200" />
                <div className="h-3 w-20 rounded bg-gray-200" />
              </div>
              <div className="mt-2 h-3 w-36 rounded bg-gray-200" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
