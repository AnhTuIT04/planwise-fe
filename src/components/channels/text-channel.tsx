"use client";

import { useEffect, useRef, useState } from "react";
import { Hash, Send, Paperclip, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useChannelMessages } from "@/hooks/useChannelMessages";
import { MessageContent } from "./message-content";

interface TextChannelProps {
  channelId: string;
  channelName: string;
}

export function TextChannel({ channelId, channelName }: TextChannelProps) {
  const [messageInput, setMessageInput] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { messages, sendMessage: sendChannelMessage, sendFile, isLoading: isLoadingMessages } = useChannelMessages({ channelId });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedFile) {
      // Send file
      await sendFile(selectedFile);
      setSelectedFile(null);
    } else if (messageInput.trim()) {
      // Send text message
      sendChannelMessage(messageInput);
    }
    
    setMessageInput("");
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const clearSelectedFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <>
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {/* Channel Start */}
        <div className="mb-4">
          <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-gray-200">
            <Hash size={32} className="text-gray-600" />
          </div>
          <h3 className="mb-1 text-2xl font-bold">Welcome to #{channelName}</h3>
          <p className="text-sm text-gray-500">This is the beginning of the channel</p>
        </div>

        {/* Messages */}
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
              <div key={msg.id} className="flex gap-3">
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
                  <MessageContent content={msg.content} contentType={msg.contentType} />
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      <div className="border-t border-gray-200 px-4 py-4">
        {selectedFile && (
          <div className="mb-2 flex items-center gap-2 rounded-lg border border-blue-300 bg-blue-50 p-2">
            <Paperclip size={16} className="text-blue-600" />
            <span className="flex-1 text-sm text-gray-700">{selectedFile.name}</span>
            <Button type="button" size="sm" variant="ghost" onClick={clearSelectedFile}>
              <X size={16} />
            </Button>
          </div>
        )}
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileSelect}
            className="hidden"
            accept="image/*,video/*,.pdf,.doc,.docx,.txt,.zip,.rar"
          />
          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={() => fileInputRef.current?.click()}
          >
            <Paperclip size={18} />
          </Button>
          <Input
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder={`Message #${channelName}`}
            className="flex-1"
            disabled={!!selectedFile}
          />
          <Button type="submit" size="icon" disabled={!messageInput.trim() && !selectedFile}>
            <Send size={18} />
          </Button>
        </form>
      </div>
    </>
  );
}
