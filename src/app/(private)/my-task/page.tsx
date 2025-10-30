'use client';

import LeftSidebar from '@/components/sidebar/LeftSidebar';
import RightSidebar from '@/components/sidebar/RightSidebar';
import MainContent from '@/components/content/MainContent';

export default function Home() {
  return (
    // <div className="flex h-screen">
    //   <LeftSidebar />
    //   <MainContent />
    //   <RightSidebar />
    // </div>
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar - Cố định */}
      <div className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
        <LeftSidebar />
      </div>

      {/* Main Content - Cuộn được */}
      <div className="flex-1 overflow-y-auto">
        <MainContent />
      </div>

      {/* Right Sidebar - Cố định */}
      <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
        <RightSidebar />
      </div>
    </div>
  );
}