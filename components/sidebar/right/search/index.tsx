"use client";

import { useEffect, useState } from "react";
import { useParams, usePathname } from "next/navigation";
import { Search, X } from "lucide-react";

import { useAuth } from "@/components/providers/auth-provider";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useSection } from "@/hooks/use-section";
import { useTaskQueryStore } from "@/stores/task-query.store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import StatusFilter from "./status-filter";
import PriorityFilter from "./priority-filter";
import SearchResultRow from "./result-row";

export default function SearchSidebar() {
  const params = useParams<{ id?: string }>();
  const pathname = usePathname();
  const { user } = useAuth();

  // /projects/[id] uses the URL param; /my-tasks resolves to the user's personal workspace project.
  const projectId =
    typeof params?.id === "string"
      ? params.id
      : pathname?.startsWith("/my-tasks")
        ? user?.workspaceId
        : undefined;

  const setField = useTaskQueryStore((s) => s.setField);
  const projectQuery = useTaskQueryStore((s) => (projectId ? s.queries[projectId] : undefined));

  const [input, setInput] = useState<string>(projectQuery?.q ?? "");
  const [prevProjectId, setPrevProjectId] = useState(projectId);
  const debouncedInput = useDebouncedValue(input, 300);

  // Re-seed the local input when switching projects, following React's "adjusting state
  // on prop change" pattern (https://react.dev/learn/you-might-not-need-an-effect).
  if (projectId !== prevProjectId) {
    setPrevProjectId(projectId);
    setInput(projectId ? (useTaskQueryStore.getState().getQuery(projectId).q ?? "") : "");
  }

  // Push debounced value to the store (which becomes the query param).
  useEffect(() => {
    if (!projectId) return;
    if ((projectQuery?.q ?? "") === debouncedInput) return;
    setField(projectId, "q", debouncedInput);
  }, [debouncedInput, projectId, projectQuery?.q, setField]);

  const queryParams = projectQuery ?? {
    q: "",
    statuses: [],
    priorities: [],
  };
  const { data: sections, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } = useSection(
    projectId ?? "",
    {
      q: queryParams.q,
      statuses: queryParams.statuses,
      priorities: queryParams.priorities,
    },
  );

  const tasks = sections.flatMap((section) =>
    section.tasks.data.map((task, index) => ({
      task,
      sectionId: section.id,
      sectionName: section.name,
      position: index,
    })),
  );

  const hasFilters =
    !!debouncedInput ||
    (queryParams.statuses?.length ?? 0) > 0 ||
    (queryParams.priorities?.length ?? 0) > 0
    // (queryParams.sections?.length ?? 0) > 0 ||
    // !!queryParams.deadlineFrom ||
    // !!queryParams.deadlineTo;

  return (
    <div className="flex h-full w-80 flex-col bg-[#f8f8f9] shadow-[-5px_0px_15px_rgba(0,0,0,0.05)]">
      <div className="flex h-12 items-center justify-between border-b p-4">
        <h2 className="text-[14px] font-semibold text-[#787878]">Search</h2>
      </div>

      <div className="mx-5 flex items-center gap-2 border-b py-3">
        <Search className="size-5 text-[#9b9ba1]" />
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Search..."
          disabled={!projectId}
          className="h-auto border-0 bg-transparent px-0 text-[14px] text-[#2f2f33] placeholder:text-[#b0b0b5] focus-visible:ring-0 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-60"
        />
        {input && (
          <button
            type="button"
            onClick={() => setInput("")}
            className="text-[#9b9ba1] hover:text-[#2f2f33]"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {projectId && (
        <div className="flex flex-wrap items-center gap-2 border-b px-5 py-3">
          <StatusFilter projectId={projectId} />
          <PriorityFilter projectId={projectId} />
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-2 py-2">
        {!projectId ? (
          <p className="px-3 py-6 text-center text-[12px] text-[#9b9ba1]">
            Open a project to search its tasks.
          </p>
        ) : isLoading ? (
          <div className="space-y-2 px-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : !hasFilters ? (
          <p className="px-3 py-6 text-center text-[12px] text-[#9b9ba1]">
            Type to search or pick a filter…
          </p>
        ) : tasks.length === 0 ? (
          <p className="px-3 py-6 text-center text-[12px] text-[#9b9ba1]">
            No tasks match your search.
          </p>
        ) : (
          <div className="space-y-1">
            {tasks.map(({ task, sectionId, sectionName, position }) => (
              <SearchResultRow
                key={task.id}
                task={task}
                projectId={projectId}
                sectionId={sectionId}
                sectionName={sectionName}
                position={position}
              />
            ))}

            {hasNextPage && (
              <div className="flex justify-center pt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  className="text-[12px] text-[#787878]"
                >
                  {isFetchingNextPage ? "Loading…" : "Load more"}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
