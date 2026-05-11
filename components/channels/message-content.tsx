import { Download, FileIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MessageContentProps {
  content: string;
  contentType: "TEXT" | "IMAGE" | "VIDEO" | "FILE";
}

export function MessageContent({ content, contentType }: MessageContentProps) {
  if (contentType === "TEXT") {
    return <p className="text-gray-800">{content}</p>;
  }

  if (contentType === "IMAGE") {
    return (
      <div className="mt-2">
        <img
          src={content}
          alt="Shared image"
          className="max-w-md rounded-lg border border-gray-200 shadow-sm"
          style={{ maxHeight: "400px", objectFit: "contain" }}
        />
      </div>
    );
  }

  if (contentType === "VIDEO") {
    return (
      <div className="mt-2">
        <video
          src={content}
          controls
          className="max-w-md rounded-lg border border-gray-200 shadow-sm"
          style={{ maxHeight: "400px" }}
        >
          Your browser does not support the video tag.
        </video>
      </div>
    );
  }

  if (contentType === "FILE") {
    const fileName = content.split("/").pop() || "file";
    return (
      <div className="mt-2 flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3">
        <FileIcon size={24} className="text-gray-600" />
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-800">{fileName}</p>
          <a
            href={content}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-600 hover:underline"
          >
            View file
          </a>
        </div>
        <Button size="sm" variant="ghost" asChild>
          <a href={content} download target="_blank" rel="noopener noreferrer">
            <Download size={16} />
          </a>
        </Button>
      </div>
    );
  }

  return null;
}
