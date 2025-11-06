// components/task-management/FilterBar/SectionFilterDropdown.tsx
import { Button } from "@/components/ui/button";
import { useState,Dispatch, SetStateAction, useRef, useEffect } from "react";
import { ISection } from "@/types/section.type";

interface SectionFilterDropdownProps {
  sections: ISection[];
  selectedSectionIds: string[];
  setSelectedSectionIds: Dispatch<SetStateAction<string[]>>;
  isFilterLoading: boolean;
  setIsFilterLoading: Dispatch<SetStateAction<boolean>>;
}

export default function SectionFilterDropdown({
  sections,
  selectedSectionIds,
  setSelectedSectionIds,
  isFilterLoading,
  setIsFilterLoading,
}: SectionFilterDropdownProps) {
  const [show, setShow] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setShow(false);
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  const toggle = (id: string) => {
    setIsFilterLoading(true);
    setTimeout(() => {
      setSelectedSectionIds(prev =>
        prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
      );
      setIsFilterLoading(false);
    }, 200);
  };

  return (
    <div className="relative" ref={ref}>
      <Button variant="outline" size="sm" onClick={() => setShow(!show)}>
        Filter
        <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </Button>

      {show && (
        <div className="absolute top-full left-0 mt-1 w-64 rounded-md border bg-white shadow-lg p-3 z-50">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium">Sections</span>
            <div className="flex gap-1 text-xs">
              <button onClick={() => setSelectedSectionIds(sections.map(s => s.id))} className="text-blue-600">All</button>
              <span>|</span>
              <button onClick={() => setSelectedSectionIds([])} className="text-blue-600">None</button>
            </div>
          </div>
          <div className="space-y-1 max-h-48 overflow-y-auto">
            {sections.map(s => (
              <label key={s.id} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedSectionIds.includes(s.id)}
                  onChange={() => toggle(s.id)}
                  disabled={isFilterLoading}
                />
                <span className="text-sm">{s.name}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}