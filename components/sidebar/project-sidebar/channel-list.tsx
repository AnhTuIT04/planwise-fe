"use client";

import { useState } from "react";
import { Hash, Volume2, Video, Plus, ChevronDown, ChevronRight, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useChannel } from "@/hooks/use-channel";
import { IChannel } from "@/types/channel.type";
import { useRouter, usePathname } from "next/navigation";

interface ChannelListProps {
  projectId: string;
}

const channelTypeIcons = {
  TEXT: Hash,
  VOICE: Volume2,
  VIDEO: Video,
};

export function ChannelList({ projectId }: ChannelListProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { channels, isLoading, createChannel, isCreating, updateChannel, deleteChannel, isDeleting } = useChannel({
    projectId,
  });

  const [isExpanded, setIsExpanded] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newChannelName, setNewChannelName] = useState("");
  const [channelType, setChannelType] = useState<"TEXT" | "VOICE" | "VIDEO">("TEXT");

  const [renameTarget, setRenameTarget] = useState<IChannel | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<IChannel | null>(null);

  const handleCreateChannel = () => {
    if (!newChannelName.trim()) return;

    createChannel({
      projectId,
      name: newChannelName.trim(),
      type: channelType,
    });

    setNewChannelName("");
    setChannelType("TEXT");
    setIsDialogOpen(false);
  };

  const handleRename = () => {
    if (!renameTarget) return;
    const trimmed = renameValue.trim();
    if (!trimmed || trimmed === renameTarget.name) {
      setRenameTarget(null);
      return;
    }
    updateChannel({ channelId: renameTarget.id, name: trimmed });
    setRenameTarget(null);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    const activeChannelId = pathname.split("/channels/")[1];
    deleteChannel({ channelId: deleteTarget.id, projectId });
    if (activeChannelId === deleteTarget.id) {
      router.push(`/projects/${projectId}/overview`);
    }
    setDeleteTarget(null);
  };

  const handleChannelClick = (channelId: string) => {
    router.push(`/projects/${projectId}/channels/${channelId}`);
  };

  const activeChannelId = pathname.split("/channels/")[1];

  if (isLoading) {
    return (
      <div className="space-y-2 px-2">
        <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
        <div className="h-8 w-full animate-pulse rounded bg-gray-200" />
        <div className="h-8 w-full animate-pulse rounded bg-gray-200" />
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between px-2 py-1">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1 text-xs font-semibold text-gray-500 uppercase hover:text-gray-700"
        >
          {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          <span>Channels</span>
        </button>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" className="h-5 w-5 hover:bg-gray-200">
              <Plus size={14} />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Channel</DialogTitle>
              <DialogDescription>
                Add a new channel to your project. Choose between text, voice, or video.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="channel-name">Channel Name</Label>
                <Input
                  id="channel-name"
                  placeholder="general"
                  value={newChannelName}
                  onChange={(e) => setNewChannelName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="channel-type">Channel Type</Label>
                <Select
                  value={channelType}
                  onValueChange={(value: "TEXT" | "VOICE" | "VIDEO") => setChannelType(value)}
                >
                  <SelectTrigger id="channel-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TEXT">
                      <div className="flex items-center gap-2">
                        <Hash size={16} />
                        <span>Text</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="VOICE">
                      <div className="flex items-center gap-2">
                        <Volume2 size={16} />
                        <span>Voice</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="VIDEO">
                      <div className="flex items-center gap-2">
                        <Video size={16} />
                        <span>Video</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isCreating}>
                Cancel
              </Button>
              <Button onClick={handleCreateChannel} disabled={isCreating || !newChannelName.trim()}>
                {isCreating ? "Creating..." : "Create Channel"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {isExpanded && (
        <div className="space-y-0.5">
          {channels.map((channel) => {
            const Icon = channelTypeIcons[channel.type];
            const isActive = activeChannelId === channel.id;

            return (
              <div key={channel.id} className="group/channel relative">
                <Button
                  variant="ghost"
                  onClick={() => handleChannelClick(channel.id)}
                  className={`w-full cursor-pointer gap-2 rounded-[6px] pr-8 text-sm font-semibold text-[#787878]! transition hover:bg-[#dcdcdc] ${
                    isActive ? "bg-[#dcdcdc]" : ""
                  } justify-start`}
                >
                  <Icon size={16} />
                  <span className="truncate">{channel.name}</span>
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      onClick={(e) => e.stopPropagation()}
                      aria-label={`Channel ${channel.name} options`}
                      className="absolute top-1/2 right-1.5 -translate-y-1/2 rounded p-1 text-gray-500 opacity-0 transition group-hover/channel:opacity-100 hover:bg-gray-200 focus-visible:opacity-100"
                    >
                      <MoreHorizontal size={14} />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenuItem
                      onClick={() => {
                        setRenameValue(channel.name);
                        setRenameTarget(channel);
                      }}
                    >
                      <Pencil size={14} className="mr-2" />
                      Rename
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-600 focus:text-red-600"
                      onClick={() => setDeleteTarget(channel)}
                    >
                      <Trash2 size={14} className="mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            );
          })}
          {channels.length === 0 && <p className="px-2 py-2 text-xs text-gray-400">No channels yet</p>}
        </div>
      )}

      <Dialog open={!!renameTarget} onOpenChange={(open) => !open && setRenameTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Channel</DialogTitle>
            <DialogDescription>Pick a new name for #{renameTarget?.name}.</DialogDescription>
          </DialogHeader>
          <div className="py-2">
            <Label htmlFor="rename-channel-name" className="sr-only">
              Channel name
            </Label>
            <Input
              id="rename-channel-name"
              autoFocus
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleRename();
              }}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRenameTarget(null)}>
              Cancel
            </Button>
            <Button onClick={handleRename} disabled={!renameValue.trim()}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete channel?</DialogTitle>
            <DialogDescription>
              {`This permanently removes #${deleteTarget?.name} and its messages. This action cannot be undone.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)} disabled={isDeleting}>
              Cancel
            </Button>
            <Button
              className="bg-red-600 text-white hover:bg-red-700"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting…" : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
