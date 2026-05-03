import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useRef, useState } from "react";

import { cn } from "@/lib/utils";
import { ExternalLink } from "lucide-react";

type MailViewerMessage = {
  id: string;
  from: string;
  to: string;
  subject: string;
  preview: string;
  receivedAt: string;
  labelIds: string[];
  bodyHtml: string;
  bodyText: string;
};

function formatDateTime(receivedAt: string) {
  const date = new Date(receivedAt);
  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function getGmailMessageUrl(messageId: string, accountEmail?: string) {
  const authUserQuery = accountEmail ? `?authuser=${encodeURIComponent(accountEmail)}` : "";
  return `https://mail.google.com/mail/${authUserQuery}#all/${messageId}`;
}

function extractPrimaryEmail(value: string) {
  if (!value) return "";

  const firstRecipient = value.split(",")[0]?.trim() || "";
  const angleMatch = firstRecipient.match(/<([^>]+)>/);
  if (angleMatch?.[1]) return angleMatch[1].trim();

  const plainEmailMatch = firstRecipient.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  return plainEmailMatch?.[0] || "";
}

export default function MailViewerModal({
  open,
  setOpen,
  message,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  message: MailViewerMessage | null;
}) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [iframeHeight, setIframeHeight] = useState(420);

  const adjustIframeHeight = () => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!doc) return;

    const body = doc.body;
    const html = doc.documentElement;
    const nextHeight = Math.max(
      body?.scrollHeight ?? 0,
      body?.offsetHeight ?? 0,
      html?.clientHeight ?? 0,
      html?.scrollHeight ?? 0,
      html?.offsetHeight ?? 0,
    );

    if (nextHeight > 0) {
      setIframeHeight(nextHeight);
    }
  };

  const openInGmail = () => {
    if (!message?.id) return;

    const accountEmail = extractPrimaryEmail(message.to);
    const targetUrl = getGmailMessageUrl(message.id, accountEmail);
    window.open(targetUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className={cn(
          "w-222! max-w-full! flex-1 rounded-none! p-0! min-[888px]:my-9! min-[888px]:rounded-[10px]!",
          "[&>button]:top-5.5 [&>button]:size-7.5 [&>button]:cursor-pointer [&>button]:rounded-[5px] [&>button]:p-2",
          "[&>button]:bg-transparent [&>button]:text-[#b4b4b4] [&>button]:hover:bg-[#f7f8fa] [&>button]:hover:text-[#413f39] [&>button]:hover:opacity-80",
        )}
      >
        <DialogHeader className="sr-only">
          <DialogTitle>View Mail</DialogTitle>
          <DialogDescription>View the details of the selected mail.</DialogDescription>
        </DialogHeader>

        {message ? (
          <div className="flex flex-col">
            <div className="px-6 pt-6 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-start gap-2.5 pr-8">
                  <span className="mt-1 size-4 shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="52 42 88 66" className="h-full w-full">
                      <path fill="#4285f4" d="M58 108h14V74L52 59v43c0 3.32 2.69 6 6 6" />
                      <path fill="#34a853" d="M120 108h14c3.32 0 6-2.69 6-6V59l-20 15" />
                      <path fill="#fbbc04" d="M120 48v26l20-15v-8c0-7.42-8.47-11.65-14.4-7.2" />
                      <path fill="#ea4335" d="M72 74V48l24 18 24-18v26L96 92" />
                      <path fill="#c5221f" d="M52 51v8l20 15V48l-5.6-4.2c-5.94-4.45-14.4-.22-14.4 7.2" />
                    </svg>
                  </span>
                  <h2 className="text-lg leading-snug font-semibold text-[#1f2937]">{message.subject}</h2>
                </div>

                <Button
                  title="Open in email client"
                  variant="outline"
                  size="sm"
                  onClick={openInGmail}
                  className="-mt-0.5 mr-5 size-7.5 rounded-[5px] border-none shadow-none hover:bg-[#f7f8fa]"
                >
                  <ExternalLink className="size-4 text-[#b4b4b4]" />
                </Button>
              </div>
              <p className="mt-1 text-xs text-[#6b7280]">{formatDateTime(message.receivedAt)}</p>
            </div>

            <div className="space-y-4 px-6 py-2">
              <div className="rounded-md p-0 text-sm">
                <p className="text-[#374151]">
                  <span className="font-medium">From:</span> {message.from}
                </p>
                <p className="mt-1 text-[#374151]">
                  <span className="font-medium">To:</span> {message.to}
                </p>
              </div>

              <div className="rounded-md bg-white pb-2 text-sm leading-6 text-[#374151]">
                {message.bodyHtml ? (
                  <iframe
                    ref={iframeRef}
                    title={`gmail-message-${message.id}`}
                    srcDoc={message.bodyHtml}
                    sandbox="allow-same-origin allow-popups allow-popups-to-escape-sandbox"
                    onLoad={adjustIframeHeight}
                    className="w-full"
                    style={{ height: `${iframeHeight}px` }}
                  />
                ) : (
                  <pre className="m-0 font-sans text-sm leading-6 whitespace-pre-wrap text-[#374151]">
                    {message.bodyText || message.preview}
                  </pre>
                )}
              </div>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}