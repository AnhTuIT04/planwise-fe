"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, usePathname } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import {
  Brain,
  Sparkles,
  Send,
  Loader2,
  Check,
  CheckSquare,
  Square,
  ChevronDown,
  Plus,
  Play,
  ListTodo,
  AlertTriangle,
  Settings,
  Trash2,
  ArrowRightLeft,
  ArrowUpDown,
  FolderKanban,
  UserCheck,
  AlertCircle,
  User,
} from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "@/components/providers/auth-provider";
import { useSection, useSectionMutations } from "@/hooks/use-section";
import { useTaskMutations } from "@/hooks/use-task";
import { useTaskModalStore } from "@/stores/task-modal.store";
import { getTaskDetailApi } from "@/services/apis/task/get-task-detail.api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  chatApi,
  ISuggestedTask,
  ISuggestedAction,
  ISuggestedSection,
  IAssignmentSuggestion,
} from "@/services/apis/ai/chat.api";

type Language = "en" | "vi";

const TRANSLATIONS = {
  en: {
    welcomeText: "Hello! I am PlanWise AI. I can help you with:\n1. **Task Breakdown**: Type what needs to be done and I will generate tasks/subtasks.\n2. **Prioritization**: Type 'reorder tasks' or 'prioritize tasks in section X' to sort them by deadline/priority.\n3. **Quick Operations**: You can ask me to delete, complete, or update priority of any task (e.g., 'mark task A as complete').\n4. **Assignment Suggestions**: I can recommend task assignments to members based on roles and skills.",
    placeholder: "Ask anything or get task breakdowns...",
    loading: "PlanWise AI is thinking...",
    errorTitle: "Failed to load response from AI (Error / Timeout)",
    errorDetail: "Please check the API Key in the .env file or try sending the message again when the connection is stable.",
    toastSuccessCreate: "Successfully created {count} task(s)!",
    toastErrorCreate: "Failed to create tasks",
    toastSuccessSection: "Successfully created {count} section(s)!",
    toastErrorSection: "Failed to create sections",
    toastSuccessAssign: "Successfully assigned!",
    toastErrorAssign: "Failed to assign task",
    toastSuccessClaim: "Successfully claimed task!",
    toastErrorClaim: "Failed to claim task",
    toastErrorDetails: "Failed to load task details",
    toastErrorFindSection: "Failed to find section containing this task.",
    toastSuccessStatus: "Updated status of \"{title}\" to {value}",
    toastSuccessPriority: "Updated priority of \"{title}\" to {value}",
    toastSuccessDelete: "Deleted task \"{title}\"",
    toastErrorAction: "Operation failed",
    toastErrorPrioritizeFind: "Failed to find section to prioritize.",
    toastSuccessPrioritize: "Successfully prioritized tasks!",
    toastErrorPrioritize: "Prioritization failed",
    suggestedSections: "Suggested Sections",
    createSections: "Create Suggested Sections",
    creatingSections: "Creating Sections...",
    suggestedTasks: "Suggested Tasks",
    addToDefaultSection: "Add to default Section:",
    newSection: "New Section:",
    creatingTasks: "Creating tasks...",
    createSelectedTasks: "Create Selected Tasks",
    assignmentSuggestions: "Assignment Suggestions",
    assign: "Assign",
    assignBecause: "Assign to **{user}** because: {reason}",
    unassignedTasks: "Unassigned Tasks",
    claim: "Claim",
    suggestedPrioritization: "Suggested Prioritization",
    updatingPositions: "Updating positions...",
    applyPrioritization: "Apply Prioritization",
    suggestedQuickActions: "Suggested Quick Actions",
    apply: "Apply",
    quickActionLandingPage: "Suggest a plan and break down tasks for designing a sales landing page.",
    quickActionPrioritize: "Help me prioritize current tasks based on importance and deadlines.",
    quickActionBtnLandingPage: "Break down landing page tasks",
    quickActionBtnPrioritize: "Prioritize current tasks",
    selectProject: "Please select or open a project...",
    changeStatus: "Change status of \"{title}\" → {value}",
    changePriority: "Change priority of \"{title}\" → {value}",
    deleteTask: "Delete task \"{title}\"",
    clearChatTitle: "Clear chat history",
  },
  vi: {
    welcomeText: "Xin chào! Tôi là PlanWise AI. Tôi có thể giúp bạn:\n1. **Chia nhỏ công việc**: Gõ yêu cầu cần làm và tôi sẽ tạo task/subtask.\n2. **Sắp xếp thứ tự ưu tiên**: Gõ 'sắp xếp lại việc' hoặc 'ưu tiên việc section X' để tự động sắp xếp task theo deadline/độ ưu tiên.\n3. **Thực hiện thao tác nhanh**: Bạn có thể yêu cầu tôi xóa, hoàn thành hoặc thay đổi độ ưu tiên của một task nào đó (ví dụ: 'đánh dấu hoàn thành task A').\n4. **Gợi ý phân công**: AI sẽ đề xuất phân chia công việc cho thành viên dựa vào vai trò và sự phù hợp.",
    placeholder: "Hỏi gì đó hoặc nhờ AI chia nhỏ task...",
    loading: "PlanWise AI đang suy nghĩ...",
    errorTitle: "Không thể tải phản hồi từ AI (Lỗi / Timeout)",
    errorDetail: "Vui lòng kiểm tra API Key trong file .env hoặc thử gửi lại tin nhắn khi mạng ổn định hơn.",
    toastSuccessCreate: "Đã tạo thành công {count} công việc!",
    toastErrorCreate: "Tạo công việc thất bại",
    toastSuccessSection: "Đã tạo thành công {count} sections!",
    toastErrorSection: "Tạo section thất bại",
    toastSuccessAssign: "Đã phân công thành công!",
    toastErrorAssign: "Phân công thất bại",
    toastSuccessClaim: "Đã nhận việc thành công!",
    toastErrorClaim: "Nhận việc thất bại",
    toastErrorDetails: "Không thể tải thông tin công việc",
    toastErrorFindSection: "Không tìm thấy section chứa công việc này.",
    toastSuccessStatus: "Đã chuyển trạng thái \"{title}\" thành {value}",
    toastSuccessPriority: "Đã chuyển độ ưu tiên \"{title}\" thành {value}",
    toastSuccessDelete: "Đã xóa công việc \"{title}\"",
    toastErrorAction: "Thao tác thất bại",
    toastErrorPrioritizeFind: "Không tìm thấy section tương ứng để sắp xếp.",
    toastSuccessPrioritize: "Đã sắp xếp thứ tự ưu tiên các công việc thành công!",
    toastErrorPrioritize: "Sắp xếp thất bại",
    suggestedSections: "Đề xuất tạo Section",
    createSections: "Tạo Section đề xuất",
    creatingSections: "Đang tạo Section...",
    suggestedTasks: "Đề xuất tạo Task",
    addToDefaultSection: "Thêm vào Section mặc định:",
    newSection: "Section mới:",
    creatingTasks: "Đang tạo công việc...",
    createSelectedTasks: "Tạo công việc đã chọn",
    assignmentSuggestions: "Gợi ý phân công thành viên",
    assign: "Gán việc",
    assignBecause: "Gán cho **{user}** vì: {reason}",
    unassignedTasks: "Công việc chưa phân công",
    claim: "Nhận việc",
    suggestedPrioritization: "Đề xuất sắp xếp thứ tự công việc",
    updatingPositions: "Đang cập nhật vị trí...",
    applyPrioritization: "Áp dụng thứ tự ưu tiên",
    suggestedQuickActions: "Thao tác nhanh đề xuất",
    apply: "Áp dụng",
    quickActionLandingPage: "Hãy đề xuất kế hoạch và phân tách task chi tiết cho việc thiết kế trang landing page bán hàng.",
    quickActionPrioritize: "Giúp tôi sắp xếp thứ tự ưu tiên các công việc hiện tại dựa trên mức độ quan trọng và deadline.",
    quickActionBtnLandingPage: "Phân tách task landing page",
    quickActionBtnPrioritize: "Sắp xếp ưu tiên công việc",
    selectProject: "Hãy chọn hoặc mở một dự án...",
    changeStatus: "Đổi trạng thái \"{title}\" → {value}",
    changePriority: "Sửa độ ưu tiên \"{title}\" → {value}",
    deleteTask: "Xóa công việc \"{title}\"",
    clearChatTitle: "Xóa lịch sử trò chuyện",
  }
};

