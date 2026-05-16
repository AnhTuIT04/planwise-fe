"use client";

import { useEffect, useRef, useState } from "react";
import { Hash, Send, Paperclip, X, Loader2, FileText, AlertCircle } from "lucide-react";
import { nanoid } from "nanoid";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useChannelMessages } from "@/hooks/use-channel-messages";
import { MessageContent } from "./message-content";

interface TextChannelProps {
  channelId: string;
  channelName: string;
}

type AttachmentStatus = "uploading" | "ready" | "error";

interface PendingAttachment {
  id: string;
  file: File;
  status: AttachmentStatus;
  url?: string;
  contentType?: "IMAGE" | "VIDEO" | "FILE";
  previewUrl?: string;
}

function detectContentType(file: File): "IMAGE" | "VIDEO" | "FILE" {
  if (file.type.startsWith("image/")) return "IMAGE";
  if (file.type.startsWith("video/")) return "VIDEO";
  return "FILE";
}

export function TextChannel({ channelId, channelName }: TextChannelProps) {
  const [messageInput, setMessageInput] = useState("");
  const [attachments, setAttachments] = useState<PendingAttachment[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const {
    messages,
    sendMessage: sendChannelMessage,
    uploadAttachment,
    sendUploadedAttachment,
    isLoading: isLoadingMessages,
  } = useChannelMessages({ channelId });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 140) + "px";
  }, [messageInput]);

  useEffect(() => {
    return () => {
      attachments.forEach((a) => {
        if (a.previewUrl) URL.revokeObjectURL(a.previewUrl);
      });
    };
  }, [attachments]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (files.length === 0) return;

    const next: PendingAttachment[] = files.map((file) => ({
      id: nanoid(),
      file,
      status: "uploading",
      contentType: detectContentType(file),
      previewUrl: file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined,
    }));

    setAttachments((prev) => [...prev, ...next]);

    next.forEach((entry) => {
      uploadAttachment(entry.file)
        .then(({ url, contentType }) => {
          setAttachments((prev) =>
            prev.map((a) => (a.id === entry.id ? { ...a, status: "ready", url, contentType } : a)),
          );
        })
        .catch((err) => {
          console.error("Upload failed", err);
          setAttachments((prev) => prev.map((a) => (a.id === entry.id ? { ...a, status: "error" } : a)));
        });
    });
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => {
      const target = prev.find((a) => a.id === id);
      if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((a) => a.id !== id);
    });
  };

  const isUploading = attachments.some((a) => a.status === "uploading");
  const hasError = attachments.some((a) => a.status === "error");
  const canSend = !isUploading && !hasError && (messageInput.trim().length > 0 || attachments.some((a) => a.status === "ready"));

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!canSend) return;

    const trimmed = messageInput.trim();
    if (trimmed) sendChannelMessage(trimmed);

    attachments
      .filter((a) => a.status === "ready" && a.url && a.contentType)
      .forEach((a) => sendUploadedAttachment(a.url!, a.contentType!));

    attachments.forEach((a) => {
      if (a.previewUrl) URL.revokeObjectURL(a.previewUrl);
    });
    setAttachments([]);
    setMessageInput("");
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="mb-4">
          <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-gray-200">
            <Hash size={32} className="text-gray-600" />
          </div>
          <h3 className="mb-1 text-2xl font-bold">Welcome to #{channelName}</h3>
          <p className="text-sm text-gray-500">This is the beginning of the channel</p>
        </div>

        <div className="space-y-4">
          {isLoadingMessages ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-sm text-gray-500">Loading messages...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-sm text-gray-500">No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className={`flex gap-3 ${msg.pending ? "opacity-60" : ""}`}>
                <Avatar className="h-10 w-10">
                  <AvatarImage src={msg.sender.avatarUrl ?? undefined} />
                  <AvatarFallback className="bg-blue-500 text-white">
                    {msg.sender.fullname[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="mb-1 flex items-baseline gap-2">
                    <span className="font-semibold text-gray-900">{msg.sender.fullname}</span>
                    <span className="text-xs text-gray-500">{new Date(msg.createdAt).toLocaleString()}</span>
                  </div>
                  {msg.pending && msg.contentType !== "TEXT" ? (
                    <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-600">
                      <Loader2 size={14} className="animate-spin" />
                      <span>Uploading {msg.content}…</span>
                    </div>
                  ) : (
                    <MessageContent content={msg.content} contentType={msg.contentType} />
                  )}
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="border-t border-gray-200 px-4 py-3">
        <form
          onSubmit={handleSend}
          className="rounded-2xl border border-gray-200 bg-white shadow-sm transition focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100"
        >
          {attachments.length > 0 && (
            <div className="flex flex-wrap gap-2 border-b border-gray-100 p-3">
              {attachments.map((a) => (
                <AttachmentChip key={a.id} attachment={a} onRemove={() => removeAttachment(a.id)} />
              ))}
            </div>
          )}

          <div className="flex items-end gap-2 px-3 py-2">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              accept="image/*,video/*,.pdf,.doc,.docx,.txt,.zip,.rar"
            />
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="shrink-0 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              onClick={() => fileInputRef.current?.click()}
            >
              <Paperclip size={18} />
            </Button>

            <textarea
              ref={textareaRef}
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder={`Message #${channelName}`}
              rows={1}
              className="max-h-[140px] min-h-[24px] flex-1 resize-none border-0 bg-transparent text-sm leading-6 placeholder:text-gray-400 focus:outline-none"
            />

            <Button
              type="submit"
              size="icon"
              disabled={!canSend}
              className="shrink-0 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40"
            >
              {isUploading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
            </Button>
          </div>
        </form>
        {hasError && (
          <p className="mt-1 flex items-center gap-1 text-xs text-red-500">
            <AlertCircle size={12} /> Some attachments failed to upload — remove them to continue
          </p>
        )}
      </div>
    </>
  );
}

function AttachmentChip({ attachment, onRemove }: { attachment: PendingAttachment; onRemove: () => void }) {
  const { file, status, previewUrl, contentType } = attachment;
  const isImage = contentType === "IMAGE";

  return (
    <div className="group relative flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-1.5 pr-2">
      {isImage && previewUrl ? (
        <div className="relative h-12 w-12 overflow-hidden rounded-md bg-gray-200">
          <img src={previewUrl} alt={file.name} className="h-full w-full object-cover" />
          {status === "uploading" && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <Loader2 size={16} className="animate-spin text-white" />
            </div>
          )}
        </div>
      ) : (
        <div className="flex h-12 w-12 items-center justify-center rounded-md bg-gray-200 text-gray-600">
          {status === "uploading" ? <Loader2 size={16} className="animate-spin" /> : <FileText size={18} />}
        </div>
      )}
      <div className="flex max-w-[140px] flex-col">
        <span className="truncate text-xs font-medium text-gray-800">{file.name}</span>
        <span className="text-[10px] text-gray-500">
          {status === "uploading" && "Uploading…"}
          {status === "ready" && "Ready"}
          {status === "error" && <span className="text-red-500">Failed</span>}
        </span>
      </div>
      <button
        type="button"
        onClick={onRemove}
        className="absolute -top-1.5 -right-1.5 rounded-full bg-gray-700 p-0.5 text-white opacity-0 transition group-hover:opacity-100"
        aria-label="Remove attachment"
      >
        <X size={12} />
      </button>
    </div>
  );
}
