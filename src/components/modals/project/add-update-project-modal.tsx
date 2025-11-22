"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, Upload, Camera, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dropzone, DropzoneContent, DropzoneEmptyState } from "@/components/ui/shadcn-io/dropzone";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import useModal from "@/hooks/useModal";
import { useProject } from "@/hooks/useProject";
import { IProject } from "@/types/project.type";
import { uploadSingleApi } from "@/apis/upload/upload-single.api";

const projectSchema = z.object({
  name: z.string().min(1, "Project name is required").max(100, "Project name must be less than 100 characters"),
  description: z.string().max(500, "Description must be less than 500 characters").optional(),
});

type ProjectFormData = z.infer<typeof projectSchema>;

export default function AddUpdateProjectModal() {
  const { data, isOpen, closeModal, isSubmitting } = useModal<"ADD_UPDATE_PROJECT">();
  const { action, project } = data;

  const { createProject, updateProject, isCreatingProject, isUpdatingProject } = useProject();

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [newLogoUrl, setNewLogoUrl] = useState<string | null>(null);
  const [logoChanged, setLogoChanged] = useState(false);
  const [showDropzone, setShowDropzone] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const dropzoneRef = useRef<HTMLDivElement>(null);

  const isEditMode = action === "UPDATE" && !!project;

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  // Handle file selection and upload
  const handleFileSelect = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    setLogoFile(file);
    setIsUploading(true);

    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    try {
      // Upload file immediately
      const [uploadedUrl, uploadError] = await uploadSingleApi({ file });

      if (uploadedUrl) {
        // Update logo URL
        setNewLogoUrl(uploadedUrl);
        setLogoChanged(true);
        // Clear preview URL since we now have the real uploaded URL
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl);
          setPreviewUrl(null);
        }
        toast.success("Logo uploaded successfully");
      } else {
        toast.error(uploadError?.message || "Failed to upload logo");
        // Reset preview on error
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl);
          setPreviewUrl(null);
        }
        setLogoFile(null);
      }
    } catch (error) {
      toast.error("Failed to upload logo");
      // Reset preview on error
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
      setLogoFile(null);
    } finally {
      setIsUploading(false);
    }

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

  // Clean up preview URL when component unmounts
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Handler for logo URL change
  const handleLogoUrlChange = (url: string) => {
    console.log("handleLogoUrlChange called with:", url);
    setNewLogoUrl(url);
    setLogoChanged(true);
  };

  // Initialize form when modal opens
  useEffect(() => {
    if (isOpen && project) {
      form.reset({
        name: project.name || "",
        description: project.description || "",
      });
    } else {
      // Reset form for new project
      form.reset({
        name: "",
        description: "",
      });
      setLogoFile(null);
      setNewLogoUrl(null);
      setLogoChanged(false);
      setShowDropzone(false);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
    }
  }, [isOpen, project, form]);

  const onSubmit = async (data: ProjectFormData) => {
    try {
      console.log("Submit form with:", {
        name: data.name,
        description: data.description,
        newLogoUrl,
        currentLogo: project?.logoUrl,
      });

      // Prepare payload
      const payload: {
        name: string;
        description?: string;
        logoUrl?: string;
      } = {
        name: data.name,
        description: data.description || undefined,
      };

      // Only include logoUrl if it has changed or if it's a new project with a logo
      if (newLogoUrl) {
        payload.logoUrl = newLogoUrl;
      } else if (isEditMode && project?.logoUrl && !logoChanged) {
        // Keep existing logo if no change was made
        payload.logoUrl = project.logoUrl;
      }

      console.log("Calling project API with payload:", payload);

      if (isEditMode && project) {
        await updateProject({ id: project.id, name: payload.name, description: payload.description, logoUrl: payload.logoUrl });
      } else {
        await createProject(payload);
      }

      // Clear states after successful save
      setLogoFile(null);
      setNewLogoUrl(null);
      setLogoChanged(false);

      closeModal();
    } catch (error: any) {
      // Error already handled by useProject hook
      console.error("Save project error:", error);
    }
  };

  // Check if there are any changes to save
  const hasChanges = form.formState.isDirty || logoChanged;

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit Project" : "Create New Project"}</DialogTitle>
          <DialogDescription>
            {isEditMode ? "Update your project information" : "Create a new project to organize your tasks"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Project Logo */}
          <div className="space-y-2">
            <Label>Project Logo (Optional)</Label>
            <div className="flex justify-center">
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
                  <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-black/0 transition-colors duration-200 group-hover:bg-black/30">
                    {isUploading ? (
                      <Loader2 className="h-6 w-6 animate-spin text-white" />
                    ) : (
                      <Camera className="h-6 w-6 text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                    )}
                  </div>

                  {/* Logo Display */}
                  <div className="flex size-32 items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
                    {previewUrl || newLogoUrl || project?.logoUrl ? (
                      <img
                        src={previewUrl || newLogoUrl || project?.logoUrl}
                        alt="Project logo"
                        className="h-full w-full rounded-lg object-cover"
                      />
                    ) : (
                      <div className="text-center">
                        <Upload className="mx-auto mb-2 h-8 w-8 text-gray-400" />
                        <p className="text-sm text-gray-500">Upload Logo</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Dropzone popup shown only after clicking logo */}
                {showDropzone && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
                    <div ref={dropzoneRef} className="w-96 rounded-lg border border-gray-200 bg-white p-6 shadow-xl">
                      <div className="mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">{isEditMode ? "Change" : "Add"} Project Logo</h3>
                        <p className="text-sm text-gray-500">Upload a new logo for your project</p>
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
                              <Upload className="h-6 w-6 text-gray-600" />
                            </div>
                            <div className="text-sm font-medium text-gray-900">Drop your logo here, or browse</div>
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
          </div>

          {/* Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Project Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Project Name <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="e.g., Website Redesign"
                        maxLength={100}
                        className="border-gray-200 bg-white focus:border-gray-400"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Add a brief description of the project..."
                        rows={4}
                        maxLength={500}
                        className="border-gray-200 bg-white focus:border-gray-400"
                      />
                    </FormControl>
                    <div className="flex justify-between">
                      <FormMessage />
                      <p className="text-xs text-gray-500">{(field.value || "").length}/500</p>
                    </div>
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={closeModal}
            disabled={isCreatingProject || isUpdatingProject}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={form.handleSubmit(onSubmit)}
            disabled={isCreatingProject || isUpdatingProject || (isEditMode && !hasChanges) || (!isEditMode && !form.formState.isDirty)}
            className="bg-linear-to-r from-[#D60808] to-[#700404] transition-colors duration-500 hover:cursor-pointer hover:bg-linear-to-r hover:from-[#700404] hover:to-[#D60808]"
          >
            {isCreatingProject || isUpdatingProject ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isEditMode ? "Updating..." : "Creating..."}
              </>
            ) : isEditMode ? (
              "Update Project"
            ) : (
              "Create Project"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
