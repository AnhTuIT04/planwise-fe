"use client";

import { Button } from "@/components/ui/button";
import { AccountItem } from "./account-item";
import { Plus } from "lucide-react";
import { Connection } from "@/services/apis/calendar/get-connections.api";
import { useRouter } from "next/navigation";
import { apiURL } from "@/lib/consts";
import { useCalendarIntegration } from "@/hooks/use-calendar-integration";

export function AccountManager({
  connections,
  activeConnectionIds,
  setActiveConnectionIds,
}: {
  connections: Connection[];
  activeConnectionIds: string[];
  setActiveConnectionIds: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  const router = useRouter();

  const { deleteConnection } = useCalendarIntegration("GOOGLE_CALENDAR")

  const toggleAccount = (id: string) => {
    setActiveConnectionIds((prev) => (prev.includes(id) ? prev.filter((connId) => connId !== id) : [...prev, id]));
  };

  const disconnect = (id: string) => {
    deleteConnection.mutate({ provider: "GOOGLE_CALENDAR", connectionId: id });
  };

  const addAccount = () => {
    router.push(`${apiURL}/integrations/connect/GOOGLE_CALENDAR`);
  };

  return (
    <>
      {connections.map((connection) => (
        <AccountItem
          key={connection.id}
          email={connection.email}
          active={activeConnectionIds?.includes(connection.id)}
          onToggle={() => toggleAccount(connection.id)}
          onDisconnect={() => disconnect(connection.id)}
        />
      ))}

      <Button variant="ghost" className="w-full justify-start gap-2" onClick={addAccount}>
        <Plus size={14} />
        Add account
      </Button>
    </>
  );
}
