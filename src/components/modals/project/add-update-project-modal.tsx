"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Upload } from "lucide-react";

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
import useModal from "@/hooks/useModal";
import { useProject } from "@/hooks/useProject";
import { IProject } from "@/types/project.type";

export default function AddUpdateProjectModal() {
  const { data, isOpen, closeModal, isSubmitting } = useModal<"ADD_UPDATE_PROJECT">();
  const { action, project } = data;
  
  const { createProject, updateProject, isCreatingProject, isUpdatingProject } = useProject();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const isEditMode = action === "UPDATE" && !!project;

  // Initialize form when modal opens
  useEffect(() => {
    if (isOpen && project) {
      setName(project.name || "");
      setDescription(project.description || "");
      setLogoUrl(project.logoUrl || "");
      setLogoFile(null);
    } else {
      // Reset form for new project
      setName("");
      setDescription("");
      setLogoUrl("");
      setLogoFile(null);
    }
  }, [isOpen, project]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      setLogoFile(file);
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setLogoUrl(previewUrl);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Project name is required");
      return;
    }

    try {
      let uploadedLogoUrl = logoUrl;

      // Upload logo if new file selected
      if (logoFile) {
        // TODO: Call upload API
        // const formData = new FormData();
        // formData.append("file", logoFile);
        // const response = await uploadImageAPI(formData);
        // uploadedLogoUrl = response.url;
      }

      const payload = {
        name,
        description: description || undefined,
        logoUrl: uploadedLogoUrl || undefined,
      };

      if (isEditMode && project) {
        await updateProject({ id: project.id, payload });
      } else {
        await createProject(payload);
      }

      closeModal();
    } catch (error: any) {
      // Error already handled by useProject hook
      console.error("Save project error:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit Project" : "Create New Project"}</DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update your project information"
              : "Create a new project to organize your tasks"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Project Logo */}
          <div className="space-y-2">
            <Label>Project Logo (Optional)</Label>
            <div className="flex items-center gap-4">
              {logoUrl && (
                <div className="relative h-20 w-20 overflow-hidden rounded-lg border">
                  <img
                    src={logoUrl}
                    alt="Project logo"
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              <div>
                <input
                  type="file"
                  id="logo-upload"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById("logo-upload")?.click()}
                  className="gap-2"
                >
                  <Upload className="h-4 w-4" />
                  {logoUrl ? "Change Logo" : "Upload Logo"}
                </Button>
                <p className="mt-1 text-xs text-gray-500">
                  PNG, JPG up to 5MB
                </p>
              </div>
            </div>
          </div>

          {/* Project Name */}
          <div className="space-y-2">
            <Label htmlFor="name">
              Project Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Website Redesign"
              maxLength={100}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id={project?.id}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a brief description of the project..."
              rows={4}
              maxLength={500}
            />
            <p className="text-xs text-gray-500 text-right">
              {description.length}/500
            </p>
          </div>
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
            onClick={handleSave}
            disabled={isCreatingProject || isUpdatingProject}
          >
            {isCreatingProject || isUpdatingProject
              ? isEditMode
                ? "Updating..."
                : "Creating..."
              : isEditMode
              ? "Update"
              : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
