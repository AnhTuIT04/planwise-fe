import { useEffect, useState } from "react";
import { Plus } from "lucide-react";

interface AddTaskButtonProps {
  type: "always_show" | "hover_show";
  onClick: () => void;
}

export default function AddTaskButton({ type, onClick }: AddTaskButtonProps) {
  const [hovered, setHovered] = useState(false);
  const [active, setActive] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (hovered) {
      timer = setTimeout(() => setActive(true), 500);
    } else {
      setActive(false);
    }
    return () => clearTimeout(timer);
  }, [hovered]);

  if (type === "always_show")
    return (
      <button
        onClick={() => onClick()}
        className="group mb-2 flex w-full cursor-pointer items-center justify-start rounded border bg-white p-3 px-3 py-1.5 text-[14px] text-[#b4b4b4] shadow-[0_1px_1px_#0000001a] transition-shadow hover:border-[#dcdcdc] hover:shadow-[0_3px_6px_#0000001a]"
      >
        <Plus className="mr-2 h-4 w-4" /> <span className="group-hover:text-[#413f39]">Add task</span>
      </button>
    );

  return (
    <div
      className={`group relative mb-2 flex flex-col items-center transition-all duration-300 ${
        active ? "mb-0 hover:mb-0" : ""
      }`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="absolute top-0 left-0 h-2 w-full" />

      <div className={`w-full overflow-hidden transition-all duration-300 ease-in-out ${active ? "h-8" : "h-0"}`} />

      {active && (
        <button
          onClick={() => onClick()}
          className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-dashed border-gray-300 bg-white px-2 text-xs text-gray-500 transition-opacity duration-300 ease-in-out hover:border-blue-400 hover:text-blue-500"
        >
          <Plus className="mr-1 h-3 w-3" /> Add task
        </button>
      )}
    </div>
  );
}
