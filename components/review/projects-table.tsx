"use client";

import { use, useState } from "react";
import Link from "next/link";
import { ChevronRight, FolderKanban } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn, formatTimeLabel } from "@/lib/utils";
import { IReviewProject } from "@/types/review.type";
import { useAuth } from "../providers/auth-provider";

const COLLAPSED_LIMIT = 5;

const AVATAR_PALETTE = [
  { bg: "bg-indigo-100", text: "text-indigo-600" },
  { bg: "bg-emerald-100", text: "text-emerald-600" },
  { bg: "bg-amber-100", text: "text-amber-600" },
  { bg: "bg-rose-100", text: "text-rose-600" },
  { bg: "bg-sky-100", text: "text-sky-600" },
  { bg: "bg-violet-100", text: "text-violet-600" },
];

function paletteFor(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return AVATAR_PALETTE[h % AVATAR_PALETTE.length];
}

function progressTone(rate: number): string {
  if (rate >= 0.75) return "bg-emerald-500";
  if (rate >= 0.4) return "bg-indigo-500";
  return "bg-amber-500";
}

export default function ProjectsTable({ projects }: { projects: IReviewProject[] }) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? projects : projects.slice(0, COLLAPSED_LIMIT);
  const hasMore = projects.length > COLLAPSED_LIMIT;

  const { user } = useAuth();

  return (
    <Card size="sm" className="min-w-0">
      <CardHeader>
        <CardTitle>Projects</CardTitle>
        <CardDescription>Your performance per project this period</CardDescription>
      </CardHeader>
      <CardContent>
        {projects.length === 0 ? (
          <div className="py-8 text-center text-sm text-muted-foreground">No project activity in this period</div>
        ) : (
          <ul className="-mx-3 divide-y divide-[#ececec]">
            {visible.map((project) => (
              <li key={project.id}>
                <Link
                  href={`${user?.workspaceId === project.id ? `/my-tasks` : `/projects/${project.id}`}`}
                  className="group/row flex items-center gap-3 rounded-md px-3 py-2.5 transition hover:bg-[#f1f1f3]"
                >
                  {(() => {
                    const palette = paletteFor(project.id);
                    return (
                      <div
                        className={cn(
                          "flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-lg",
                          !project.logoUrl && palette.bg,
                          !project.logoUrl && palette.text,
                        )}
                      >
                        {project.logoUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={project.logoUrl} alt="" className="size-full object-cover" />
                        ) : (
                          <FolderKanban className="size-4" />
                        )}
                      </div>
                    );
                  })()}

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-semibold">{project.name}</p>
                      <span className="text-xs font-semibold tabular-nums">
                        {Math.round(project.completionRate * 100)}%
                      </span>
                    </div>
                    <div className="mt-1 flex items-center gap-3 text-[11px] text-muted-foreground">
                      <span>
                        {project.completed}/{project.total} tasks
                      </span>
                      <span>·</span>
                      <span>{project.timeSpentMs > 0 ? formatTimeLabel(project.timeSpentMs) : "0s"} spent</span>
                    </div>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={cn("h-full rounded-full transition-all", progressTone(project.completionRate))}
                        style={{ width: `${Math.min(100, Math.round(project.completionRate * 100))}%` }}
                      />
                    </div>
                  </div>

                  <ChevronRight className="size-4 shrink-0 text-[#a8a8a8] transition group-hover/row:text-indigo-500" />
                </Link>
              </li>
            ))}
          </ul>
        )}

        {hasMore && (
          <div className="mt-2 flex justify-center">
            <Button variant="ghost" size="sm" onClick={() => setExpanded((e) => !e)}>
              {expanded ? "Show less" : `Show all (${projects.length})`}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