interface IMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  suggestedTasks?: ISuggestedTask[];
  suggestedSections?: ISuggestedSection[];
  prioritizedTaskIds?: string[];
  suggestedActions?: ISuggestedAction[];
  assignmentSuggestions?: IAssignmentSuggestion[];
  unassignedTaskIds?: string[];
}

export default function AiSidebar() {
  const params = useParams<{ projectId?: string }>();
  const pathname = usePathname();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const projectId =
    typeof params?.projectId === "string"
      ? params.projectId
      : pathname?.startsWith("/my-tasks")
        ? user?.workspaceId
        : undefined;

  const { data: sections } = useSection(projectId || "");
  const {
    createTaskMutation,
    updateTaskMutation,
    moveTaskMutation,
    updateTaskStatusMutation,
    deleteTaskMutation,
    assignTaskToUsersMutation,
  } = useTaskMutations();

  const { createSectionMutation } = useSectionMutations();

  const openModal = useTaskModalStore((s) => s.openModal);

  // Language state
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("planwise-chat-lang") as Language) || "en";
    }
    return "en";
  });

  const t = TRANSLATIONS[language];

  // Messages state
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingTasks, setIsCreatingTasks] = useState(false);

  // Suggested tasks selection state
  const [selectedTasks, setSelectedTasks] = useState<{ [key: number]: boolean }>({});
  const [selectedSubtasks, setSelectedSubtasks] = useState<{ [taskIdx: number]: { [subIdx: number]: boolean } }>({});
  const [targetSectionId, setTargetSectionId] = useState<string>("");

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Load chat session history per project from localStorage
  useEffect(() => {
    if (!projectId) {
      setMessages([]);
      return;
    }
    const savedHistory = localStorage.getItem(`planwise-chat-history-${projectId}`);
    if (savedHistory) {
      try {
        setMessages(JSON.parse(savedHistory));
      } catch (err) {
        resetWelcomeMessage();
      }
    } else {
      resetWelcomeMessage();
    }
  }, [projectId, language]);

  const resetWelcomeMessage = () => {
    setMessages([
      {
        id: "welcome",
        sender: "ai",
        text: TRANSLATIONS[language].welcomeText,
      },
    ]);
  };

  const updateMessagesAndSave = (updater: IMessage[] | ((prev: IMessage[]) => IMessage[])) => {
    setMessages((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      if (projectId) {
        localStorage.setItem(`planwise-chat-history-${projectId}`, JSON.stringify(next));
      }
      return next;
    });
  };

  // Initialize target section when sections are loaded
  useEffect(() => {
    if (sections && sections.length > 0 && !targetSectionId) {
      setTargetSectionId(sections[0].id);
    }
  }, [sections, targetSectionId]);

  // Scroll to bottom when messages update
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleLanguageChange = (newLang: Language) => {
    setLanguage(newLang);
    localStorage.setItem("planwise-chat-lang", newLang);
  };

  const handleClearChat = () => {
    if (!projectId) return;
    localStorage.removeItem(`planwise-chat-history-${projectId}`);
    resetWelcomeMessage();
  };

  const findTaskSectionId = (taskId: string): string => {
    if (!sections) return "";
    for (const sec of sections) {
      if (sec.tasks?.data?.some((t: any) => t.id === taskId)) {
        return sec.id;
      }
    }
    return "";
  };

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || !projectId || !user) return;

    const userMsgId = `user-${Date.now()}`;
    const userMessage: IMessage = {
      id: userMsgId,
      sender: "user",
      text: textToSend,
    };

    updateMessagesAndSave((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Append language instruction so that the LLM responds in the correct language
      const systemSuffix = language === "en" 
        ? "\n(Please respond in English.)" 
        : "\n(Hãy phản hồi bằng Tiếng Việt.)";
      
      const data = await chatApi({
        projectId,
        message: textToSend + systemSuffix,
      });

      // Reset selection state for suggested tasks
      const taskSelections: { [key: number]: boolean } = {};
      const subtaskSelections: { [taskIdx: number]: { [subIdx: number]: boolean } } = {};
      if (data.suggestedTasks) {
        data.suggestedTasks.forEach((task, tIdx) => {
          taskSelections[tIdx] = true;
          subtaskSelections[tIdx] = {};
          if (task.subtasks) {
            task.subtasks.forEach((_, sIdx) => {
              subtaskSelections[tIdx][sIdx] = true;
            });
          }
        });
      }
      setSelectedTasks(taskSelections);
      setSelectedSubtasks(subtaskSelections);

      const aiMessage: IMessage = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: data.response,
        suggestedTasks: data.suggestedTasks,
        suggestedSections: data.suggestedSections,
        prioritizedTaskIds: data.prioritizedTaskIds,
        suggestedActions: data.suggestedActions,
        assignmentSuggestions: data.assignmentSuggestions,
        unassignedTaskIds: data.unassignedTaskIds,
      };

      updateMessagesAndSave((prev) => [...prev, aiMessage]);
    } catch (err: any) {
      const errorMessage = err.message || "Request timed out or network error";
      const errMessage: IMessage = {
        id: `error-${Date.now()}`,
        sender: "ai",
        text: `> [!IMPORTANT]\n> **${t.errorTitle}**\n>\n> Error: \`${errorMessage}\`\n>\n> ${t.errorDetail}`,
      };
      updateMessagesAndSave((prev) => [...prev, errMessage]);
      toast.error(language === "en" ? "Failed to load response from AI" : "Không thể tải phản hồi từ AI");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleTask = (taskIdx: number) => {
    setSelectedTasks((prev) => {
      const nextVal = !prev[taskIdx];
      const subSelection = { ...selectedSubtasks[taskIdx] };
      Object.keys(subSelection).forEach((sIdx) => {
        subSelection[Number(sIdx)] = nextVal;
      });
      setSelectedSubtasks((prevSub) => ({
        ...prevSub,
        [taskIdx]: subSelection,
      }));
      return { ...prev, [taskIdx]: nextVal };
    });
  };

  const handleToggleSubtask = (taskIdx: number, subIdx: number) => {
    setSelectedSubtasks((prev) => {
      const updatedTaskSubs = {
        ...prev[taskIdx],
        [subIdx]: !prev[taskIdx]?.[subIdx],
      };

      const anySelected = Object.values(updatedTaskSubs).some(Boolean);
      setSelectedTasks((prevTasks) => ({
        ...prevTasks,
        [taskIdx]: anySelected,
      }));

      return {
        ...prev,
        [taskIdx]: updatedTaskSubs,
      };
    });
  };

  const handleCreateTasksAndSections = async (
    suggestedTasks: ISuggestedTask[],
    suggestedSections: ISuggestedSection[] = []
  ) => {
    if (!projectId || !user) return;

    setIsCreatingTasks(true);
    let createdCount = 0;

    try {
      const tempKeyToRealId: Record<string, string> = {};

      // 1. Create sections if needed
      if (suggestedSections && suggestedSections.length > 0) {
        for (const sec of suggestedSections) {
          const newSec = await createSectionMutation.mutateAsync({
            name: sec.name,
            projectId,
          });
          tempKeyToRealId[sec.tempKey] = newSec.id;
        }
      }

      // 2. Create tasks
      for (let i = 0; i < suggestedTasks.length; i++) {
        if (!selectedTasks[i]) continue;

        const task = suggestedTasks[i];
        const subsToCreate = task.subtasks
          ? task.subtasks.filter((_, subIdx) => selectedSubtasks[i]?.[subIdx])
          : [];

        // Determine destination section
        let secId = targetSectionId;
        
        // 1. If task specifies an existing sectionId
        if (task.hasOwnProperty("sectionId") && (task as any).sectionId) {
          secId = (task as any).sectionId;
        } 
        // 2. If task has a tempSectionKey, resolve it to the newly created section
        else if (task.hasOwnProperty("tempSectionKey") && (task as any).tempSectionKey) {
          const tKey = (task as any).tempSectionKey;
          if (tempKeyToRealId[tKey]) {
            secId = tempKeyToRealId[tKey];
          } else if (tempKeyToRealId[`section-${tKey}`]) {
            secId = tempKeyToRealId[`section-${tKey}`];
          } else if (tKey.startsWith("section-") && tempKeyToRealId[tKey.replace("section-", "")]) {
            secId = tempKeyToRealId[tKey.replace("section-", "")];
          } else {
            // Fuzzy match by section name in suggestedSections
            const matchedSec = suggestedSections.find(
              (s) => s.tempKey.toLowerCase() === tKey.toLowerCase() ||
                     s.name.toLowerCase() === tKey.toLowerCase() ||
                     s.name.toLowerCase().replace(/\s+/g, "-") === tKey.toLowerCase()
            );
            if (matchedSec && tempKeyToRealId[matchedSec.tempKey]) {
              secId = tempKeyToRealId[matchedSec.tempKey];
            }
          }
        }

        if (!secId && sections && sections.length > 0) {
          secId = sections[0].id;
        }

        const totalSubtasksEstimateMs = subsToCreate.reduce((sum, s) => sum + (s.estimate || 0), 0) * 60 * 1000;
        const parentEstimateMs = subsToCreate.length > 0 
          ? totalSubtasksEstimateMs 
          : (task.estimate || 0) * 60 * 1000;

        const isPersonal = pathname?.startsWith("/my-tasks");

        await createTaskMutation.mutateAsync({
          title: task.title,
          description: task.description || "",
          priority: task.priority || "NORMAL",
          sectionId: secId,
          estimate: parentEstimateMs,
          assigneeIds: isPersonal ? [] : ((task as any).suggestedAssigneeId ? [(task as any).suggestedAssigneeId] : [user.id]),
          subtasks: subsToCreate.map((sub) => ({
            title: sub.title,
            estimate: (sub.estimate || 0) * 60 * 1000,
            assigneeIds: isPersonal ? [] : [user.id],
          })),
        });
        createdCount++;
      }

      queryClient.invalidateQueries({ queryKey: ["sections", projectId] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });

      toast.success(t.toastSuccessCreate.replace("{count}", createdCount.toString()));
      setSelectedTasks({});
      setSelectedSubtasks({});
    } catch (err: any) {
      toast.error(err.message || t.toastErrorCreate);
    } finally {
      setIsCreatingTasks(false);
    }
  };

  const handleCreateSectionsOnly = async (suggestedSections: ISuggestedSection[]) => {
    if (!projectId) return;
    setIsCreatingTasks(true);
    try {
      for (const sec of suggestedSections) {
        await createSectionMutation.mutateAsync({
          name: sec.name,
          projectId,
        });
      }
      queryClient.invalidateQueries({ queryKey: ["sections", projectId] });
      toast.success(t.toastSuccessSection.replace("{count}", suggestedSections.length.toString()));
    } catch (err: any) {
      toast.error(err.message || t.toastErrorSection);
    } finally {
      setIsCreatingTasks(false);
    }
  };

  const handleApplyAssignment = async (taskId: string, userId: string) => {
    setIsCreatingTasks(true);
    try {
      await assignTaskToUsersMutation.mutateAsync({
        taskId,
        assigneeIds: [userId],
      });
      queryClient.invalidateQueries({ queryKey: ["sections", projectId] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success(t.toastSuccessAssign);
    } catch (err: any) {
      toast.error(err.message || t.toastErrorAssign);
    } finally {
      setIsCreatingTasks(false);
    }
  };

  const handleSelfAssign = async (taskId: string) => {
    if (!user) return;
    setIsCreatingTasks(true);
    try {
      await assignTaskToUsersMutation.mutateAsync({
        taskId,
        assigneeIds: [user.id],
      });
      queryClient.invalidateQueries({ queryKey: ["sections", projectId] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success(t.toastSuccessClaim);
    } catch (err: any) {
      toast.error(err.message || t.toastErrorClaim);
    } finally {
      setIsCreatingTasks(false);
    }
  };

  const handleOpenTaskModal = async (taskId: string) => {
    let foundTask: any = null;
    let foundSectionId = "";

    if (sections) {
      for (const sec of sections) {
        const t = sec.tasks?.data?.find((tk) => tk.id === taskId);
        if (t) {
          foundTask = t;
          foundSectionId = sec.id;
          break;
        }
      }
    }

    try {
      if (foundTask) {
        openModal({
          ...foundTask,
          projectId: projectId || "",
          sectionId: foundSectionId,
          isPersonal: pathname?.startsWith("/my-tasks"),
          mode: "update",
        });
      } else {
        const detail = await getTaskDetailApi(taskId);
        openModal({
          ...detail,
          projectId: projectId || "",
          sectionId: detail.originalProject?.id || "",
          isPersonal: pathname?.startsWith("/my-tasks"),
          mode: "update",
        });
      }
    } catch (err) {
      toast.error(t.toastErrorDetails);
    }
  };

  const handleApplyAction = async (action: ISuggestedAction) => {
    const sectionId = findTaskSectionId(action.taskId);
    if (!sectionId && action.type !== "DELETE") {
      toast.error(t.toastErrorFindSection);
      return;
    }

    try {
      setIsCreatingTasks(true);
      if (action.type === "UPDATE_STATUS") {
        await updateTaskStatusMutation.mutateAsync({
          taskId: action.taskId,
          status: action.value as any,
          sectionId,
        });
        toast.success(t.toastSuccessStatus.replace("{title}", action.taskTitle).replace("{value}", action.value || ""));
      } else if (action.type === "UPDATE_PRIORITY") {
        await updateTaskMutation.mutateAsync({
          taskId: action.taskId,
          priority: action.value as any,
          sectionId,
          projectId: projectId || "",
        });
        toast.success(t.toastSuccessPriority.replace("{title}", action.taskTitle).replace("{value}", action.value || ""));
      } else if (action.type === "DELETE") {
        await deleteTaskMutation.mutateAsync({
          taskId: action.taskId,
          sectionId: sectionId || sections[0]?.id || "",
          projectId: projectId || "",
        });
        toast.success(t.toastSuccessDelete.replace("{title}", action.taskTitle));
      }

      queryClient.invalidateQueries({ queryKey: ["sections", projectId] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    } catch (err: any) {
      toast.error(err.message || t.toastErrorAction);
    } finally {
      setIsCreatingTasks(false);
    }
  };

  const handleApplyPrioritization = async (taskIds: string[]) => {
    if (taskIds.length === 0 || !sections || sections.length === 0) return;

    let sectionId = "";
    for (const sec of sections) {
      if (sec.tasks?.data?.some((t) => t.id === taskIds[0])) {
        sectionId = sec.id;
        break;
      }
    }

    if (!sectionId) {
      toast.error(t.toastErrorPrioritizeFind);
      return;
    }

    setIsCreatingTasks(true);
    try {
      for (let i = 0; i < taskIds.length; i++) {
        await moveTaskMutation.mutateAsync({
          taskId: taskIds[i],
          fromSectionId: sectionId,
          toSectionId: sectionId,
          insertAt: i,
        });
      }

      queryClient.invalidateQueries({ queryKey: ["sections", projectId] });
      queryClient.invalidateQueries({ queryKey: ["tasks", sectionId] });
      toast.success(t.toastSuccessPrioritize);
    } catch (err: any) {
      toast.error(err.message || t.toastErrorPrioritize);
    } finally {
      setIsCreatingTasks(false);
    }
  };

  const renderMarkdown = (text: string) => {
    if (!text) return null;
    const lines = text.split("\n");

    return (
      <div className="space-y-1.5 text-[13px] leading-relaxed text-gray-800 break-words max-w-full">
        {lines.map((line, idx) => {
          const trimmed = line.trim();

          if (trimmed.startsWith("### ")) {
            return <h4 key={idx} className="mt-2 text-sm font-semibold text-gray-900 break-words">{trimmed.slice(4)}</h4>;
          }
          if (trimmed.startsWith("## ")) {
            return <h3 key={idx} className="mt-3 text-base font-bold text-gray-900 break-words">{trimmed.slice(3)}</h3>;
          }
          if (trimmed.startsWith("# ")) {
            return <h2 key={idx} className="mt-4 text-lg font-bold text-gray-900 break-words">{trimmed.slice(2)}</h2>;
          }

          if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
            return (
              <ul key={idx} className="list-disc pl-5 space-y-1 my-1 break-words">
                <li>{parseInlineMarkdown(trimmed.slice(2))}</li>
              </ul>
            );
          }

          const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
          if (numMatch) {
            return (
              <ol key={idx} className="list-decimal pl-5 space-y-1 my-1 break-words">
                <li>{parseInlineMarkdown(numMatch[2])}</li>
              </ol>
            );
          }

          if (trimmed.startsWith("> ")) {
            let content = trimmed.slice(2);
            let alertClass = "border-l-4 border-gray-300 bg-gray-50 text-gray-600";
            if (content.startsWith("[!IMPORTANT]")) {
              content = content.replace("[!IMPORTANT]", "").trim();
              alertClass = "border-l-4 border-red-400 bg-red-50 text-red-700 font-medium";
            } else if (content.startsWith("[!NOTE]")) {
              content = content.replace("[!NOTE]", "").trim();
              alertClass = "border-l-4 border-blue-400 bg-blue-50 text-blue-700";
            } else if (content.startsWith("[!TIP]")) {
              content = content.replace("[!TIP]", "").trim();
              alertClass = "border-l-4 border-emerald-400 bg-emerald-50 text-emerald-700";
            }
            return (
              <div key={idx} className={`p-2.5 my-2.5 rounded-r-[5px] ${alertClass} break-words`}>
                {parseInlineMarkdown(content)}
              </div>
            );
          }

          if (!trimmed) {
            return <div key={idx} className="h-1.5" />;
          }

          return <p key={idx} className="break-words">{parseInlineMarkdown(trimmed)}</p>;
        })}
      </div>
    );
  };

  const parseInlineMarkdown = (text: string) => {
    const linkRegex = /\[(.*?)\]\((.*?)\)/g;
    const linkMatches = [...text.matchAll(linkRegex)];

    if (linkMatches.length === 0) {
      return parseBolds(text);
    }

    let lastIndex = 0;
    const parts: React.ReactNode[] = [];

    linkMatches.forEach((match, index) => {
      const matchIndex = match.index!;
      if (matchIndex > lastIndex) {
        parts.push(parseBolds(text.slice(lastIndex, matchIndex)));
      }

      const linkText = match[1];
      const linkUrl = match[2];
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(linkUrl);

      if (isUuid) {
        parts.push(
          <button
            key={`link-${index}`}
            onClick={() => handleOpenTaskModal(linkUrl)}
            className="text-indigo-600 hover:underline font-bold inline-flex items-center gap-0.5 cursor-pointer text-left align-baseline bg-indigo-50 px-1 py-0.5 rounded-[4px] text-[12px]"
          >
            📋 {linkText}
          </button>
        );
      } else {
        parts.push(
          <a
            key={`link-${index}`}
            href={linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 hover:underline font-semibold break-all"
          >
            {linkText}
          </a>
        );
      }

      lastIndex = matchIndex + match[0].length;
    });

    if (lastIndex < text.length) {
      parts.push(parseBolds(text.slice(lastIndex)));
    }

    return parts;
  };

  const parseBolds = (text: string) => {
    const boldRegex = /\*\*(.*?)\*\*/g;
    const matches = [...text.matchAll(boldRegex)];
    if (matches.length === 0) return text;

    let lastIndex = 0;
    const parts: React.ReactNode[] = [];
    matches.forEach((match, index) => {
      const matchIndex = match.index!;
      if (matchIndex > lastIndex) {
        parts.push(text.slice(lastIndex, matchIndex));
      }
      parts.push(
        <strong key={`b-${index}`} className="font-semibold text-gray-950">
          {match[1]}
        </strong>
      );
      lastIndex = matchIndex + match[0].length;
    });
    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }
    return parts;
  };

  return (
    <div className="flex h-full w-full flex-col bg-[#f8f8f9] border-l overflow-hidden">
      {/* Header */}
      <div className="flex h-12 items-center justify-between border-b px-4 bg-white shrink-0">
        <div className="flex items-center gap-2">
          <h2 className="text-[14px] font-bold text-gray-800 tracking-tight">PlanWise AI Assistant</h2>
        </div>
        <div className="flex items-center gap-2">
          {/* Clear chat button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClearChat}
            disabled={messages.length <= 1}
            className="h-8 w-8 hover:bg-gray-100 rounded-[6px] cursor-pointer"
            title={t.clearChatTitle}
          >
            <Trash2 className="h-4 w-4 text-gray-500" />
          </Button>
          
          {/* Language selector */}
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value as Language)}
            className="rounded-[6px] border border-gray-200 bg-white px-2 py-1 text-[11px] font-semibold text-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none cursor-pointer"
          >
            <option value="en">EN</option>
            <option value="vi">VI</option>
          </select>
        </div>
      </div>

      {/* Messages list */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 py-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}>
            <div
              className={`max-w-[92%] rounded-[12px] p-3 text-[13px] break-words overflow-hidden ${
                msg.sender === "user"
                  ? "bg-indigo-600 text-white rounded-br-none shadow-sm"
                  : msg.id.startsWith("error-")
                    ? "bg-red-50 border border-red-200 text-red-800 rounded-bl-none shadow-sm"
                    : "bg-white text-gray-800 rounded-bl-none border border-gray-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)]"
              }`}
            >
              {msg.sender === "ai" ? (
                <div className="flex gap-2 w-full max-w-full">
                  <div className="flex-1 space-y-3 min-w-0 max-w-full">
                    {renderMarkdown(msg.text)}

                    {/* AI Suggested Sections UI */}
                    {msg.suggestedSections && msg.suggestedSections.length > 0 && (
                      <div className="mt-4 border-t pt-3 space-y-2.5">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-700">
                          <FolderKanban className="h-4 w-4" />
                          <span>{t.suggestedSections} ({msg.suggestedSections.length})</span>
                        </div>
                        <div className="space-y-1.5">
                          {msg.suggestedSections.map((sec, sIdx) => (
                            <div key={sIdx} className="flex items-center gap-2 bg-gray-50 border rounded-[6px] p-2 text-[11px] text-gray-700">
                              <div className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: sec.color || "#cbd5e1" }} />
                              <span className="font-semibold truncate">{sec.name}</span>
                              {sec.description && (
                                <span className="text-gray-400 truncate text-[10px]">— {sec.description}</span>
                              )}
                            </div>
                          ))}
                        </div>
                        {/* Only show "Create Sections Only" button if suggestedTasks is empty. Otherwise, creation will happen together. */}
                        {(!msg.suggestedTasks || msg.suggestedTasks.length === 0) && (
                          <Button
                            size="sm"
                            disabled={isCreatingTasks}
                            onClick={() => handleCreateSectionsOnly(msg.suggestedSections!)}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-[6px] text-[11px] font-medium h-8"
                          >
                            {isCreatingTasks ? (
                              <>
                                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                                {t.creatingSections}
                              </>
                            ) : (
                              <>
                                <Plus className="mr-1.5 h-3.5 w-3.5" />
                                {t.createSections}
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    )}

                    {/* AI Decomposed Tasks UI */}
                    {msg.suggestedTasks && msg.suggestedTasks.length > 0 && (
                      <div className="mt-4 border-t pt-3 space-y-3">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-700">
                          <CheckSquare className="h-4 w-4" />
                          <span>{t.suggestedTasks} ({msg.suggestedTasks.length})</span>
                        </div>

                        {/* Destination Section Select */}
                        {sections && sections.length > 0 && (
                          <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                              {t.addToDefaultSection}
                            </span>
                            <select
                              value={targetSectionId}
                              onChange={(e) => setTargetSectionId(e.target.value)}
                              className="w-full rounded-[6px] border border-gray-200 bg-white px-2 py-1 text-[11px] text-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none"
                            >
                              {sections.map((sec) => (
                                <option key={sec.id} value={sec.id}>
                                  # {sec.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}

                        {/* List of Tasks and Subtasks */}
                        <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                          {msg.suggestedTasks.map((task, tIdx) => {
                            const isTaskChecked = !!selectedTasks[tIdx];
                            return (
                              <div key={tIdx} className="bg-gray-50 border rounded-[8px] p-2 space-y-1.5 transition-all hover:bg-gray-100/50">
                                <div className="flex items-start gap-2">
                                  <button
                                    onClick={() => handleToggleTask(tIdx)}
                                    className="mt-0.5 text-indigo-600 hover:opacity-85 focus:outline-none"
                                  >
                                    {isTaskChecked ? (
                                      <CheckSquare className="h-4 w-4" />
                                    ) : (
                                      <div className="h-4 w-4 border border-gray-400 rounded-[3px] bg-white" />
                                    )}
                                  </button>
                                  <div className="flex-1 min-w-0">
                                    <div className="text-[12px] font-semibold text-gray-900 truncate">
                                      {task.title}
                                    </div>
                                    {task.description && (
                                      <div className="text-[10px] text-gray-500 line-clamp-1">
                                        {task.description}
                                      </div>
                                    )}
                                    {(task as any).tempSectionKey && (
                                      <div className="text-[9px] text-indigo-600 font-medium mt-0.5">
                                        {t.newSection} {(task as any).tempSectionKey}
                                      </div>
                                    )}
                                  </div>
                                  {task.priority && (
                                    <span
                                      className={`text-[8px] font-bold px-1 py-0.5 rounded-[4px] uppercase shrink-0 ${
                                        task.priority === "URGENT" || task.priority === "HIGH"
                                          ? "bg-red-50 text-red-600 border border-red-100"
                                          : "bg-gray-100 text-gray-600"
                                      }`}
                                    >
                                      {task.priority}
                                    </span>
                                  )}
                                </div>

                                {/* Subtasks list */}
                                {task.subtasks && task.subtasks.length > 0 && (
                                  <div className="pl-6 border-l border-gray-200 ml-2 space-y-1">
                                    {task.subtasks.map((sub, sIdx) => {
                                      const isSubChecked = !!selectedSubtasks[tIdx]?.[sIdx];
                                      return (
                                        <div key={sIdx} className="flex items-center gap-1.5 text-[11px] text-gray-600">
                                          <button
                                            onClick={() => handleToggleSubtask(tIdx, sIdx)}
                                            className="text-gray-400 hover:text-indigo-600 focus:outline-none shrink-0"
                                          >
                                            {isSubChecked ? (
                                              <CheckSquare className="h-3 w-3 text-indigo-500" />
                                            ) : (
                                              <div className="h-3 w-3 border border-gray-300 rounded-[2px] bg-white" />
                                            )}
                                          </button>
                                          <span className="truncate">{sub.title}</span>
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>

                        {/* Create Tasks Button */}
                        <Button
                          size="sm"
                          disabled={isCreatingTasks || !Object.values(selectedTasks).some(Boolean)}
                          onClick={() => handleCreateTasksAndSections(msg.suggestedTasks!, msg.suggestedSections)}
                          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-[6px] text-[11px] font-medium h-8"
                        >
                          {isCreatingTasks ? (
                            <>
                              <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                              {t.creatingTasks}
                            </>
                          ) : (
                            <>
                              <Plus className="mr-1.5 h-3.5 w-3.5" />
                              {t.createSelectedTasks}
                            </>
                          )}
                        </Button>
                      </div>
                    )}

                    {/* AI Assignment Suggestions UI */}
                    {msg.assignmentSuggestions && msg.assignmentSuggestions.length > 0 && (
                      <div className="mt-3 border-t pt-3 space-y-2">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-700">
                          <UserCheck className="h-4 w-4" />
                          <span>{t.assignmentSuggestions} ({msg.assignmentSuggestions.length})</span>
                        </div>
                        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                          {msg.assignmentSuggestions.map((sug, sIdx) => (
                            <div key={sIdx} className="flex flex-col bg-gray-50 border rounded-[6px] p-2 gap-1.5 text-[11px]">
                              <div className="flex items-center justify-between gap-2">
                                <span className="font-semibold text-gray-800 truncate">
                                  Task: {sug.taskTitle}
                                </span>
                                <Button
                                  size="sm"
                                  disabled={isCreatingTasks}
                                  onClick={() => handleApplyAssignment(sug.taskId, sug.suggestedUserId)}
                                  className="h-5 px-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-[4px] text-[10px] border-0 cursor-pointer shadow-none shrink-0"
                                >
                                  {t.assign}
                                </Button>
                              </div>
                              <div className="text-gray-500 leading-normal flex items-start gap-1">
                                <User className="h-3 w-3 shrink-0 text-gray-400 mt-0.5" />
                                <span>{t.assignBecause.replace("{user}", sug.suggestedUserName).replace("{reason}", sug.reason)}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* AI Unassigned Tasks List UI */}
                    {msg.unassignedTaskIds && msg.unassignedTaskIds.length > 0 && (
                      <div className="mt-3 border-t pt-3 space-y-2">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-700">
                          <AlertCircle className="h-4 w-4" />
                          <span>{t.unassignedTasks} ({msg.unassignedTaskIds.length})</span>
                        </div>
                        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                          {msg.unassignedTaskIds.map((tid, tIdx) => {
                            // Find the task in local section tasks to show title
                            let title = "Task " + tid.slice(0, 8);
                            if (sections) {
                              for (const sec of sections) {
                                const matched = sec.tasks?.data?.find((tk) => tk.id === tid);
                                if (matched) {
                                  title = matched.title;
                                  break;
                                }
                              }
                            }
                            return (
                              <div key={tIdx} className="flex items-center justify-between bg-amber-50/50 border border-amber-100 rounded-[6px] p-2 gap-2 text-[11px]">
                                <button
                                  onClick={() => handleOpenTaskModal(tid)}
                                  className="text-gray-700 font-medium truncate text-left hover:underline hover:text-indigo-600"
                                >
                                  📋 {title}
                                </button>
                                <Button
                                  size="sm"
                                  disabled={isCreatingTasks}
                                  onClick={() => handleSelfAssign(tid)}
                                  className="h-5 px-2 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-[4px] text-[10px] border-0 cursor-pointer shadow-none shrink-0"
                                >
                                  {t.claim}
                                </Button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* AI Prioritized Task Order Execution UI */}
                    {msg.prioritizedTaskIds && msg.prioritizedTaskIds.length > 0 && (
                      <div className="mt-3 border-t pt-3 space-y-2">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                          <ArrowUpDown className="h-4 w-4" />
                          <span>{t.suggestedPrioritization}</span>
                        </div>
                        <Button
                          size="sm"
                          disabled={isCreatingTasks}
                          onClick={() => handleApplyPrioritization(msg.prioritizedTaskIds!)}
                          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-[6px] text-[11px] font-medium h-8"
                        >
                          {isCreatingTasks ? (
                            <>
                              <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                              {t.updatingPositions}
                            </>
                          ) : (
                            <>
                              <Check className="mr-1.5 h-3.5 w-3.5" />
                              {t.applyPrioritization}
                            </>
                          )}
                        </Button>
                      </div>
                    )}

                    {/* AI Suggested Task Operations Actions UI */}
                    {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                      <div className="mt-3 border-t pt-3 space-y-2">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-700">
                          <Settings className="h-4 w-4" />
                          <span>{t.suggestedQuickActions}</span>
                        </div>
                        <div className="space-y-1.5">
                          {msg.suggestedActions.map((action, aIdx) => {
                            let actionLabel = "";
                            let actionIcon = <Settings className="h-3.5 w-3.5 text-indigo-500" />;
                            if (action.type === "UPDATE_STATUS") {
                              actionLabel = t.changeStatus.replace("{title}", action.taskTitle).replace("{value}", action.value || "");
                            } else if (action.type === "UPDATE_PRIORITY") {
                              actionLabel = t.changePriority.replace("{title}", action.taskTitle).replace("{value}", action.value || "");
                            } else if (action.type === "DELETE") {
                              actionLabel = t.deleteTask.replace("{title}", action.taskTitle);
                              actionIcon = <Trash2 className="h-3.5 w-3.5 text-red-500" />;
                            }

                            return (
                              <div key={aIdx} className="flex items-center justify-between bg-gray-50 border rounded-[6px] p-2 gap-2 text-[11px]">
                                <span className="flex items-center gap-1.5 min-w-0 text-gray-700 font-medium">
                                  {actionIcon}
                                  <span className="truncate">{actionLabel}</span>
                                </span>
                                <Button
                                  size="sm"
                                  disabled={isCreatingTasks}
                                  onClick={() => handleApplyAction(action)}
                                  className="h-6 px-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-[4px] text-[10px] font-semibold border-0 cursor-pointer shadow-none shrink-0"
                                >
                                  {t.apply}
                                </Button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <p className="whitespace-pre-wrap">{msg.text}</p>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200/80 rounded-[12px] rounded-bl-none p-3 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Loader2 className="h-4 w-4 animate-spin text-indigo-600" />
                <span>{t.loading}</span>
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Quick Actions */}
      {!isLoading && (
        <div className="px-4 py-2 bg-gray-50 border-t flex flex-wrap gap-1.5 justify-start shrink-0">
          <button
            onClick={() => handleSendMessage(t.quickActionLandingPage)}
            className="flex items-center gap-1 px-2 py-1 bg-white hover:bg-gray-100 border text-gray-600 hover:text-indigo-600 rounded-[14px] text-[10px] font-semibold transition cursor-pointer"
          >
            <Sparkles className="h-3 w-3 text-indigo-500" />
            <span>{t.quickActionBtnLandingPage}</span>
          </button>
          <button
            onClick={() => handleSendMessage(t.quickActionPrioritize)}
            className="flex items-center gap-1 px-2 py-1 bg-white hover:bg-gray-100 border text-gray-600 hover:text-indigo-600 rounded-[14px] text-[10px] font-semibold transition cursor-pointer"
          >
            <ListTodo className="h-3 w-3 text-indigo-500" />
            <span>{t.quickActionBtnPrioritize}</span>
          </button>
        </div>
      )}

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage(input);
        }}
        className="p-3 bg-white border-t flex items-center gap-2 shrink-0"
      >
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={projectId ? t.placeholder : t.selectProject}
          disabled={isLoading || !projectId}
          className="flex-1 text-[13px] h-9 border border-gray-200 rounded-[6px] focus-visible:ring-1 focus-visible:ring-indigo-500"
        />
        <Button
          type="submit"
          size="icon"
          disabled={isLoading || !input.trim() || !projectId}
          className="h-9 w-9 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[6px] flex items-center justify-center shrink-0 cursor-pointer disabled:opacity-60"
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
