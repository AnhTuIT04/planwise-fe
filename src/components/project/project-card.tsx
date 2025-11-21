"use client";

import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";
import { useRouter } from "next/navigation";

type ProjectCardProps = {
  id: string;
  projectName?: string;
  description: string | null;
  logoUrl: string | null;
  ownerName: string;
  ownerEmail: string;
  ownerAvatar: string | null;
  members: number;
  sections: number;
  tasks: number;
  todo: number;
  createdAt: string;
  className?: string;
};

export default function ProjectCard({
  id,
  projectName,
  description,
  logoUrl,
  ownerName,
  ownerEmail,
  ownerAvatar,
  members,
  sections,
  tasks,
  todo,
  createdAt,
  className,
}: ProjectCardProps) {
  const router = useRouter();
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };
  return (
    <Card
      className={`${className ?? "w-full"} flex origin-center transform-gpu flex-col gap-4 rounded-2xl border bg-white p-4 shadow-sm transition-transform duration-150 ease-in-out will-change-transform hover:z-10 hover:scale-105 hover:cursor-pointer sm:p-6`}
      onClick={() => router.push(`/projects/${id}/overview`)}
    >
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full text-2xl">
          <img src={logoUrl ?? "https://cdn-icons-png.flaticon.com/512/9584/9584876.png"} alt="Project avatar" />
        </div>
        <div className="flex min-w-0 flex-col">
          <h2 className="truncate text-lg font-semibold sm:text-xl" title={projectName}>
            {projectName}
          </h2>
          <p className="truncate text-sm leading-tight text-gray-500" title={description!}>
            {description}
          </p>
          <p className="mt-1 text-[11px] text-gray-400">Started at {createdAt.slice(0, 10)}</p>
        </div>
      </div>

      <div className="h-px bg-gray-200" />

      {/* Body: stack on small screens, split on sm+ */}
      <div className="flex w-full flex-col gap-4 sm:flex-row sm:justify-between">
        <div className="flex w-full min-w-0 items-start gap-3 sm:w-1/2 sm:pr-4">
          <Avatar className="size-10">
            <AvatarImage src={ownerAvatar || undefined} />
            <AvatarFallback className="bg-primary/10 text-primary">{getInitials(ownerName)}</AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-col text-sm">
            <p className="truncate font-medium">{ownerName}</p>
            <p className="truncate text-xs text-gray-500">{ownerEmail}</p>
          </div>
        </div>

        {/* Info */}
        <div className="flex w-full flex-col text-xs text-gray-600 sm:w-1/2">
          <p>{members} members</p>
          <p>{sections} sections</p>
          <p>{tasks} tasks</p>
          <p className="mt-2 text-[11px] text-green-700">
            You have <span className="font-medium">{todo}</span> tasks to do
          </p>
        </div>
      </div>
    </Card>
  );
}
