import React from "react";
import { Button } from "@/components/ui/button";

interface NotificationsHeaderProps {
  onMarkAllRead: () => void;
  filter: string;
  onFilterChange: (filter: string) => void;
}

const NotificationsHeader: React.FC<NotificationsHeaderProps> = ({
  onMarkAllRead,
  filter,
  onFilterChange,
}) => {
  return (
    <div className="mb-6 flex items-center justify-between">
      <div>
        <h1 className="text-foreground text-2xl font-semibold">Notifications</h1>
        <p className="text-muted-foreground text-sm">
          Stay updated with your tasks and projects
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={onMarkAllRead}
          className="text-primary hover:text-primary"
        >
          📖 Mark All Read
        </Button>
        
      </div>
    </div>
  );
};

export default NotificationsHeader;