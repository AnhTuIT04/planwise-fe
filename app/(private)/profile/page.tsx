"use client";

import { useEffect, useRef, useState } from "react";
import { Camera } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";

import { useAuth } from "@/components/providers/auth-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { uploadSingleApi } from "@/services/apis/upload/upload-single.api";
import { updateProfileApi } from "@/services/apis/auth/update-profile.api";

const profileSchema = z.object({
  fullname: z.string().trim().min(1, "Full name is required").max(100, "Full name must be less than 100 characters"),
});
type ProfileFormData = z.infer<typeof profileSchema>;

function getInitials(fullname: string) {
  return fullname
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function ProfilePage() {
  const { user, setUser } = useAuth();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: { fullname: "" },
  });

  useEffect(() => {
    if (user) {
      form.reset({ fullname: user.fullname });
    }
  }, [user, form]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  if (!user) {
    return (
      <div className="my-1 ml-1 flex min-h-0 flex-1 flex-col overflow-hidden rounded-l-[6px] border-y border-l border-[#dcdcdc] bg-[#f8f8f9] shadow-sm" />
    );
  }

  const onPickFile = () => fileInputRef.current?.click();

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      return;
    }

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPendingFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const onSubmit = async (data: ProfileFormData) => {
    const payload: { fullname?: string; avatarUrl?: string } = {};

    if (data.fullname !== user.fullname) {
      payload.fullname = data.fullname;
    }

    try {
      if (pendingFile) {
        payload.avatarUrl = await uploadSingleApi({ file: pendingFile });
      }

      if (Object.keys(payload).length === 0) {
        toast.info("No changes to save.");
        return;
      }

      const res = await updateProfileApi(payload);
      setUser(res.toUser());

      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPendingFile(null);
      setPreviewUrl(null);

      toast.success("Profile updated.");
    } catch (error: any) {
      toast.error(error?.message || "Failed to update profile.");
    }
  };

  const displayedAvatar = previewUrl || user.avatarUrl || undefined;
  const fallback = getInitials(user.fullname);
  const isSaving = form.formState.isSubmitting;

  return (
    <div className="my-1 ml-1 flex min-h-0 flex-1 flex-col overflow-y-auto rounded-l-[6px] border-y border-l border-[#dcdcdc] bg-[#f8f8f9] shadow-sm">
      <div className="mx-auto w-full max-w-xl p-8">
        <h1 className="mb-1 text-2xl font-semibold text-gray-900">Profile</h1>
        <p className="mb-8 text-sm text-gray-500">Update your personal information.</p>

        <div className="mb-8 flex items-center gap-5">
          <button
            type="button"
            onClick={onPickFile}
            className="group relative cursor-pointer rounded-full"
            aria-label="Change profile photo"
          >
            <Avatar className="size-20">
              <AvatarImage src={displayedAvatar} alt={user.fullname} />
              <AvatarFallback className="bg-[#d8d8d8] text-lg">{fallback}</AvatarFallback>
            </Avatar>
            <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
              <Camera className="size-5 text-white" />
            </span>
          </button>

          <div className="flex flex-col gap-1">
            <Button
              type="button"
              variant="outline"
              onClick={onPickFile}
              className="h-9 w-fit cursor-pointer text-sm"
            >
              Change photo
            </Button>
            <span className="text-xs text-gray-500">PNG or JPG. Click the avatar to pick a new image.</span>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onFileChange}
          />
        </div>

        <form id="profile-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" noValidate>
          <FieldGroup>
            <Controller
              name="fullname"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field
                  data-invalid={fieldState.invalid}
                  className="data-[invalid=true]:[&_input]:border-red-500 data-[invalid=true]:[&_input]:text-black data-[invalid=true]:[&_input]:caret-black"
                >
                  <FieldLabel className="flex gap-2 text-sm font-semibold">
                    <span className="text-black">Full name</span>
                    <span className="flex gap-0.5">
                      <span className="text-red-500">*</span>
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </span>
                  </FieldLabel>
                  <Input
                    type="text"
                    placeholder="Your full name"
                    className="py-5 shadow-none focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:outline-none"
                    autoComplete="name"
                    {...field}
                  />
                </Field>
              )}
            />

            <Field>
              <FieldLabel className="flex gap-2 text-sm font-semibold">
                <span className="text-black">Email</span>
              </FieldLabel>
              <Input
                type="email"
                value={user.email}
                disabled
                readOnly
                className="cursor-not-allowed py-5 text-gray-500 shadow-none"
              />
            </Field>
          </FieldGroup>

          <div className="flex justify-end">
            <Button
              type="submit"
              className="h-11 w-32 cursor-pointer bg-linear-to-r from-[#D60808] to-[#700404] font-medium text-white transition-colors duration-500 hover:bg-linear-to-r hover:from-[#700404] hover:to-[#D60808]"
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
