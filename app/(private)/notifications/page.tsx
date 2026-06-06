"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { NotificationItem } from "@/components/notification/notification-item";
import { useNotificationMutations, useNotifications } from "@/hooks/use-notifications";
import { INotificationCategory } from "@/types/notification.type";

const TABS: { value: INotificationCategory; label: string }[] = [
  { value: "all", label: "All" },
  { value: "workspace", label: "Workspace" },
  { value: "invitation", label: "Invitations" },
];

export default function NotificationPage() {
  const [category, setCategory] = useState<INotificationCategory>("all");
  const { items, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } = useNotifications(category);
  const { markAllRead } = useNotificationMutations();
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const hasUnread = items.some((n) => !n.isRead);

  return (
    <main className="my-1 ml-1 flex min-h-0 flex-1 flex-col overflow-hidden rounded-l-[6px] border-y border-l border-[#dcdcdc] bg-[#f8f8f9] shadow-sm">
      <div className="mx-auto flex h-full w-full max-w-3xl flex-col gap-4 overflow-hidden px-6 py-6">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Notifications</h1>
          <Button
            variant="ghost"
            size="sm"
            disabled={!hasUnread || markAllRead.isPending}
            onClick={() => markAllRead.mutate()}
          >
            Mark all as read
          </Button>
        </header>

        <nav className="flex gap-1 border-b border-gray-200">
          {TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setCategory(tab.value)}
              className={cn(
                "border-b-2 px-4 py-2 text-sm font-medium transition",
                category === tab.value
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700",
              )}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <section className="flex flex-1 flex-col gap-2 overflow-y-auto pr-1">
          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, idx) => (
                <Skeleton key={idx} className="h-20 w-full rounded-lg" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <p className="py-12 text-center text-sm text-gray-500">No notifications yet.</p>
          ) : (
            <>
              {items.map((notification) => (
                <NotificationItem key={notification.id} notification={notification} />
              ))}
              <div ref={sentinelRef} className="h-1" />
              {isFetchingNextPage ? (
                <p className="py-3 text-center text-xs text-gray-400">Loading more…</p>
              ) : !hasNextPage && items.length > 0 ? (
                <p className="py-3 text-center text-xs text-gray-400">You&apos;re all caught up.</p>
              ) : null}
            </>
          )}
        </section>
      </div>
    </main>
  );
}
