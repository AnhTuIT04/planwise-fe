"use client";

import { useState, useEffect } from "react";
import { format, addMinutes } from "date-fns";

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

export default function AddUpdateTaskModal() {
  const { data } = useModal<"ADD_UPDATE_TASK">();
  const { title, description, action, sectionId, task } = data;

  return (
    <DialogContent className="w-[620px] max-w-[620px] rounded-[5px] px-6 py-5">
      <DialogHeader>
        <DialogTitle className="text-red-600">{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>

      <DialogFooter></DialogFooter>
    </DialogContent>
  );
}
