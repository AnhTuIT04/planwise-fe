import TaskActionExample from "@/components/examples/TaskActionExample";

export default function TaskActionExamplePage() {

  return (
    <div className="my-1 ml-1 flex flex-1 flex-col overflow-auto rounded-l-[6px] border-y border-l border-[#dcdcdc] bg-[#f8f8f9] shadow-sm">
      <TaskActionExample projectId="project-123" taskId="task-456" />
    </div>
  );
}
