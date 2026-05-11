import { useMemo } from "react";
import { useData } from "./store";

export type Suggestion = {
  title: string;
  detail: string;
  tone: "info" | "warning" | "danger";
};

export function useAISuggestions(): Suggestion[] {
  const { projects, tasks } = useData();

  return useMemo(() => {
    const now = new Date();
    const overdue = tasks.filter((t) => !t.completed && new Date(t.dueDate) < now);
    const highPending = tasks.filter((t) => !t.completed && t.priority === "high");
    const completionRate = tasks.length ? tasks.filter((t) => t.completed).length / tasks.length : 0;
    const activeProjects = projects.filter((p) => p.status === "active");
    const nearestDue = [...projects]
      .filter((p) => p.status !== "completed")
      .sort((a, b) => +new Date(a.dueDate) - +new Date(b.dueDate))[0];

    const out: Suggestion[] = [];

    if (overdue.length > 0) {
      out.push({
        title: `${overdue.length} task${overdue.length > 1 ? "s are" : " is"} overdue`,
        detail: "Reschedule or close them to keep momentum.",
        tone: "danger",
      });
    }
    if (highPending.length > 0) {
      out.push({
        title: `${highPending.length} high-priority task${highPending.length > 1 ? "s" : ""} need attention`,
        detail: "Tackle these next to unblock your team.",
        tone: "warning",
      });
    }
    if (completionRate < 0.5) {
      out.push({
        title: "Productivity below 50%",
        detail: "Try focusing on smaller tasks to build momentum.",
        tone: "warning",
      });
    } else {
      out.push({
        title: "You're on a roll 🚀",
        detail: `Completion rate at ${Math.round(completionRate * 100)}% — keep it up.`,
        tone: "info",
      });
    }
    if (nearestDue) {
      const days = Math.max(0, Math.ceil((+new Date(nearestDue.dueDate) - +now) / (1000 * 60 * 60 * 24)));
      out.push({
        title: `${nearestDue.name} due in ${days} day${days === 1 ? "" : "s"}`,
        detail: "Estimated completion looks on track at current pace.",
        tone: days <= 7 ? "warning" : "info",
      });
    }
    if (activeProjects.length >= 3) {
      out.push({
        title: "You're juggling several active projects",
        detail: "Consider archiving lower-priority work to focus.",
        tone: "info",
      });
    }
    return out.slice(0, 5);
  }, [projects, tasks]);
}
