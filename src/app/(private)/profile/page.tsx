"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Calendar, Save, Loader2 } from "lucide-react";

import { useAuth } from "@/components/providers/auth-provider";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { AvatarUpload } from "@/components/ui/avatar-upload";

const profileSchema = z.object({
  fullname: z.string().min(2).max(50),
  email: z.string().email(),
});
type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { user, updateProfile, isUpdatingProfile } = useAuth();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [newAvatarUrl, setNewAvatarUrl] = useState<string | null>(null);
  const [avatarChanged, setAvatarChanged] = useState(false);

  // Handler for avatar URL change with logging
  const handleAvatarUrlChange = (url: string) => {
    console.log("handleAvatarUrlChange called with:", url);
    console.log("Setting newAvatarUrl to:", url);
    setNewAvatarUrl(url);
    setAvatarChanged(true); // Mark avatar as changed
    console.log("newAvatarUrl should now be:", url);
  };

  // Debug effect to watch newAvatarUrl changes
  useEffect(() => {
    console.log("newAvatarUrl state changed to:", newAvatarUrl);
  }, [newAvatarUrl]);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: { fullname: "", email: "" },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        fullname: user.fullname,
        email: user.email,
      });
    }
  }, [user, form]);

  const onSubmit = async (data: ProfileFormData) => {
    if (!user) return;

    try {
      console.log("Submit form with:", {
        fullname: data.fullname,
        newAvatarUrl,
        currentAvatar: user.avatarUrl,
      });

      // Prepare update payload
      const updatePayload: { fullname: string; avatarUrl?: string } = {
        fullname: data.fullname,
      };

      // Only include avatarUrl if it has changed
      if (newAvatarUrl) {
        updatePayload.avatarUrl = newAvatarUrl;
      }

      console.log("Calling updateProfile with payload:", updatePayload);
      await updateProfile(updatePayload);

      // Clear states after successful update
      setAvatarFile(null);
      setNewAvatarUrl(null);
      setAvatarChanged(false);
      form.reset({ fullname: data.fullname, email: user.email });
    } catch (error) {
      // Error is already handled by the mutation in auth provider
      console.error("Failed to update profile:", error);
    }
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  if (!user) return null;

  // Check if there are any changes to save
  const hasChanges = form.formState.isDirty || avatarChanged;

  return (
    <div className="flex min-h-screen w-full items-start justify-center bg-[#fafafa] py-12">
      <div className="flex w-full max-w-6xl flex-col gap-8 px-4 md:flex-row">
        {/* LEFT CARD */}
        <Card className="flex w-full items-center justify-center rounded-2xl border border-gray-100 shadow-md md:w-1/3">
          <CardContent className="flex flex-col items-center p-6 text-center">
            <AvatarUpload
              currentAvatarUrl={user.avatarUrl}
              newAvatarUrl={newAvatarUrl}
              onAvatarChange={(file) => {
                setAvatarFile(file);
                if (file) setAvatarChanged(true);
              }}
              onAvatarUrlChange={handleAvatarUrlChange}
              fullname={user.fullname}
              size="xl"
            />
            <h2 className="mt-4 text-lg font-semibold text-gray-900">{user.fullname}</h2>
            <div className="mt-1 flex items-center gap-2 text-sm text-gray-600">
              <Mail className="h-4 w-4" />
              {user.email}
            </div>

            <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4" />
              Member since {formatDate(user.createdAt)}
            </div>
          </CardContent>
        </Card>

        {/* RIGHT CARD */}
        <Card className="w-full rounded-2xl border border-gray-100 shadow-md md:w-2/3">
          <CardContent className="p-6">
            <h3 className="mb-1 text-lg font-semibold text-gray-900">Edit Profile</h3>
            <p className="mb-6 text-sm text-gray-500">Update your profile information below.</p>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="fullname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="border-gray-200 bg-white focus:border-gray-400"
                          placeholder="Enter your full name"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input {...field} disabled className="border-gray-200 bg-gray-100 text-gray-500" />
                      </FormControl>
                      <p className="mt-1 text-xs text-gray-500">
                        Email cannot be changed. Contact support if you need to update it.
                      </p>
                    </FormItem>
                  )}
                />

                <div>
                  <Label>Account Status</Label>
                  <div className="mt-2 flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 p-3">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Verification Status</p>
                      <p className="text-xs text-gray-600">
                        {user.verified
                          ? "Your account is verified and ready to use."
                          : "Please verify your email to unlock all features."}
                      </p>
                    </div>
                    <Badge variant={user.verified ? "secondary" : "destructive"} className="bg-green-400 px-3 py-1">
                      {user.verified ? "Verified" : "Pending"}
                    </Badge>
                  </div>
                </div>

                <div className="flex justify-end border-t border-gray-200 pt-6">
                  <Button
                    type="submit"
                    disabled={isUpdatingProfile || !hasChanges}
                    className="flex items-center gap-2 rounded-md bg-linear-to-r from-[#D60808] to-[#700404] px-5 py-2 text-white transition-colors duration-500 hover:bg-linear-to-r hover:from-[#700404] hover:to-[#D60808]"
                  >
                    {isUpdatingProfile ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
