"use client";

import { useEffect, useRef } from "react";
import { toast } from "react-toastify";

import { useTaskModalStore } from "@/stores/task-modal.store";
import { getTaskDetailApi } from "@/services/apis/task/get-task-detail.api";

/**
 * Watches `pendingOpen` on the task modal store. When set (e.g. after a
 * notification click triggers a redirect), this component fetches the full task
 * detail and opens the update task modal with the merged data — so the modal
 * never opens with empty fields while details are still loading.
 */
export default function PendingTaskOpener() {
  const pendingOpen = useTaskModalStore((s) => s.pendingOpen);
  const setPendingOpen = useTaskModalStore((s) => s.setPendingOpen);
  const openModal = useTaskModalStore((s) => s.openModal);
  const handledIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!pendingOpen) {
      handledIdRef.current = null;
      return;
    }
    if (handledIdRef.current === pendingOpen.taskId) return;
    handledIdRef.current = pendingOpen.taskId;

    const { taskId, projectId, sectionId } = pendingOpen;

    getTaskDetailApi(taskId)
      .then((task) => {
        openModal({
          mode: "update",
          projectId,
          sectionId,
          ...task,
        });
      })
      .catch(() => {
        toast.error("Could not open task — it may have been deleted.");
      })
      .finally(() => {
        setPendingOpen(null);
      });
  }, [pendingOpen, openModal, setPendingOpen]);

  return null;
}
