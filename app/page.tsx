import Image from "next/image";
import Link from "next/link";
import {
  AlertCircle,
  Archive,
  ArrowRight,
  ArrowUp,
  BarChart3,
  Bell,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Database,
  ExternalLink,
  Filter,
  ImageIcon,
  LayoutGrid,
  Link as LinkIcon,
  ListChecks,
  Mail,
  MailOpen,
  MessagesSquare,
  MoreVertical,
  PenSquare,
  Pencil,
  Plus,
  Search,
  Shield,
  Sparkles,
  Star,
  Target,
  Timer,
  Trash2,
  UserPlus,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const features = [
  {
    icon: LayoutGrid,
    title: "Projects & workspaces",
    body: "Organize work into projects with sections, members, and roles. Each project gets its own kanban, list, channels, and overview.",
  },
  {
    icon: ListChecks,
    title: "Tasks your way",
    body: "Switch between drag-and-drop Kanban and a fast list view. Filter by deadline or section, sort, and update inline.",
  },
  {
    icon: MessagesSquare,
    title: "Team channels",
    body: "Project-scoped channels keep conversation next to the work — no jumping to Slack to ask about a card.",
  },
  {
    icon: Shield,
    title: "Roles & permissions",
    body: "Build custom roles with fine-grained permissions, assign them per project, and keep the default role for new members.",
  },
  {
    icon: UserPlus,
    title: "Members & invites",
    body: "Invite teammates by email, search the member list, and accept or decline invitations from your inbox.",
  },
  {
    icon: Bell,
    title: "Notifications",
    body: "Assignments, updates, deadlines, and project invites land in one inbox — with All, Workspace, and Invitation tabs.",
  },
  {
    icon: BarChart3,
    title: "Reviews & analytics",
    body: "Activity timelines, status and priority breakdowns, KPIs, and period highlights so leads see progress at a glance.",
  },
  {
    icon: CheckCircle2,
    title: "My Tasks",
    body: "A personal cross-project view of everything assigned to you, with the same Kanban and List toggle.",
  },
];

const PRIORITY_STYLES = {
  LOW: "bg-green-200 text-green-800",
  NORMAL: "bg-blue-200 text-blue-800",
  HIGH: "bg-yellow-200 text-yellow-800",
  URGENT: "bg-red-200 text-red-800",
} as const;

type Priority = keyof typeof PRIORITY_STYLES;

function PriorityPill({ priority }: { priority: Priority }) {
  return (
    <span
      className={`inline-flex items-center rounded-[5px] px-2 py-[1.75px] text-[10px] leading-none font-semibold ${PRIORITY_STYLES[priority]}`}
    >
      {priority}
    </span>
  );
}

function StatusCircle({ status }: { status: "TODO" | "DONE" }) {
  if (status === "DONE") {
    return (
      <svg viewBox="0 0 24 24" className="size-4 text-green-500" fill="currentColor">
        <path d="M24 4C35.0457 4 44 12.9543 44 24C44 35.0457 35.0457 44 24 44C12.9543 44 4 35.0457 4 24C4 12.9543 12.9543 4 24 4ZM32.6339 17.6161C32.1783 17.1605 31.4585 17.1301 30.9676 17.525L30.8661 17.6161L20.75 27.7322L17.1339 24.1161C16.6457 23.628 15.8543 23.628 15.3661 24.1161C14.9105 24.5717 14.8801 25.2915 15.275 25.7824L15.3661 25.8839L19.8661 30.3839C20.3217 30.8395 21.0415 30.8699 21.5324 30.475L21.6339 30.3839L32.6339 19.3839C33.122 18.8957 33.122 18.1043 32.6339 17.6161Z" transform="translate(-1.8 -1.8) scale(0.575)" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="size-4 text-[#b9b9b9]" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

const KANBAN_COLUMNS: {
  name: string;
  count: number;
  tasks: { title: string; priority: Priority; status: "TODO" | "DONE"; estimate?: string }[];
}[] = [
  {
    name: "Backlog",
    count: 4,
    tasks: [
      { title: "Audit landing page copy and screenshots", priority: "LOW", status: "TODO", estimate: "1h" },
      { title: "Explore pricing tier breakpoints", priority: "NORMAL", status: "TODO", estimate: "2h" },
      { title: "Draft Q3 OKR rollup", priority: "NORMAL", status: "TODO" },
    ],
  },
  {
    name: "In progress",
    count: 3,
    tasks: [
      { title: "Hero section redesign with new mockup", priority: "HIGH", status: "TODO", estimate: "4h" },
      { title: "Wire up Notion database import end-to-end", priority: "URGENT", status: "TODO", estimate: "3h" },
      { title: "Channel reactions popover polish", priority: "NORMAL", status: "TODO" },
    ],
  },
  {
    name: "Done",
    count: 5,
    tasks: [
      { title: "Google Calendar drag-to-schedule", priority: "HIGH", status: "DONE", estimate: "5h" },
      { title: "Roles & members modal flows", priority: "NORMAL", status: "DONE" },
      { title: "Reviews donut + activity charts", priority: "LOW", status: "DONE" },
    ],
  },
];

function KanbanPreview() {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#dcdcdc] bg-white shadow-2xl">
      <div className="flex h-12 items-center justify-between border-b border-[#dcdcdc] px-3">
        <div className="flex items-center gap-2 text-[13px]">
          <div className="inline-flex items-center gap-1.5 rounded-md border border-[#dcdcdc] bg-white px-2 py-1 text-[#413f39]">
            <Calendar className="size-3.5 text-[#787878]" />
            <span className="font-medium">May 1 – May 31</span>
          </div>
          <div className="inline-flex items-center gap-1.5 rounded-md border border-[#dcdcdc] bg-white px-2 py-1 text-[#413f39]">
            <Filter className="size-3.5 text-[#787878]" />
            <span className="font-medium">All sections</span>
          </div>
        </div>
        <div className="inline-flex items-center gap-0.5 rounded border border-[#dcdcdc] bg-white p-0.5">
          <button className="flex size-7 items-center justify-center rounded bg-[#f0f0f0] text-[#413f39]">
            <LayoutGrid className="size-4" />
          </button>
          <button className="flex size-7 items-center justify-center rounded text-[#787878]">
            <ListChecks className="size-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 px-2 pt-2 pb-4">
        {KANBAN_COLUMNS.map((column) => (
          <section key={column.name} className="flex w-full min-w-0 flex-col">
            <div className="flex items-center justify-between px-3 pt-3 pb-2">
              <h3 className="text-[15px] font-semibold text-[#413f39]">{column.name}</h3>
              <div className="flex items-center gap-2 text-[#787878]">
                <span className="text-xs">{column.count}</span>
                <MoreVertical className="size-4" />
              </div>
            </div>
            <div className="flex flex-col gap-1.5 px-2 pb-2">
              {column.tasks.map((task) => (
                <div
                  key={task.title}
                  className="rounded border border-transparent bg-white p-3 shadow-[0_1px_1px_#0000001a]"
                >
                  <div className="mb-1 flex items-start justify-between gap-2">
                    <PriorityPill priority={task.priority} />
                    {task.estimate && (
                      <span className="text-[11px] text-[#787878]">{task.estimate}</span>
                    )}
                  </div>
                  <p className="text-[14px] leading-snug font-normal text-[#413f39]">
                    {task.title}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <StatusCircle status={task.status} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

type Accent = "emerald" | "indigo" | "sky" | "amber";

function ReviewsPreview() {
  const kpis: {
    icon: typeof CheckCircle2;
    label: string;
    value: string;
    accent: Accent;
    delta?: string;
  }[] = [
    { icon: CheckCircle2, label: "Tasks completed", value: "37", accent: "emerald", delta: "+18%" },
    { icon: Target, label: "Completion rate", value: "84%", accent: "indigo" },
    { icon: Clock, label: "On-time rate", value: "72%", accent: "sky" },
    { icon: Timer, label: "Time spent", value: "42h 12m", accent: "amber", delta: "+6%" },
  ];

  const ringTone: Record<Accent, { bg: string; text: string; ring: string }> = {
    emerald: { bg: "bg-emerald-100", text: "text-emerald-600", ring: "ring-emerald-200" },
    indigo: { bg: "bg-indigo-100", text: "text-indigo-600", ring: "ring-indigo-200" },
    sky: { bg: "bg-sky-100", text: "text-sky-600", ring: "ring-sky-200" },
    amber: { bg: "bg-amber-100", text: "text-amber-600", ring: "ring-amber-200" },
  };

  return (
    <div className="rounded-2xl border border-[#dcdcdc] bg-white p-5 shadow-2xl">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex rounded-lg border border-[#dcdcdc] bg-white p-0.5">
          <button className="rounded-md bg-[#dcdcdc] px-3 py-1 text-xs font-semibold text-[#413f39]">
            Week
          </button>
          <button className="rounded-md px-3 py-1 text-xs font-semibold text-[#787878]">
            Month
          </button>
        </div>
        <div className="flex items-center gap-1">
          <button className="flex size-7 items-center justify-center rounded text-[#787878]">
            <ChevronLeft className="size-4" />
          </button>
          <span className="min-w-[140px] text-center text-sm font-semibold text-[#413f39]">
            May 1 – May 8
          </span>
          <button className="flex size-7 items-center justify-center rounded text-[#787878]">
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>

      <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {kpis.map(({ icon: Icon, label, value, accent, delta }) => {
          const tone = ringTone[accent];
          return (
            <div key={label} className={`rounded-lg p-3 ring-1 ${tone.ring}`}>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[10px] font-medium tracking-wide text-gray-500 uppercase">
                  {label}
                </span>
                <span className={`flex size-7 items-center justify-center rounded-md ${tone.bg} ${tone.text}`}>
                  <Icon className="size-4" />
                </span>
              </div>
              <div className="text-2xl font-semibold text-[#413f39]">{value}</div>
              {delta && (
                <div className="mt-1 inline-flex items-center gap-0.5 rounded-md bg-emerald-100 px-1.5 py-0.5 text-[11px] font-medium text-emerald-700">
                  <ArrowUp className="size-3" />
                  {delta}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_220px]">
        <div className="rounded-lg border border-[#dcdcdc] p-3">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-[#413f39]">Activity</div>
              <div className="text-xs text-[#787878]">Tasks completed per day</div>
            </div>
            <div className="inline-flex rounded-lg border border-[#dcdcdc] p-0.5 text-xs">
              <span className="rounded-md bg-[#dcdcdc] px-2.5 py-1 font-semibold text-[#413f39]">
                Tasks
              </span>
              <span className="px-2.5 py-1 font-semibold text-[#787878]">Hours</span>
            </div>
          </div>
          <div className="flex h-28 items-end gap-2">
            {[40, 65, 35, 80, 55, 90, 70].map((h, i) => (
              <div key={i} className="flex-1 rounded-t bg-indigo-500" style={{ height: `${h}%` }} />
            ))}
          </div>
          <div className="mt-2 grid grid-cols-7 text-center text-[10px] text-gray-400">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
              <span key={d}>{d}</span>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-[#dcdcdc] p-3">
          <div className="mb-1 text-sm font-semibold text-[#413f39]">Status breakdown</div>
          <div className="mb-3 text-xs text-[#787878]">Where the period&apos;s tasks landed</div>
          <div
            className="mx-auto size-32 rounded-full"
            style={{
              background:
                "conic-gradient(#10b981 0 50%, #6366f1 50% 70%, #94a3b8 70% 90%, #f43f5e 90% 100%)",
            }}
          >
            <div className="m-3 size-26 rounded-full bg-white" />
          </div>
          <ul className="mt-3 space-y-1 text-[11px] text-[#413f39]">
            <li className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-emerald-500" /> Done · 50%
            </li>
            <li className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-indigo-500" /> Running · 20%
            </li>
            <li className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-slate-400" /> To Do · 20%
            </li>
            <li className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-rose-500" /> Missed · 10%
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function CalendarPreview() {
  const events = [
    { top: 12, height: 56, title: "Team standup", time: "09:00 – 09:45", color: "#2563eb" },
    { top: 80, height: 92, title: "Design review", time: "10:00 – 11:30", color: "#4f46e5" },
    { top: 196, height: 56, title: "Lunch w/ Khoa", time: "12:30 – 13:15", color: "#16a34a" },
    { top: 270, height: 76, title: "Sprint planning", time: "14:00 – 15:15", color: "#f97316" },
  ];

  return (
    <div className="flex h-[420px] w-full flex-col overflow-hidden rounded-2xl border border-[#dcdcdc] bg-[#f8f8f9] shadow-2xl">
      <div className="flex h-12 shrink-0 items-center justify-between border-b border-[#dcdcdc] px-4">
        <h2 className="text-[16px] font-semibold text-[#787878]">Google Calendar</h2>
        <div className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-[#2563eb]" />
          <span className="size-2 rounded-full bg-[#16a34a]" />
        </div>
      </div>
      <div className="flex h-10 shrink-0 items-center justify-between border-b border-[#dcdcdc] px-4">
        <button className="flex size-7 items-center justify-center rounded text-[#787878]">
          <ChevronLeft className="size-4" />
        </button>
        <div className="text-sm font-medium text-[#413f39]">Thu, May 8</div>
        <button className="flex size-7 items-center justify-center rounded text-[#787878]">
          <ChevronRight className="size-4" />
        </button>
      </div>
      <div className="relative flex-1 overflow-hidden">
        {[9, 10, 11, 12, 13, 14, 15].map((hour, idx) => (
          <div
            key={hour}
            className="absolute right-0 left-12 border-t border-dashed border-[#e5e5e7]"
            style={{ top: idx * 56 }}
          />
        ))}
        {[9, 10, 11, 12, 13, 14, 15].map((hour, idx) => (
          <div
            key={`label-${hour}`}
            className="absolute left-2 text-[10px] text-[#787878]"
            style={{ top: idx * 56 - 6 }}
          >
            {hour}:00
          </div>
        ))}
        {events.map((e) => (
          <div
            key={e.title}
            className="absolute right-3 left-14 rounded-md p-2 text-xs text-white shadow"
            style={{ top: e.top, height: e.height, background: e.color }}
          >
            <div className="font-semibold">{e.title}</div>
            <div className="text-[10px] opacity-90">{e.time}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function NotionPreview() {
  const databases = [
    { title: "Engineering Roadmap", count: 24 },
    { title: "Product Specs", count: 18 },
    { title: "Meeting Notes", count: 36 },
    { title: "Personal Tasks", count: 12 },
  ];

  return (
    <div className="flex w-full flex-col overflow-hidden rounded-2xl border border-[#dcdcdc] bg-[#f8f8f9] shadow-2xl">
      <div className="flex h-12 shrink-0 items-center border-b border-[#dcdcdc] px-4">
        <h2 className="text-[16px] font-semibold text-[#787878]">Notion Integration</h2>
      </div>
      <div className="flex flex-col gap-4 overflow-hidden p-4">
        <div className="flex flex-col gap-2 rounded-lg border border-blue-100/50 bg-blue-50/50 p-3">
          <label className="flex items-center gap-1.5 text-[10px] font-bold tracking-wide text-blue-600 uppercase">
            <LinkIcon className="size-3" />
            Quick Import by Link
          </label>
          <div className="flex gap-2">
            <div className="flex h-8 flex-1 items-center rounded-md border border-[#dcdcdc] bg-white px-2.5 text-xs text-[#9ca3af]">
              Paste Notion URL...
            </div>
            <button className="flex size-8 items-center justify-center rounded-md bg-blue-600 text-white">
              <ArrowRight className="size-3.5" />
            </button>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute top-2.5 left-2.5 size-4 text-gray-500" />
          <div className="flex h-9 items-center rounded-md border border-[#dcdcdc] bg-white pl-9 text-sm text-[#9ca3af]">
            Search databases...
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {databases.map((db) => (
            <div
              key={db.title}
              className="group flex items-center justify-between rounded-md border border-gray-100 bg-white p-3 shadow-sm"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <Database className="size-4 shrink-0 text-gray-400" />
                <span className="truncate text-sm font-medium text-[#413f39]">{db.title}</span>
                <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] text-[#787878]">
                  {db.count}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <ExternalLink className="size-3.5 text-gray-400" />
                <ChevronRight className="size-4 text-gray-300" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function GmailPreview() {
  const emails = [
    {
      sender: "Linh Nguyen",
      subject: "Q2 design review feedback",
      time: "9:42 AM",
      preview:
        "Quick notes on the new dashboard mocks — overall direction is great. A few thoughts on the KPI cards and donut spacing...",
      unread: true,
    },
    {
      sender: "GitHub",
      subject: "[planwise] PR #214 ready for review",
      time: "9:11 AM",
      preview:
        "Tuan opened a pull request: 'Wire Notion database export to drag-and-drop' (+264 / -38). 4 reviewers requested.",
      unread: true,
    },
    {
      sender: "Notion",
      subject: "Weekly update from your workspace",
      time: "Mon",
      preview:
        "8 new pages, 32 edits across Engineering and Product Specs. See what your team has been up to this week.",
      unread: false,
    },
  ];

  return (
    <div className="flex w-full flex-col overflow-hidden rounded-2xl border border-[#dcdcdc] bg-[#f8f8f9] shadow-2xl">
      <div className="flex h-12 shrink-0 items-center justify-between border-b border-[#dcdcdc] px-4">
        <div>
          <h2 className="text-[16px] font-semibold text-[#787878]">Gmail</h2>
        </div>
        <Badge variant="outline" className="h-6 border-emerald-200 bg-emerald-50 text-emerald-700">
          Connected
        </Badge>
      </div>
      <div className="px-4 py-2.5">
        <div className="flex h-10 items-center rounded-md border border-[#d9dde3] bg-white px-3 text-[#9ca3af]">
          <Search className="size-4" />
          <span className="ml-2 text-sm">Contains text</span>
          <div className="ml-auto text-xs text-[#5f6368]">reset</div>
        </div>
      </div>
      <div className="flex flex-col gap-2 px-4 pb-4">
        {emails.map((m) => (
          <div
            key={m.subject}
            className="rounded-[10px] border border-[#d9dde3] bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
          >
            <div className="mb-1.5 flex items-start justify-between gap-2">
              <div className="flex min-w-0 items-center gap-1.5 text-[#9ca3af]">
                <span
                  className={`text-[13px] ${
                    m.unread ? "font-semibold text-gray-900" : "font-medium text-[#2f3c4e]"
                  }`}
                >
                  {m.sender}
                </span>
                <ExternalLink className="size-3 shrink-0" />
                <Archive className="size-3 shrink-0" />
                <Trash2 className="size-3 shrink-0" />
                <MailOpen className="size-3 shrink-0" />
                <Star className="size-3 shrink-0" />
              </div>
              <span className="shrink-0 text-xs text-[#4b5563]">{m.time}</span>
            </div>
            <div
              className={`text-[15px] leading-tight ${
                m.unread ? "font-bold text-[#111827]" : "font-semibold text-[#1f2937]"
              }`}
            >
              {m.subject}
            </div>
            <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-[#6b7280]">
              {m.preview}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProjectModalPreview() {
  return (
    <div className="rounded-2xl border border-[#dcdcdc] bg-white p-8 shadow-2xl">
      <div className="mx-auto max-w-md">
        <div className="mb-6 flex flex-col items-center gap-3">
          <div className="flex size-20 items-center justify-center rounded-2xl border-2 border-dashed border-[#dcdcdc] bg-[#f7f8fa] text-[#b4b4b4]">
            <ImageIcon className="size-7" />
          </div>
          <button className="text-xs font-medium text-[#787878] hover:text-[#413f39]">
            Upload project logo
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold tracking-wide text-[#787878] uppercase">
              Name
            </label>
            <div className="flex h-10 items-center rounded-md border border-[#dcdcdc] bg-white px-3 text-sm text-[#413f39]">
              Q3 Marketing Site
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold tracking-wide text-[#787878] uppercase">
              Description
            </label>
            <div className="min-h-20 rounded-md border border-[#dcdcdc] bg-white p-3 text-sm leading-relaxed text-[#413f39]">
              Refresh the marketing site for the Q3 launch — new hero, integrations spotlight, and
              a working pricing page.
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button className="h-9 rounded-md px-4 text-sm text-[#787878] hover:bg-[#f7f8fa]">
            Cancel
          </button>
          <button className="h-9 rounded-md bg-[#e85d4a] px-4 text-sm font-medium text-white">
            Create project
          </button>
        </div>
      </div>
    </div>
  );
}

function RolesPreview() {
  const roles: {
    name: string;
    isDefault?: boolean;
    permissions: string[];
    members: { initials: string; tone: string }[];
    extra?: number;
  }[] = [
    {
      name: "Admin",
      isDefault: false,
      permissions: ["Manage project", "Manage roles", "Invite members", "Edit any task"],
      members: [
        { initials: "LT", tone: "bg-rose-300" },
        { initials: "AT", tone: "bg-amber-300" },
      ],
    },
    {
      name: "Member",
      isDefault: true,
      permissions: ["Create task", "Update own task", "Comment"],
      members: [
        { initials: "TN", tone: "bg-emerald-300" },
        { initials: "QP", tone: "bg-sky-300" },
        { initials: "MN", tone: "bg-purple-300" },
        { initials: "HD", tone: "bg-pink-300" },
      ],
      extra: 3,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-xl">
        <div className="mb-3 flex items-center gap-3">
          <div className="rounded-lg bg-blue-50 p-2">
            <Plus className="size-4 text-blue-600" />
          </div>
          <h3 className="text-sm font-semibold text-gray-900">Create new role</h3>
        </div>
        <div className="grid items-end gap-3 md:grid-cols-3">
          <div>
            <label className="mb-1 block text-[11px] font-medium text-gray-700">Role name</label>
            <div className="flex h-9 items-center rounded-md border border-gray-200 px-2.5 text-xs text-[#413f39]">
              Reviewer
            </div>
          </div>
          <div>
            <label className="mb-1 block text-[11px] font-medium text-gray-700">Permissions</label>
            <div className="flex h-9 items-center justify-between rounded-md border border-gray-200 px-2.5 text-xs text-gray-400">
              Select permissions...
              <ChevronRight className="size-3.5 rotate-90" />
            </div>
          </div>
          <button className="h-9 rounded-md bg-gradient-to-r from-[#D60808] to-[#700404] px-3 text-xs font-medium text-white">
            <Plus className="mr-1 inline size-3" />
            Create role
          </button>
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {["Comment", "View task"].map((p) => (
            <span
              key={p}
              className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-[11px] text-gray-700"
            >
              {p} ×
            </span>
          ))}
        </div>
      </div>

      {roles.map((role) => (
        <div key={role.name} className="rounded-lg border border-gray-200 bg-white p-5 shadow-xl">
          <div className="mb-3 flex items-start justify-between">
            <h3 className="flex items-center gap-2 text-base font-semibold text-gray-900">
              {role.name}
              {role.isDefault && (
                <Badge variant="secondary" className="text-[10px]">
                  Default
                </Badge>
              )}
            </h3>
            <div className="flex items-center gap-1">
              <button className="flex size-7 items-center justify-center rounded text-gray-500 hover:text-gray-700">
                <Pencil className="size-3.5" />
              </button>
              <button
                className="flex size-7 items-center justify-center rounded text-red-500 disabled:opacity-30"
                disabled={role.isDefault}
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
          </div>

          <div className="mb-4 flex flex-wrap gap-1.5">
            {role.permissions.map((p) => (
              <Badge key={p} className="border-0 bg-blue-50 text-[11px] text-blue-700">
                {p}
              </Badge>
            ))}
          </div>

          <div className="border-t pt-3">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="size-4 text-gray-500" />
                <span className="text-xs font-medium text-gray-700">Members</span>
              </div>
              <span className="text-xs text-gray-500">
                {role.members.length + (role.extra ?? 0)} members
              </span>
            </div>
            <div className="flex -space-x-2">
              {role.members.map((m) => (
                <div
                  key={m.initials}
                  className={`flex size-7 items-center justify-center rounded-full border-2 border-white text-[10px] font-semibold text-white ${m.tone}`}
                >
                  {m.initials}
                </div>
              ))}
              {role.extra && (
                <div className="flex size-7 items-center justify-center rounded-full border-2 border-white bg-gray-100 text-[10px] text-gray-600">
                  +{role.extra}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function NotificationsPreview() {
  const notifications: {
    actor: { initials: string; tone: string };
    icon: React.ComponentType<{ className?: string }>;
    iconTone: string;
    body: React.ReactNode;
    time: string;
    unread: boolean;
    invitation?: { role: string };
  }[] = [
    {
      actor: { initials: "LT", tone: "bg-rose-300" },
      icon: Mail,
      iconTone: "text-violet-600",
      body: (
        <>
          <strong>Linh Tran</strong> invited you to join <strong>Mobile App v2</strong>
        </>
      ),
      time: "8m ago",
      unread: true,
      invitation: { role: "Reviewer" },
    },
    {
      actor: { initials: "AT", tone: "bg-amber-300" },
      icon: UserPlus,
      iconTone: "text-blue-600",
      body: (
        <>
          <strong>Anh Tu</strong> assigned you to <strong>Wire Notion database export</strong> in{" "}
          <em>Mobile App v2</em>
        </>
      ),
      time: "32m ago",
      unread: true,
    },
    {
      actor: { initials: "TN", tone: "bg-emerald-300" },
      icon: PenSquare,
      iconTone: "text-amber-600",
      body: (
        <>
          <strong>Tuan Nguyen</strong> updated <strong>Hero section redesign</strong> (priority,
          deadline) in <em>Q3 Marketing Site</em>
        </>
      ),
      time: "2h ago",
      unread: false,
    },
    {
      actor: { initials: "AC", tone: "bg-orange-300" },
      icon: AlertCircle,
      iconTone: "text-red-600",
      body: (
        <>
          Missed deadline on <strong>Calendar drag-to-schedule polish</strong> · was due May 7,
          5:00 PM
        </>
      ),
      time: "1d ago",
      unread: false,
    },
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-[#dcdcdc] bg-white shadow-2xl">
      <div className="flex items-center justify-between border-b border-[#dcdcdc] px-6 py-4">
        <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
        <button className="text-xs font-medium text-[#787878] hover:text-gray-900">
          Mark all as read
        </button>
      </div>

      <div className="flex gap-1 border-b border-gray-200 px-6">
        {[
          { label: "All", active: true },
          { label: "Workspace", active: false },
          { label: "Invitations", active: false },
        ].map((tab) => (
          <button
            key={tab.label}
            className={`border-b-2 px-4 py-2 text-sm font-medium transition ${
              tab.active
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-2 p-3">
        {notifications.map((n, i) => {
          const Icon = n.icon;
          return (
            <div
              key={i}
              className={`flex gap-3 rounded-lg border border-transparent px-4 py-3 ${
                n.unread ? "bg-blue-50/70" : "bg-white"
              }`}
            >
              <div className="relative shrink-0">
                <div
                  className={`flex size-9 items-center justify-center rounded-full text-xs font-semibold text-white ${n.actor.tone}`}
                >
                  {n.actor.initials}
                </div>
                <span className="absolute -right-1 -bottom-1 inline-flex size-5 items-center justify-center rounded-full bg-white shadow-sm">
                  <Icon className={`size-3 ${n.iconTone}`} />
                </span>
              </div>

              <div className="flex flex-1 flex-col gap-1">
                <p className="text-sm leading-snug text-gray-800">{n.body}</p>

                {n.invitation && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">Role:</span>
                    <Badge variant="secondary" className="text-[10px]">
                      {n.invitation.role}
                    </Badge>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">{n.time}</span>
                  {n.unread && <span className="size-2 rounded-full bg-blue-500" />}
                </div>

                {n.invitation && (
                  <div className="mt-2 flex gap-2">
                    <button className="h-7 rounded-md bg-[#413f39] px-3 text-xs font-medium text-white">
                      Accept
                    </button>
                    <button className="h-7 rounded-md border border-gray-200 bg-white px-3 text-xs font-medium text-gray-700">
                      Decline
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Spotlight({
  reverse,
  badge,
  title,
  body,
  bullets,
  preview,
}: {
  reverse?: boolean;
  badge: { label: string; tone: "blue" | "purple" | "rose" | "orange" | "indigo" };
  title: string;
  body: string;
  bullets: string[];
  preview: React.ReactNode;
}) {
  const badgeTones = {
    blue: "border-blue-200 bg-blue-50 text-blue-700",
    purple: "border-purple-200 bg-purple-50 text-purple-700",
    rose: "border-rose-200 bg-rose-50 text-rose-700",
    orange: "border-orange-200 bg-orange-50 text-orange-700",
    indigo: "border-indigo-200 bg-indigo-50 text-indigo-700",
  } as const;

  return (
    <div className="grid items-center gap-12 lg:grid-cols-2">
      <div className={reverse ? "lg:order-2" : undefined}>
        <Badge variant="outline" className={`mb-4 h-7 px-3 ${badgeTones[badge.tone]}`}>
          {badge.label}
        </Badge>
        <h3 className="mb-4 text-3xl leading-tight font-bold md:text-4xl">{title}</h3>
        <p className="mb-6 text-lg leading-relaxed text-gray-600">{body}</p>
        <ul className="space-y-3 text-sm text-gray-700">
          {bullets.map((b) => (
            <li key={b} className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-500" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className={reverse ? "lg:order-1" : undefined}>{preview}</div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-[#fbfaf7] text-gray-900">
      <header className="sticky top-0 z-30 border-b border-gray-200/60 bg-white/80 backdrop-blur">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/full-logo.svg" alt="Planwise" width={120} height={28} priority />
          </Link>

          <nav className="hidden items-center gap-7 md:flex">
            <a href="#features" className="text-sm text-gray-700 hover:text-gray-900">
              Features
            </a>
            <a href="#projects" className="text-sm text-gray-700 hover:text-gray-900">
              Projects
            </a>
            <a href="#notifications" className="text-sm text-gray-700 hover:text-gray-900">
              Notifications
            </a>
            <a href="#reviews" className="text-sm text-gray-700 hover:text-gray-900">
              Reviews
            </a>
            <a href="#integrations" className="text-sm text-gray-700 hover:text-gray-900">
              Integrations
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" className="h-9 px-4 text-sm">
              <Link href="/sign-in">Log in</Link>
            </Button>
            <Button
              asChild
              className="h-9 rounded-full bg-[#e85d4a] px-5 text-sm text-white hover:bg-[#d64d3a]"
            >
              <Link href="/sign-up">Sign up</Link>
            </Button>
          </div>
        </div>
      </header>

      <section className="container mx-auto px-6 pt-20 pb-16 text-center">
        <Badge
          variant="outline"
          className="mb-6 h-7 gap-1.5 border-orange-200 bg-orange-50 px-3 text-orange-700"
        >
          <Sparkles className="size-3" />
          Built for small teams
        </Badge>
        <h1 className="mx-auto mb-5 max-w-3xl text-5xl leading-[1.05] font-bold text-balance md:text-6xl">
          Plan together. Ship together.
        </h1>
        <p className="mx-auto mb-9 max-w-xl text-lg text-pretty text-gray-600">
          Projects, tasks, channels, and reviews in one workspace — synced with Google Calendar,
          Notion, and Gmail so your team always knows what to do today.
        </p>
        <div className="mb-3 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button
            asChild
            className="h-12 rounded-full bg-[#e85d4a] px-7 text-base text-white hover:bg-[#d64d3a]"
          >
            <Link href="/sign-up">
              Start free
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="h-12 rounded-full border-gray-300 px-7 text-base"
          >
            <Link href="/sign-in">Sign in</Link>
          </Button>
        </div>
        <p className="text-xs text-gray-500">Free for small teams · No credit card required</p>
      </section>

      <section className="container mx-auto px-6 pb-24">
        <KanbanPreview />
      </section>

      <section id="features" className="container mx-auto scroll-mt-20 px-6 py-20">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <h2 className="mb-4 text-4xl leading-tight font-bold md:text-5xl">
            Everything your team needs in one place
          </h2>
          <p className="text-lg text-gray-600">
            Stop bouncing between four tools to run a project. Planwise brings planning, execution,
            and reflection together.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, body }) => (
            <Card key={title} className="border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-orange-50 text-[#e85d4a]">
                <Icon className="size-5" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">{title}</h3>
              <p className="text-sm leading-relaxed text-gray-600">{body}</p>
            </Card>
          ))}
        </div>
      </section>

      <section id="projects" className="container mx-auto scroll-mt-20 px-6 py-20">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="mb-4 text-4xl leading-tight font-bold md:text-5xl">
            Run projects the way your team works
          </h2>
          <p className="text-lg text-gray-600">
            Spin up a project in seconds, lock down access with custom roles, and bring teammates
            in with one click.
          </p>
        </div>

        <div className="space-y-24">
          <Spotlight
            badge={{ label: "Create a project", tone: "orange" }}
            title="From zero to a working board in one minute."
            body="Give the project a name, drop a logo, and write a one-line goal. Sections, kanban, list, channels, members, and roles are wired up automatically."
            bullets={[
              "Name, description, and uploadable logo",
              "Pre-built sections you can rename or reorder",
              "Kanban, List, Channels, Roles, and Overview from day one",
            ]}
            preview={<ProjectModalPreview />}
          />

          <Spotlight
            reverse
            badge={{ label: "Roles & members", tone: "indigo" }}
            title="Custom roles. Default roles. Permissions that actually fit."
            body="Build any role you need with fine-grained permissions, mark one as the default for new joiners, and assign members per project. Search, invite, and rotate roles without breaking anything."
            bullets={[
              "Custom roles with checkbox-style permission badges",
              "One role marked as 'Default' — applies to every new member",
              "Member avatars per role with overflow chips",
              "Searchable member list and email invitations",
            ]}
            preview={<RolesPreview />}
          />
        </div>
      </section>

      <section id="notifications" className="container mx-auto scroll-mt-20 px-6 py-20">
        <Spotlight
          badge={{ label: "Notifications", tone: "blue" }}
          title="One inbox for everything that needs you."
          body="Assignments, task updates, deadline reminders, missed deadlines, project invites, and accepted/declined responses — all in one place. Tabs split workspace activity from invitations, and unread items stay highlighted until you open them."
          bullets={[
            "All / Workspace / Invitations tabs",
            "Accept or decline project invitations inline",
            "Click a notification to jump straight into the task",
            "Mark all as read when you're caught up",
          ]}
          preview={<NotificationsPreview />}
        />
      </section>

      <section id="reviews" className="container mx-auto scroll-mt-20 px-6 py-20">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <Badge
              variant="outline"
              className="mb-4 h-7 border-emerald-200 bg-emerald-50 px-3 text-emerald-700"
            >
              <BarChart3 className="size-3" />
              Reviews
            </Badge>
            <h2 className="mb-4 text-4xl leading-tight font-bold">
              See how the team is actually doing.
            </h2>
            <p className="mb-6 text-lg leading-relaxed text-gray-600">
              The Reviews dashboard rolls up activity, completed tasks, status and priority
              breakdowns, and per-period highlights — so leads spend less time chasing updates and
              more time helping.
            </p>
            <ul className="space-y-3 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 size-4 text-emerald-500" />
                <span>Toggle between Week and Month views</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 size-4 text-emerald-500" />
                <span>KPIs with deltas vs the previous period</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 size-4 text-emerald-500" />
                <span>Status donut and activity timeline charts</span>
              </li>
            </ul>
          </div>
          <ReviewsPreview />
        </div>
      </section>

      <section id="integrations" className="container mx-auto scroll-mt-20 px-6 py-20">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="mb-4 text-4xl leading-tight font-bold md:text-5xl">
            Plays well with your stack
          </h2>
          <p className="text-lg text-gray-600">
            Connect the tools your team already uses. Planwise syncs both ways so nothing falls
            through the cracks.
          </p>
        </div>

        <div className="space-y-24">
          <Spotlight
            badge={{ label: "Google Calendar", tone: "blue" }}
            title="Your day, on the same page as your tasks."
            body="Connect a Google Calendar and see today's events as draggable blocks in the right sidebar. Create, move, and resize events without leaving Planwise."
            bullets={[
              "OAuth connect — multi-account supported",
              "Drag events to reschedule by 5-minute increments",
              "Filter visible calendars from the account header",
            ]}
            preview={<CalendarPreview />}
          />

          <Spotlight
            reverse
            badge={{ label: "Notion", tone: "purple" }}
            title="Pull Notion pages straight into your sprint."
            body="Browse your Notion databases, paste a page link to import it as a task, or drag a Planwise task onto a database to push it back to Notion."
            bullets={[
              "Search databases and import pages as tasks",
              "Quick-import by Notion URL",
              "Two-way: drag tasks to a database to export",
            ]}
            preview={<NotionPreview />}
          />

          <Spotlight
            badge={{ label: "Gmail", tone: "rose" }}
            title="Turn email into action without context-switching."
            body="Read your inbox in the right sidebar and drag any email onto a section to convert it into a task — subject, body, sender, all preserved."
            bullets={[
              "Inbox preview with read/unread state",
              "Drag-and-drop emails into tasks",
              "Open the full message in a viewer modal",
            ]}
            preview={<GmailPreview />}
          />
        </div>
      </section>

      <section id="pricing" className="container mx-auto scroll-mt-20 px-6 pt-16 pb-24">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-orange-50 via-white to-purple-50 px-8 py-16 text-center shadow-sm md:px-16">
          <div className="mx-auto mb-6 flex size-14 items-center justify-center rounded-full bg-[#e85d4a] text-white">
            <Sparkles className="size-6" />
          </div>
          <h2 className="mb-3 text-4xl leading-tight font-bold md:text-5xl">
            Get your team moving.
          </h2>
          <p className="mx-auto mb-8 max-w-xl text-lg text-gray-600">
            Spin up a workspace in under a minute. Invite teammates, plug in your calendar, and run
            your first sprint today.
          </p>
          <Button
            asChild
            className="h-12 rounded-full bg-[#e85d4a] px-7 text-base text-white hover:bg-[#d64d3a]"
          >
            <Link href="/sign-up">
              Create your workspace
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </section>

      <footer className="border-t border-gray-200 bg-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid gap-10 md:grid-cols-4">
            <div>
              <Image src="/full-logo.svg" alt="Planwise" width={110} height={26} />
              <p className="mt-3 max-w-xs text-sm text-gray-500">
                The team workspace for projects, tasks, and the rituals around them.
              </p>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-semibold text-gray-900">Product</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#features" className="hover:text-gray-900">Features</a></li>
                <li><a href="#projects" className="hover:text-gray-900">Projects & roles</a></li>
                <li><a href="#notifications" className="hover:text-gray-900">Notifications</a></li>
                <li><a href="#reviews" className="hover:text-gray-900">Reviews</a></li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-semibold text-gray-900">Integrations</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#integrations" className="hover:text-gray-900">Google Calendar</a></li>
                <li><a href="#integrations" className="hover:text-gray-900">Notion</a></li>
                <li><a href="#integrations" className="hover:text-gray-900">Gmail</a></li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-semibold text-gray-900">Get started</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="/sign-up" className="hover:text-gray-900">Sign up</Link></li>
                <li><Link href="/sign-in" className="hover:text-gray-900">Log in</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-gray-200 pt-6 text-center text-xs text-gray-500">
            © 2026 Planwise
          </div>
        </div>
      </footer>
    </div>
  );
}
