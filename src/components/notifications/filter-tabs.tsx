import React from "react";

interface FilterTabProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const FilterTab: React.FC<FilterTabProps> = ({ label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
      isActive
        ? "border-primary text-primary bg-primary/5"
        : "text-muted-foreground hover:text-foreground hover:border-border border-transparent"
    }`}
  >
    {label}
  </button>
);

interface FilterTabsProps {
  activeFilter: string;
  onFilterChange: (filter: "all" | "overdue" | "invitations" | "updates") => void;
}

const FilterTabs: React.FC<FilterTabsProps> = ({ activeFilter, onFilterChange }) => {
  return (
    <div className="border-border mb-6 flex items-center gap-1 border-b">
      <FilterTab
        label="All"
        isActive={activeFilter === "all"}
        onClick={() => onFilterChange("all")}
      />
      <FilterTab
        label="Overdue"
        isActive={activeFilter === "overdue"}
        onClick={() => onFilterChange("overdue")}
      />
      <FilterTab
        label="Invitations"
        isActive={activeFilter === "invitations"}
        onClick={() => onFilterChange("invitations")}
      />
      <FilterTab
        label="Updates"
        isActive={activeFilter === "updates"}
        onClick={() => onFilterChange("updates")}
      />
    </div>
  );
};

export default FilterTabs;