"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckCircle,AlertCircle } from "lucide-react";
import { useProject } from "@/hooks/useProject";
import { useAuth } from "@/hooks/useAuth";
import { useMembers } from "@/hooks/useMembersManagement";
export default function InviteContent() {
    const searchParams = useSearchParams();
    const projectId = searchParams.get("projectId") || '';
    console.log("Project ID from URL:", projectId);
    // const roleId = searchParams.get("roleId");
    const router = useRouter();

    const { project, inviteMemberProject, responseInviteProject } = useProject({ projectId: projectId || undefined });
    const { user, isLoading: authLoading } = useAuth();
    const { members } = useMembers(projectId, '', 1, 100);
    console.log("Members:", members);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [authRequired, setAuthRequired] = useState(false);
    const [isAlreadyMember, setIsAlreadyMember] = useState(false);

    // Kiểm tra authentication - nếu chưa login thì hiển thị thông báo
    useEffect(() => {
        if (!authLoading && !user) {
            setAuthRequired(true);
        }
    }, [authLoading, user]);

    useEffect(() => {
        if (user && project && projectId) {
            const isMember = members?.some(
                (member: any) => member.id === user.id
            );
            console.log("Is user a member?", isMember);
            console.log("Current User ID:", user.id);
            console.log("Project Members IDs:", members?.map((m: any) => m.id));
            if (isMember) {
                setIsAlreadyMember(true);
                router.push(`/projects/${projectId}`);
            }
        }
    }, [user, project, projectId, router]);

    const handleJoin = async () => {
        if (!projectId) {
            setError("Project ID is missing");
            return;
        }

        if (!user?.email) {
            setError("User email not found");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            // await inviteMemberProject({
            //     projectId: projectId,
            //     email: user.email,
            //     roleId: roleId || ''
            // });
            await responseInviteProject({
                projectId: projectId,
                response: "ACCEPTED",
            });
            setSuccess(true);
            
            // Redirect sau 2 giây
            setTimeout(() => {
                router.push(`/projects/${projectId}`);
            }, 2000);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to join project");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignIn = () => {
        const currentUrl = `/invite-member?projectId=${projectId}`;
        router.push(`/sign-in?redirect=${encodeURIComponent(currentUrl)}`);
    };

    const handleDecline = async () => {
        if (!projectId) {
            setError("Project ID is missing");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            await responseInviteProject({
                projectId: projectId,
                response: "DECLINED",
            });
            router.push("/");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to decline invitation");
        } finally {
            setIsLoading(false);
        }
    };
    // if (!user) {
    //     return (
    //         <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-4">
    //             <Card className="w-full max-w-md shadow-lg">
    //                 <CardContent className="flex items-center justify-center py-8">
    //                     <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
    //                 </CardContent>
    //             </Card>
    //         </div>
    //     );
    // }
    if (isAlreadyMember) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-4">
                <Card className="w-full max-w-md shadow-lg">
                    <CardHeader className="text-center">
                        <div className="flex justify-center mb-4">
                            <CheckCircle className="h-12 w-12 text-green-500" />
                        </div>
                        <CardTitle className="text-green-600">
                            Already a Member
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                        <p className="text-gray-600 mb-4">
                            You are already a member of <strong>{project?.project.name}</strong>
                        </p>
                        <p className="text-sm text-gray-500">
                            Redirecting to project...
                        </p>
                    </CardContent>
                </Card>
            </div>
        );
    }
    if (authRequired) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-4">
                <Card className="w-full max-w-md shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-2xl">Sign In Required</CardTitle>
                        <CardDescription>
                            You need to sign in to accept this project invitation
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
                            <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-blue-700">
                                Please sign in with your account to accept the invitation
                            </p>
                        </div>

                        <Button
                            onClick={handleSignIn}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            Sign In
                        </Button>

                        <Button
                            variant="outline"
                            onClick={() => router.push("/")}
                            className="w-full"
                        >
                            Go Back
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }
    // if (!project) {
    //     return (
    //         <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-4">
    //             <Card className="w-full max-w-md shadow-lg">
    //                 <CardContent className="flex items-center justify-center py-8">
    //                     <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
    //                 </CardContent>
    //             </Card>
    //         </div>
    //     );
    // }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-4">
            <Card className="w-full max-w-md shadow-lg">
                {success ? (
                    <>
                        <CardHeader className="text-center">
                            <div className="flex justify-center mb-4">
                                <CheckCircle className="h-12 w-12 text-green-500" />
                            </div>
                            <CardTitle className="text-green-600">
                                Successfully Joined!
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-center">
                            <p className="text-gray-600 mb-2">
                                You have successfully joined <strong>{project?.project.name}</strong>
                            </p>
                            <p className="text-sm text-gray-500">
                                Redirecting to project...
                            </p>
                        </CardContent>
                    </>
                ) : (
                    <>
                        <CardHeader>
                            <CardTitle className="text-2xl">Join Project</CardTitle>
                            <CardDescription>
                                You've been invited to join a project
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">
                                        Project Name
                                    </p>
                                    <p className="text-lg font-semibold text-gray-900">
                                        {project?.project.name}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-600">
                                        Invited by
                                    </p>
                                    <p className="text-gray-900">{user?.fullname}</p>
                                </div>
                            </div>

                            {error && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                    <p className="text-red-700 text-sm">{error}</p>
                                </div>
                            )}

                            <Button
                                onClick={handleJoin}
                                disabled={isLoading || !projectId}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Joining...
                                    </>
                                ) : (
                                    "Accept & Join Project"
                                )}
                            </Button>

                            <Button
                                variant="outline"
                                onClick={handleDecline}
                                className="w-full"
                            >
                                Decline
                            </Button>
                        </CardContent>
                    </>
                )}
            </Card>
        </div>
    );
}
