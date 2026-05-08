"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-toastify";
import { Loader2, Upload, Camera } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useProjectMutations } from "@/hooks/use-project";
import { uploadSingleApi } from "@/services/apis/upload/upload-single.api";
import { useProjectModalStore } from "@/stores/project-modal.store";
import CreateRolesStep from "./create-roles-step";
import CreateSectionsStep from "./create-sections-step";
import InviteMembersStep from "./invite-members-step";

const MAX_LOGO_SIZE = 5 * 1024 * 1024;
const ACCEPTED_LOGO_TYPES = ["image/png", "image/jpeg", "image/gif", "image/webp"];

const projectSchema = z.object({
  name: z.string().min(1, "Project name is required").max(100, "Project name must be less than 100 characters"),
  description: z.string().max(500, "Description must be less than 500 characters").optional(),
});

type ProjectFormData = z.infer<typeof projectSchema>;

export default function AddUpdateProjectModal() {
  const isOpen = useProjectModalStore((s) => s.open);
  const mode = useProjectModalStore((s) => s.mode);
  const project = useProjectModalStore((s) => s.project);
  const step = useProjectModalStore((s) => s.step);
  const setStep = useProjectModalStore((s) => s.setStep);
  const setCreatedProjectId = useProjectModalStore((s) => s.setCreatedProjectId);
  const closeModal = useProjectModalStore((s) => s.closeModal);

  const action = mode === "add" ? "ADD" : "UPDATE";
  const isEditMode = action === "UPDATE" && !!project;

  const { createProjectMutation, updateProjectMutation } = useProjectMutations();
  const isCreatingProject = createProjectMutation.isPending;
  const isUpdatingProject = updateProjectMutation.isPending;

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [newLogoUrl, setNewLogoUrl] = useState<string | null>(null);
  const [logoChanged, setLogoChanged] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: { name: "", description: "" },
  });

  const handleFileSelect = async (file: File) => {
    if (!ACCEPTED_LOGO_TYPES.includes(file.type)) {
      toast.error("Unsupported file type. Use PNG, JPG, GIF, or WEBP.");
      return;
    }
    if (file.size > MAX_LOGO_SIZE) {
      toast.error("Image is too large. Max 5MB.");
      return;
    }

    setLogoFile(file);
    setIsUploading(true);

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    try {
      const uploadedUrl = await uploadSingleApi({ file });

      if (uploadedUrl) {
        setNewLogoUrl(uploadedUrl);
        setLogoChanged(true);
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl);
          setPreviewUrl(null);
        }
        toast.success("Logo uploaded successfully");
      } else {
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl);
          setPreviewUrl(null);
        }
        setLogoFile(null);
      }
    } catch {
      toast.error("Failed to upload logo");
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
      setLogoFile(null);
    } finally {
      setIsUploading(false);
    }
  };

  const onFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (file) await handleFileSelect(file);
  };

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  useEffect(() => {
    if (isOpen && project) {
      form.reset({
        name: project.name || "",
        description: project.description || "",
      });
    } else if (isOpen) {
      form.reset({ name: "", description: "" });
      setLogoFile(null);
      setNewLogoUrl(null);
      setLogoChanged(false);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, project]);

  const onSubmit = async (data: ProjectFormData) => {
    try {
      const payload: { name: string; description?: string; logoUrl?: string } = {
        name: data.name,
        description: data.description || undefined,
      };

      if (newLogoUrl) {
        payload.logoUrl = newLogoUrl;
      } else if (isEditMode && project?.logoUrl && !logoChanged) {
        payload.logoUrl = project.logoUrl;
      }

      if (isEditMode && project) {
        await updateProjectMutation.mutateAsync({
          projectId: project.id,
          name: payload.name,
          description: payload.description,
          logoUrl: payload.logoUrl,
        });
        setLogoFile(null);
        setNewLogoUrl(null);
        setLogoChanged(false);
        closeModal();
        return;
      }

      const result = await createProjectMutation.mutateAsync(payload);
      const newId = result?.data?.id;
      if (!newId) {
        toast.error("Project was created but the server response was malformed.");
        closeModal();
        return;
      }
      setCreatedProjectId(newId);
      setLogoFile(null);
      setNewLogoUrl(null);
      setLogoChanged(false);
      setStep("roles");
    } catch (error) {
      console.error("Save project error:", error);
    }
  };

  const hasChanges = form.formState.isDirty || logoChanged;

  const handleDialogChange = (nextOpen: boolean) => {
    if (nextOpen) return;
    closeModal();
  };

  if (!isOpen) return null;

  if (step !== "form") {
    return (
      <Dialog open={isOpen} onOpenChange={handleDialogChange}>
        <DialogContent className="sm:max-w-[640px]">
          {step === "roles" && <CreateRolesStep />}
          {step === "sections" && <CreateSectionsStep />}
          {step === "invite" && <InviteMembersStep />}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogChange}>
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
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={ACCEPTED_LOGO_TYPES.join(",")}
                  className="hidden"
                  onChange={onFileInputChange}
                />
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => !isUploading && fileInputRef.current?.click()}
                  onKeyDown={(e) => {
                    if (!isUploading && (e.key === "Enter" || e.key === " ")) {
                      e.preventDefault();
                      fileInputRef.current?.click();
                    }
                  }}
                  className={`group relative ${isUploading ? "cursor-wait" : "cursor-pointer"}`}
                >
                  <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-black/0 transition-colors duration-200 group-hover:bg-black/30">
                    {isUploading ? (
                      <Loader2 className="h-6 w-6 animate-spin text-white" />
                    ) : (
                      <Camera className="h-6 w-6 text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                    )}
                  </div>

                  <div className="flex size-32 items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
                    {previewUrl || newLogoUrl || project?.logoUrl ? (
                      <img
                        src={previewUrl || newLogoUrl || project?.logoUrl || ""}
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
              </div>
            </div>
          </div>

          {/* Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
            disabled={
              isCreatingProject ||
              isUpdatingProject ||
              isUploading ||
              (isEditMode && !hasChanges) ||
              (!isEditMode && !form.formState.isDirty)
            }
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
