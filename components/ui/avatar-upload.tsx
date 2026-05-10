"use client";

import { useState, useRef, useEffect } from "react";
import { Camera, Loader2 } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Dropzone, DropzoneContent, DropzoneEmptyState } from "@/components/ui/shadcn-io/dropzone";
import { uploadSingleApi } from "@/services/apis/upload/upload-single.api";
import { toast } from "react-toastify";

interface AvatarUploadProps {
  currentAvatarUrl?: string | null;
  newAvatarUrl?: string | null;
  onAvatarChange: (file: File | null) => void;
  onAvatarUrlChange: (url: string) => void;
  fullname: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export function AvatarUpload({
  currentAvatarUrl,
  newAvatarUrl,
  onAvatarChange,
  onAvatarUrlChange,
  fullname,
  size = "xl",
}: AvatarUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showDropzone, setShowDropzone] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const dropzoneRef = useRef<HTMLDivElement>(null);

  const sizeClasses = {
    sm: "size-16",
    md: "size-20",
    lg: "size-24",
    xl: "size-32",
  };

  // Handle file selection and upload
  const handleFileSelect = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    setSelectedFile(file);
    setIsUploading(true);

    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    try {
      // Upload file immediately
      const uploadedUrl = await uploadSingleApi({ file });

      if (uploadedUrl) {
        console.log("Upload successful, calling onAvatarUrlChange with:", uploadedUrl);
        console.log("Type of uploadedUrl:", typeof uploadedUrl);
        // Update avatar URL in parent component
        onAvatarUrlChange(uploadedUrl);
        // Clear preview URL since we now have the real uploaded URL
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl);
          setPreviewUrl(null);
        }
        toast.success("Avatar uploaded successfully");
      }
    } catch (error) {
      toast.error("Failed to upload avatar");
      // Reset preview on error
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
      setSelectedFile(null);
    } finally {
      setIsUploading(false);
    }

    // Notify parent component
    onAvatarChange(file);
    setShowDropzone(false);
  };

  // Handle click outside dropzone to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropzoneRef.current && !dropzoneRef.current.contains(event.target as Node)) {
        setShowDropzone(false);
      }
    };

    if (showDropzone) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showDropzone]);

  // Clean up preview URL when component unmounts or when newAvatarUrl changes
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Clear preview when new avatar URL is set from parent (when component resets)
  useEffect(() => {
    if (newAvatarUrl === null && previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
      setSelectedFile(null);
    }
  }, [newAvatarUrl]);

  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const displayAvatarUrl = previewUrl || newAvatarUrl || currentAvatarUrl;

  // Debug log to track avatar URL changes
  console.log("AvatarUpload render:", {
    previewUrl: !!previewUrl,
    newAvatarUrl: !!newAvatarUrl,
    currentAvatarUrl: !!currentAvatarUrl,
    displayAvatarUrl: !!displayAvatarUrl,
  });

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <div
          role="button"
          tabIndex={0}
          onClick={() => !isUploading && setShowDropzone(true)}
          onKeyDown={(e) => {
            if (!isUploading && (e.key === "Enter" || e.key === " ")) setShowDropzone(true);
          }}
          className={`group relative ${isUploading ? "cursor-wait" : "cursor-pointer"}`}
        >
          {/* Hover overlay */}
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-full bg-black/0 transition-colors duration-200 group-hover:bg-black/30">
            {isUploading ? (
              <Loader2 className="h-6 w-6 animate-spin text-white" />
            ) : (
              <Camera className="h-6 w-6 text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
            )}
          </div>

          <Avatar className={sizeClasses[size]}>
            {displayAvatarUrl ? (
              <AvatarImage src={displayAvatarUrl} alt={`${fullname}'s avatar`} className="object-cover" />
            ) : null}
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-lg font-semibold text-white">
              {getInitials(fullname)}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Dropzone popup shown only after clicking avatar */}
        {showDropzone && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
            <div ref={dropzoneRef} className="w-96 rounded-lg border border-gray-200 bg-white p-6 shadow-xl">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Change Avatar</h3>
                <p className="text-sm text-gray-500">Upload a new profile picture</p>
              </div>

              <Dropzone
                accept={{ "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"] }}
                maxFiles={1}
                maxSize={5 * 1024 * 1024} // 5MB
                onDrop={handleFileSelect}
                className="w-full rounded-lg border-2 border-dashed border-gray-300 p-6 transition-colors hover:border-gray-400"
              >
                <DropzoneEmptyState>
                  <div className="flex flex-col items-center space-y-3 text-center">
                    <div className="rounded-full bg-gray-100 p-3">
                      <Camera className="h-6 w-6 text-gray-600" />
                    </div>
                    <div className="text-sm font-medium text-gray-900">Drop your image here, or browse</div>
                    <div className="text-xs text-gray-500">Supports: PNG, JPG, GIF up to 5MB</div>
                  </div>
                </DropzoneEmptyState>
              </Dropzone>

              <div className="mt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowDropzone(false)}
                  className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
