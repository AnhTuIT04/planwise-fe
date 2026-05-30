"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Paperclip, Trash2, CornerDownRight, Reply } from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  getTaskCommentsApi,
  createTaskCommentApi,
  deleteTaskCommentApi,
} from "@/services/apis/comment/comment.api";
import { IComment } from "@/types/comment.type";

interface CommentSectionProps {
  taskId: string;
}

export default function CommentSection({ taskId }: CommentSectionProps) {
  const { user: currentUser } = useAuth();
  const [newCommentContent, setNewCommentContent] = useState("");
  const [replyToId, setReplyToId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");

  const { data: comments = [], refetch, isLoading } = useQuery({
    queryKey: ["comments", taskId],
    queryFn: () => getTaskCommentsApi(taskId),
    enabled: !!taskId,
  });

  const createCommentMutation = useMutation({
    mutationFn: (payload: { content: string; parentId?: string }) =>
      createTaskCommentApi(taskId, payload),
    onSuccess: () => {
      setNewCommentContent("");
      setReplyContent("");
      setReplyToId(null);
      refetch();
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to post comment");
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: (commentId: string) => deleteTaskCommentApi(taskId, commentId),
    onSuccess: () => {
      toast.success("Comment deleted");
      refetch();
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete comment");
    },
  });

  const handlePostComment = () => {
    if (!newCommentContent.trim()) return;
    createCommentMutation.mutate({ content: newCommentContent });
  };

  const handlePostReply = (parentId: string) => {
    if (!replyContent.trim()) return;
    createCommentMutation.mutate({ content: replyContent, parentId });
  };

  const handleDeleteComment = (commentId: string) => {
    if (confirm("Are you sure you want to delete this comment?")) {
      deleteCommentMutation.mutate(commentId);
    }
  };

  function formatCommentDate(dateStr: string) {
    const date = new Date(dateStr);
    const time = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
    const month = date.toLocaleString("en-US", { month: "short" });
    const day = date.getDate();

    let suffix = "th";
    if (day === 1 || day === 21 || day === 31) suffix = "st";
    else if (day === 2 || day === 22) suffix = "nd";
    else if (day === 3 || day === 23) suffix = "rd";

    return `${time}, ${month} ${day}${suffix}`;
  }

  // Generate unique initial fallback color based on name length
  const getAvatarBg = (name: string) => {
    const colors = ["bg-[#7A3E3E]", "bg-[#5D4037]", "bg-[#4E342E]", "bg-[#3E2723]", "bg-[#8D6E63]"];
    const index = name.length % colors.length;
    return colors[index];
  };

  return (
    <div className="w-[calc(100%+4rem)] border-t border-[#f0f0f0] px-8 pt-6 mt-6">
      {/* Input section */}
      <div className="flex items-start gap-3 mb-6">
        <Avatar className="h-8 w-8 mt-1">
          <AvatarImage src={currentUser?.avatarUrl || undefined} alt={currentUser?.fullname} />
          <AvatarFallback className={`${currentUser ? getAvatarBg(currentUser.fullname) : "bg-gray-500"} text-[12px] text-white font-medium`}>
            {currentUser?.fullname?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 flex flex-col gap-2">
          <div className="relative flex items-center border border-[#dcdcdc] rounded-[6px] bg-white pr-9 focus-within:border-[#2ca7ff] focus-within:shadow-[0_0_0_1px_#2ca7ff]">
            <textarea
              value={newCommentContent}
              onChange={(e) => setNewCommentContent(e.target.value)}
              placeholder="Comment..."
              rows={1}
              className="w-full resize-none border-none bg-transparent py-2.5 pl-3 pr-3 text-[14px] outline-none placeholder-[#a0a0a0] text-[#413f39] min-h-[40px] leading-5"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handlePostComment();
                }
              }}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
              <Paperclip className="size-4.5 text-[#b4b4b4] hover:text-[#413f39] cursor-pointer" />
            </div>
          </div>
          {newCommentContent.trim() && (
            <div className="flex justify-end">
              <Button
                size="sm"
                onClick={handlePostComment}
                className="bg-[#2ca7ff] hover:bg-[#1a96eb] text-white text-[12px] h-8 px-4 rounded-[4px] font-medium"
                disabled={createCommentMutation.isPending}
              >
                Comment
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Comments List */}
      {isLoading ? (
        <div className="text-center py-4 text-xs text-[#a0a0a0]">Loading comments...</div>
      ) : comments.length === 0 ? (
        <div className="text-center py-4 text-xs text-[#a0a0a0]">No comments yet.</div>
      ) : (
        <div className="space-y-5">
          {comments.map((comment: IComment) => {
            const isAuthor = comment.author.id === currentUser?.id;
            return (
              <div key={comment.id} className="group/parent">
                {/* Parent Comment */}
                <div className="flex items-start gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={comment.author.avatarUrl || undefined} alt={comment.author.fullname} />
                    <AvatarFallback className={`${getAvatarBg(comment.author.fullname)} text-[12px] text-white font-medium`}>
                      {comment.author.fullname.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2">
                      <span className="text-[14px] font-semibold text-[#413f39]">
                        {comment.author.fullname}
                      </span>
                      <span className="text-[11px] text-[#a0a0a0]">
                        • {formatCommentDate(comment.createdAt)}
                      </span>
                    </div>

                    <p className="text-[14px] text-[#413f39] mt-1 break-words leading-5">
                      {comment.content}
                    </p>

                    {/* Actions */}
                    <div className="flex items-center gap-3 mt-1.5 opacity-0 group-hover/parent:opacity-100 transition-opacity">
                      <button
                        onClick={() => {
                          setReplyToId(replyToId === comment.id ? null : comment.id);
                          setReplyContent("");
                        }}
                        className="text-[12px] text-[#888] hover:text-[#2ca7ff] flex items-center gap-1 font-medium"
                      >
                        <Reply className="size-3" />
                        Reply
                      </button>
                      {isAuthor && (
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          className="text-[12px] text-[#888] hover:text-red-500 flex items-center gap-1 font-medium"
                        >
                          <Trash2 className="size-3" />
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Replies Container */}
                <div className="pl-11 mt-3 space-y-4">
                  {comment.replies && comment.replies.map((reply: IComment) => {
                    const isReplyAuthor = reply.author.id === currentUser?.id;
                    return (
                      <div key={reply.id} className="flex items-start gap-3 group/reply">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={reply.author.avatarUrl || undefined} alt={reply.author.fullname} />
                          <AvatarFallback className={`${getAvatarBg(reply.author.fullname)} text-[12px] text-white font-medium`}>
                            {reply.author.fullname.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[14px] font-semibold text-[#413f39]">
                              {comment.author.fullname}
                            </span>
                            <Reply className="size-3 text-[#a0a0a0]" />
                            <span className="text-[14px] font-semibold text-[#413f39]">
                              {reply.author.fullname}
                            </span>
                            <span className="text-[11px] text-[#a0a0a0]">
                              • {formatCommentDate(reply.createdAt)}
                            </span>
                          </div>

                          <p className="text-[14px] text-[#413f39] mt-1 break-words leading-5">
                            {reply.content}
                          </p>

                          {/* Reply Actions */}
                          <div className="flex items-center gap-3 mt-1.5 opacity-0 group-hover/reply:opacity-100 transition-opacity">
                            <button
                              onClick={() => {
                                setReplyToId(replyToId === comment.id ? null : comment.id);
                                setReplyContent("");
                              }}
                              className="text-[12px] text-[#888] hover:text-[#2ca7ff] flex items-center gap-1 font-medium"
                            >
                              <Reply className="size-3" />
                              Reply
                            </button>
                            {isReplyAuthor && (
                              <button
                                onClick={() => handleDeleteComment(reply.id)}
                                className="text-[12px] text-[#888] hover:text-red-500 flex items-center gap-1 font-medium"
                              >
                                <Trash2 className="size-3" />
                                Delete
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Inline Reply Input */}
                  {replyToId === comment.id && (
                    <div className="flex items-start gap-3 mt-3">
                      <CornerDownRight className="size-4 text-[#b4b4b4] mt-2.5 shrink-0" />
                      <Avatar className="h-8 w-8 mt-1 shrink-0">
                        <AvatarImage src={currentUser?.avatarUrl || undefined} alt={currentUser?.fullname} />
                        <AvatarFallback className={`${currentUser ? getAvatarBg(currentUser.fullname) : "bg-gray-500"} text-[12px] text-white font-medium`}>
                          {currentUser?.fullname?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 flex flex-col gap-2">
                        <div className="relative flex items-center border border-[#dcdcdc] rounded-[6px] bg-white pr-9 focus-within:border-[#2ca7ff] focus-within:shadow-[0_0_0_1px_#2ca7ff]">
                          <textarea
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            placeholder="Reply..."
                            rows={1}
                            className="w-full resize-none border-none bg-transparent py-2.5 pl-3 pr-3 text-[14px] outline-none placeholder-[#a0a0a0] text-[#413f39] min-h-[40px] leading-5"
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handlePostReply(comment.id);
                              }
                            }}
                          />
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
                            <Paperclip className="size-4.5 text-[#b4b4b4] hover:text-[#413f39] cursor-pointer" />
                          </div>
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setReplyToId(null)}
                            className="text-[12px] h-8 px-3 rounded-[4px]"
                          >
                            Cancel
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handlePostReply(comment.id)}
                            className="bg-[#2ca7ff] hover:bg-[#1a96eb] text-white text-[12px] h-8 px-4 rounded-[4px] font-medium"
                            disabled={createCommentMutation.isPending}
                          >
                            Reply
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
