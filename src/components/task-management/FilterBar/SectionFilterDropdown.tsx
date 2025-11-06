"use client";

import { useRef, useEffect } from "react";
import { ISection } from "@/types/section.type";

interface SectionFilterDropdownProps {
  sections: ISection[];
  selectedSectionIds: string[];
  show: boolean;
  isFilterLoading: boolean;
  onToggle: () => void;
  onSectionToggle: (id: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
}

export default function SectionFilterDropdown({
  sections,
  selectedSectionIds,
  show,
  isFilterLoading,
  onToggle,
  onSectionToggle,
  onSelectAll,
  onDeselectAll,
}: SectionFilterDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        onToggle();
      }
    };
    if (show) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [show, onToggle]);

  if (!show) return null;

  return (
    <div ref={dropdownRef} className="absolute top-full left-0 z-50 mt-1 w-64 rounded-md border bg-white shadow-lg">
      <div className="p-3">
        <div className="mb-3 flex justify-between">
          <h3 className="text-sm font-medium">Filter by Sections</h3>
          <div className="flex gap-1">
            <button
              onClick={onSelectAll}
              disabled={isFilterLoading}
              className={`text-xs ${isFilterLoading ? "text-gray-400" : "text-blue-600 hover:text-blue-800"}`}
            >
              All
            </button>
            <span className="text-xs text-gray-400">|</span>
            <button
              onClick={onDeselectAll}
              disabled={isFilterLoading}
              className={`text-xs ${isFilterLoading ? "text-gray-400" : "text-blue-600 hover:text-blue-800"}`}
            >
              None
            </button>
          </div>
        </div>

        <div className="max-h-48 space-y-2 overflow-y-auto">
          {sections.map((section) => (
            <label key={section.id} className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={selectedSectionIds.includes(section.id)}
                onChange={() => onSectionToggle(section.id)}
                disabled={isFilterLoading}
                className={`h-4 w-4 rounded border-gray-300 ${isFilterLoading ? "cursor-not-allowed opacity-50" : ""}`}
              />
              <span className="text-sm text-gray-700">{section.name}</span>
              <span className="text-xs text-gray-500">({section.tasks.length})</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}