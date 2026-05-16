"use client";

import LeftSidebar from "@/components/sidebar/left";
import RightSidebar from "@/components/sidebar/right";
import PendingTaskOpener from "@/components/task/pending-task-opener";

export default function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-[#ecedee]">
      <LeftSidebar />
      {children}
      <RightSidebar />
      <PendingTaskOpener />
    </div>
  );
}
