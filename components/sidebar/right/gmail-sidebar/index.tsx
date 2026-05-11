
"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Archive, ExternalLink, MailOpen, RefreshCw, Search, Star, Trash2 } from "lucide-react";
import { Section, Text } from "@react-email/components";
import { useRouter } from "next/navigation";

import { getEmail, IMessage } from "@/apis/gmail/get-message.api";
import { markGmailMessageAsReadApi } from "@/apis/gmail/mark-message-read.api";
import { getConnectionsApi } from "@/apis/calendar/get-connections.api";
import { Button } from "@/components/ui/button";
import { apiURL } from "@/lib/consts";
import MailViewerModal from "./mail-viewer-modal";

type GmailMessage = {
  id: string;
  from: string;
  to: string;
  sender: string;
  subject: string;
  preview: string;
  time: string;
  receivedAt: string;
  isUnread: boolean;
  labelIds: string[];
  bodyHtml: string;
  bodyText: string;
};

type GmailDragPayload = {
  id: string;
  title: string;
  description: string;
  bodyHtml: string;
  from: string;
  to: string;
  receivedAt: string;
};

function extractSender(from: string) {
  const matched = from.match(/^(.*?)(\s*<.+>)?$/);
  return matched?.[1]?.trim() || from;
}

function formatTime(receivedAt: string) {
  const date = new Date(receivedAt);
  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function mapMessageToCard(message: IMessage): GmailMessage {
  const bodyHtml = message.body?.html || "";
  const bodyText = message.body?.text || "";

  return {
    id: message.externalId,
    from: message.from,
    to: message.to,
    sender: extractSender(message.from),
    subject: message.subject || "(No subject)",
    preview: message.snippet || "",
    time: formatTime(message.receivedAt),
    receivedAt: message.receivedAt,
    isUnread: message.isUnread,
    labelIds: message.labelIds,
    bodyHtml,
    bodyText,
  };
}

function toGmailDragPayload(message: GmailMessage): GmailDragPayload {
  return {
    id: message.id,
    title: (message.subject || "").trim() || "Email",
    description: message.preview || "",
    bodyHtml: message.bodyHtml || "",
    from: message.from,
    to: message.to,
    receivedAt: message.receivedAt,
  };
}

function EmailMessageItem({ message, onOpen }: { message: GmailMessage; onOpen: (message: GmailMessage) => void }) {
  const handleNativeDragStart = (e: React.DragEvent<HTMLElement>) => {
    e.stopPropagation();
    const payload = toGmailDragPayload(message);
    e.dataTransfer.effectAllowed = "copy";
    e.dataTransfer.setData("application/x-planwise-gmail-message", JSON.stringify(payload));
    e.dataTransfer.setData("text/plain", payload.title);

    if (typeof window !== "undefined") {
      (window as any).__planwiseGmailDragMessage = payload;
    }
  };

  const handleNativeDragEnd = () => {
    if (typeof window !== "undefined") {
      (window as any).__planwiseGmailDragMessage = null;
    }
  };

  return (
    <Section
      role="button"
      draggable
      onClick={() => onOpen(message)}
      onDragStart={handleNativeDragStart}
      onDragEnd={handleNativeDragEnd}
      style={{
        border: "1px solid #d9dde3",
        borderRadius: "10px",
        backgroundColor: "#ffffff",
        padding: "10px 12px",
        boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
        marginBottom: "8px",
        cursor: "pointer",
      }}
    >
      <div className="mb-1.5 flex items-start justify-between gap-2 p-2">
        <div className="min-w-0">
          <div className="mb-1 flex items-center gap-1.5 text-[#9ca3af]">
            <span className="inline-block h-0 w-0 border-t-[5px] border-b-[5px] border-l-[7px] border-t-transparent border-b-transparent border-l-[#e5e7eb]" />
            <Text
              style={{
                margin: 0,
                fontSize: "13px",
                fontWeight: message.isUnread ? 600 : 500,
                color: message.isUnread ? "#1f2937" : "#2f3c4e",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {message.sender}
            </Text>
            <ExternalLink className="h-3 w-3 shrink-0" />
            <Archive className="h-3 w-3 shrink-0" />
            <Trash2 className="h-3 w-3 shrink-0" />
            <MailOpen className="h-3 w-3 shrink-0" />
            <Star className="h-3 w-3 shrink-0" />
          </div>

          <Text
            style={{
              margin: 0,
              fontSize: "15px",
              lineHeight: "1.35",
              color: message.isUnread ? "#111827" : "#1f2937",
              fontWeight: message.isUnread ? 700 : 600,
              display: "-webkit-box",
              WebkitLineClamp: 1,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              //   padding: "0 2px",
            }}
          >
            {message.subject}
          </Text>
        </div>

        <Text
          style={{
            margin: 0,
            fontSize: "12px",
            color: "#4b5563",
            flexShrink: 0,
          }}
        >
          {message.time}
        </Text>
      </div>

      <Text
        style={{
          margin: 0,
          fontSize: "13px",
          lineHeight: "1.45",
          color: "#6b7280",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
        className="px-2 pb-11"
      >
        {message.preview}
      </Text>
    </Section>
  );
}

export default function GmailSidebar() {
  const router = useRouter();
  const [searchText, setSearchText] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<GmailMessage | null>(null);

  const {
    data: connections,
    isLoading: isLoadingConnections,
    error: connectionError,
  } = useQuery({
    queryKey: ["calendar-connections", "GOOGLE_GMAIL"],
    queryFn: async () => {
      const [res, err] = await getConnectionsApi("GOOGLE_GMAIL");
      if (err) throw err;
      return res;
    },
  });

  const connectionId = connections?.[0]?.id;

  const {
    data: messageResponse,
    isLoading: isLoadingMessages,
    error: messageError,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["gmail-messages", connectionId],
    queryFn: () => getEmail(connectionId!),
    enabled: !!connectionId,
  });

  const filteredMessages = useMemo(() => {
    const mapped = (messageResponse?.messages ?? []).map(mapMessageToCard);
    const normalizedSearch = searchText.trim().toLowerCase();
    console.log("hiiii");

    if (!normalizedSearch) return mapped;
    console.log(messageResponse);

    return mapped.filter((message: GmailMessage) => {
      const sender = message.sender.toLowerCase();
      const subject = message.subject.toLowerCase();
      const preview = message.preview.toLowerCase();
      return (
        sender.includes(normalizedSearch) || subject.includes(normalizedSearch) || preview.includes(normalizedSearch)
      );
    });
  }, [messageResponse?.messages, searchText]);
  console.log(messageResponse?.messages, "messages");
  console.log("parent: ", messageResponse);
  console.log("filterdMessages", filteredMessages);

  const isLoading = isLoadingConnections || isLoadingMessages;
  const hasError = connectionError || messageError;

  const connectGmail = () => {
    router.push(`${apiURL}/integrations/connect/GOOGLE_GMAIL`);
  };

  const handleOpenMessage = async (message: GmailMessage) => {
    setSelectedMessage(message);

    if (!connectionId || !message.isUnread) return;

    const [, err] = await markGmailMessageAsReadApi(connectionId, message.id);
    if (err) return;

    setSelectedMessage((prev) => (prev && prev.id === message.id ? { ...prev, isUnread: false } : prev));
    void refetch();
  };

  return (
    <div className="flex h-full w-full flex-col bg-[#f8f8f9]">
      <div className="flex h-12 items-center justify-between border-b p-4">
        <div className="flex flex-col">
          <h2 className="text-[16px] font-semibold text-[#787878]">Gmail</h2>
          {!connectionId && !isLoading && <span className="text-muted-foreground text-xs">Not connected</span>}
        </div>

        {!connectionId && !isLoading && (
          <Button size="sm" variant="outline" onClick={connectGmail}>
            Connect Gmail
          </Button>
        )}
      </div>

      {!!connectionId && (
        <div className="px-4 py-2.5">
          <div className="flex h-10 items-center rounded-md border border-[#d9dde3] bg-white px-3 text-[#6b7280]">
            <Search className="h-4 w-4 text-[#9ca3af]" />
            <input
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Contains text"
              className="ml-2 w-full bg-transparent text-base text-[#5f6368] outline-none placeholder:text-[#9ca3af]"
            />
            <div className="mx-2 h-5 w-px bg-[#e5e7eb]" />
            <button
              type="button"
              onClick={() => setSearchText("")}
              className="text-sm text-[#5f6368] transition-colors hover:text-[#202124]"
            >
              reset
            </button>
          </div>

          <div className="mt-1.5 flex justify-end">
            <button
              type="button"
              onClick={() => refetch()}
              disabled={!connectionId || isFetching}
              className="inline-flex items-center gap-1 text-sm text-[#5f6368] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-4 pb-3">
        {isLoading ? (
          <div className="flex h-full items-center justify-center text-sm text-[#6b7280]">Loading emails...</div>
        ) : !connectionId ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 px-4 text-center">
            <div className="text-sm text-[#6b7280]">
              Connect your Gmail account to view and manage your emails directly from the sidebar.
            </div>
            <Button size="sm" onClick={connectGmail}>
              Connect Gmail
            </Button>
          </div>
        ) : hasError ? (
          <div className="flex h-full items-center justify-center text-center text-sm text-red-500">
            Khong the tai email. Vui long thu lai.
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-[#6b7280]">Khong co email phu hop.</div>
        ) : (
          filteredMessages.map((message: GmailMessage)   => (
            <EmailMessageItem key={message.id} message={message} onOpen={handleOpenMessage} />
          ))
        )}
      </div>

      <MailViewerModal
        open={!!selectedMessage}
        setOpen={(open) => !open && setSelectedMessage(null)}
        message={selectedMessage}
      />

      {/* <Dialog open={!!selectedMessage} onOpenChange={(open) => !open && setSelectedMessage(null)}>
        <DialogContent className="max-h-[85vh] overflow-hidden p-0 sm:max-w-[640px]">
          {selectedMessage && (
            <div className="flex h-full flex-col">
              <DialogHeader className="border-b px-5 py-4">
                <DialogTitle className="pr-6 text-lg leading-snug text-[#1f2937]">
                  {selectedMessage.subject}
                </DialogTitle>
                <p className="mt-1 text-xs text-[#6b7280]">{formatDateTime(selectedMessage.receivedAt)}</p>
              </DialogHeader>

              <div className="space-y-4 overflow-y-auto px-5 py-4">
                <div className="rounded-md border border-[#e5e7eb] bg-[#f9fafb] p-3 text-sm">
                  <p className="text-[#374151]">
                    <span className="font-medium">From:</span> {selectedMessage.from}
                  </p>
                  <p className="mt-1 text-[#374151]">
                    <span className="font-medium">To:</span> {selectedMessage.to}
                  </p>
                  <p className="mt-1 text-[#374151]">
                    <span className="font-medium">Labels:</span> {selectedMessage.labelIds.join(", ") || "-"}
                  </p>
                </div>

                <div className="rounded-md border border-[#e5e7eb] bg-white p-4 text-sm leading-6 text-[#374151]">
                  {selectedMessage.bodyHtml ? (
                    <iframe
                      title={`gmail-message-${selectedMessage.id}`}
                      srcDoc={selectedMessage.bodyHtml}
                      sandbox="allow-popups allow-popups-to-escape-sandbox"
                      className="h-[420px] w-full rounded border"
                    />
                  ) : (
                    <pre className="m-0 font-sans text-sm leading-6 whitespace-pre-wrap text-[#374151]">
                      {selectedMessage.bodyText || selectedMessage.preview}
                    </pre>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog> */}
    </div>
  );
}