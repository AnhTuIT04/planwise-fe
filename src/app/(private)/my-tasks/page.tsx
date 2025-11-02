"use client";

import LeftSidebar from "@/components/sidebar/LeftSidebar";
import RightSidebar from "@/components/sidebar/RightSidebar";
import MainContent from "@/components/content/MainContent";

export default function Home() {
  return (
    <div className="flex h-screen">
      <LeftSidebar />
      <MainContent />
      <RightSidebar />
    </div>
    // <div className="flex h-screen bg-gray-50">
    //   {/* Left Sidebar - Cố định */}
    //   <div className="w-64 overflow-y-auto border-r border-gray-200 bg-white">
    //     <LeftSidebar />
    //   </div>

    //   {/* Main Content - Cuộn được */}
    //   <div className="flex-1 overflow-y-auto">
    //     <MainContent />
    //   </div>

    //   {/* Right Sidebar - Cố định */}
    //   <div className="w-80 overflow-y-auto border-l border-gray-200 bg-white">
    //     <RightSidebar />
    //   </div>
    // </div>
  );
}
