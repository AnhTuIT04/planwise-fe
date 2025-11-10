'use client';

import LeftSidebar from '@/components/sidebar/LeftSidebar';
import RightSidebar from '@/components/sidebar/RightSidebar';
import MainContent from '@/components/task-management/MainContent';

export default function Home() {
  return (
    <div className="flex h-screen">
      <LeftSidebar />
      <MainContent />
      <RightSidebar />
    </div>
  );
}