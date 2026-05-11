export type Priority = "low" | "medium" | "high";
export type ProjectStatus = "planning" | "active" | "on_hold" | "completed";

export type Project = {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  priority: Priority;
  dueDate: string;
  progress: number;
  members: string[];
};

export type Task = {
  id: string;
  projectId: string;
  title: string;
  completed: boolean;
  priority: Priority;
  tags: string[];
  dueDate: string;
};

export type Member = {
  id: string;
  name: string;
  role: string;
  avatarColor: string;
  initials: string;
  online: boolean;
};

export type Activity = {
  id: string;
  user: string;
  action: string;
  target: string;
  time: string;
};

export const members: Member[] = [
  { id: "1", name: "Aria Chen", role: "Product Lead", avatarColor: "from-indigo-500 to-purple-500", initials: "AC", online: true },
  { id: "2", name: "Marcus Reid", role: "Engineer", avatarColor: "from-pink-500 to-rose-500", initials: "MR", online: true },
  { id: "3", name: "Sana Patel", role: "Designer", avatarColor: "from-emerald-500 to-teal-500", initials: "SP", online: false },
  { id: "4", name: "Leo Park", role: "Engineer", avatarColor: "from-amber-500 to-orange-500", initials: "LP", online: true },
  { id: "5", name: "Mia Torres", role: "QA Lead", avatarColor: "from-sky-500 to-blue-500", initials: "MT", online: false },
];

export const initialProjects: Project[] = [
  {
    id: "p1",
    name: "Atlas Mobile App",
    description: "Cross-platform redesign for the consumer launch.",
    status: "active",
    priority: "high",
    dueDate: "2026-06-12",
    progress: 68,
    members: ["1", "2", "3"],
  },
  {
    id: "p2",
    name: "Marketing Site v3",
    description: "Refresh the public website with new brand system.",
    status: "active",
    priority: "medium",
    dueDate: "2026-05-28",
    progress: 42,
    members: ["3", "4"],
  },
  {
    id: "p3",
    name: "Billing Migration",
    description: "Move subscriptions from legacy provider to in-house.",
    status: "planning",
    priority: "high",
    dueDate: "2026-07-04",
    progress: 18,
    members: ["2", "4", "5"],
  },
  {
    id: "p4",
    name: "Onboarding Revamp",
    description: "Reduce time-to-value for new workspaces.",
    status: "completed",
    priority: "medium",
    dueDate: "2026-04-30",
    progress: 100,
    members: ["1", "3"],
  },
];

export const initialTasks: Task[] = [
  { id: "t1", projectId: "p1", title: "Wire up auth screens", completed: true, priority: "high", tags: ["frontend", "auth"], dueDate: "2026-05-08" },
  { id: "t2", projectId: "p1", title: "Build onboarding tour", completed: false, priority: "medium", tags: ["frontend"], dueDate: "2026-05-14" },
  { id: "t3", projectId: "p1", title: "Implement push notifications", completed: false, priority: "high", tags: ["mobile"], dueDate: "2026-05-09" },
  { id: "t4", projectId: "p2", title: "Refresh hero section", completed: true, priority: "medium", tags: ["design"], dueDate: "2026-05-05" },
  { id: "t5", projectId: "p2", title: "Pricing page A/B test", completed: false, priority: "low", tags: ["growth"], dueDate: "2026-05-22" },
  { id: "t6", projectId: "p3", title: "Map legacy plans", completed: false, priority: "high", tags: ["backend", "billing"], dueDate: "2026-05-12" },
  { id: "t7", projectId: "p3", title: "Stripe webhook handlers", completed: false, priority: "high", tags: ["backend"], dueDate: "2026-05-18" },
  { id: "t8", projectId: "p4", title: "Final QA pass", completed: true, priority: "medium", tags: ["qa"], dueDate: "2026-04-28" },
  { id: "t9", projectId: "p1", title: "Accessibility audit", completed: false, priority: "medium", tags: ["a11y"], dueDate: "2026-05-20" },
  { id: "t10", projectId: "p2", title: "Blog CMS integration", completed: true, priority: "low", tags: ["cms"], dueDate: "2026-05-02" },
];

export const activities: Activity[] = [
  { id: "a1", user: "Aria Chen", action: "completed task", target: "Wire up auth screens", time: "12m ago" },
  { id: "a2", user: "Marcus Reid", action: "created project", target: "Billing Migration", time: "1h ago" },
  { id: "a3", user: "Sana Patel", action: "commented on", target: "Refresh hero section", time: "3h ago" },
  { id: "a4", user: "Leo Park", action: "updated priority of", target: "Stripe webhook handlers", time: "5h ago" },
  { id: "a5", user: "Mia Torres", action: "marked complete", target: "Final QA pass", time: "Yesterday" },
];

export const productivityTrend = [
  { day: "Mon", completed: 8, created: 12 },
  { day: "Tue", completed: 11, created: 9 },
  { day: "Wed", completed: 14, created: 13 },
  { day: "Thu", completed: 9, created: 11 },
  { day: "Fri", completed: 17, created: 14 },
  { day: "Sat", completed: 6, created: 4 },
  { day: "Sun", completed: 4, created: 3 },
];

export const weeklyPerformance = [
  { week: "W1", score: 62 },
  { week: "W2", score: 71 },
  { week: "W3", score: 68 },
  { week: "W4", score: 84 },
  { week: "W5", score: 79 },
  { week: "W6", score: 91 },
];
