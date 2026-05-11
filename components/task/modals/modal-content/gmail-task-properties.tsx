"use client";
import { useRef, useState } from "react";
import { ExternalLink, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GmailTaskPropertiesProps {
  messageId: string;
  bodyHtml: string | null;
}

export function GmailTaskProperties({ messageId, bodyHtml }: GmailTaskPropertiesProps) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [iframeHeight, setIframeHeight] = useState(300);

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
      setIframeHeight(Math.min(nextHeight, 600)); // Cap height for modal
    }
  };

  const openInGmail = () => {
    const url = `https://mail.google.com/mail/#all/${messageId}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  if (!bodyHtml) return null;

  return (
    <div className="mt-8 flex w-full flex-col gap-1 rounded-xl border border-gray-100/50 bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="rounded-lg border border-gray-100 bg-gray-50 p-1.5">
            <Mail className="h-[18px] w-[18px] text-[#ea4335]" />
          </div>
          <h3 className="text-base font-bold text-gray-900">Gmail Message</h3>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1.5 rounded-lg border border-red-100 bg-red-50 px-3.5 py-1.5 text-[11px] font-bold text-red-600 shadow-sm shadow-red-100 transition hover:bg-red-100"
          onClick={openInGmail}
        >
          <ExternalLink className="h-3 w-3" />
          Open in Gmail
        </Button>
      </div>

      <div className="rounded-md border border-gray-50 bg-white overflow-hidden">
        <iframe
          ref={iframeRef}
          title={`gmail-task-${messageId}`}
          srcDoc={bodyHtml}
          sandbox="allow-same-origin allow-popups allow-popups-to-escape-sandbox"
          onLoad={adjustIframeHeight}
          className="w-full"
          style={{ height: `${iframeHeight}px` }}
        />
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-gray-50 pt-4">
        <span className="text-[10px] font-medium text-gray-400">
          Imported from Gmail
        </span>
        <div className="flex items-center gap-1.5">
          <div className="h-1.5 w-1.5 rounded-full bg-red-500"></div>
          <span className="text-[10px] font-bold uppercase tracking-tight text-red-600">Linked</span>
        </div>
      </div>
    </div>
  );
}
