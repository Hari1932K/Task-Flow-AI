import { useMemo, useState } from "react";
import { PageHeader } from "@/components/layout/AppShell";
import { useData } from "@/lib/store";
import { type Priority } from "@/lib/mock-data";
import { Input, Select } from "./ProjectsPage";
import { Plus, Trash2, Search, X, Tag, Flag } from "lucide-react";

const priorityStyles: Record<Priority, string> = {
  low: "text-sky-300 border-sky-500/30 bg-sky-500/10",
  medium: "text-warning border-warning/30 bg-warning/10",
  high: "text-destructive border-destructive/30 bg-destructive/10",
};

export function TasksPage() {
  const { tasks, projects, addTask, toggleTask, deleteTask } = useData();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [pri, setPri] = useState<"all" | Priority>("all");
  const [proj, setProj] = useState<string>("all");
  const [status, setStatus] = useState<"all" | "completed" | "pending">("all");

  const filtered = useMemo(() => {
    return tasks.filter((t) => {
      if (q && !t.title.toLowerCase().includes(q.toLowerCase()) && !t.tags.some((x) => x.includes(q.toLowerCase()))) return false;
      if (pri !== "all" && t.priority !== pri) return false;
      if (proj !== "all" && t.projectId !== proj) return false;
      if (status === "completed" && !t.completed) return false;
      if (status === "pending" && t.completed) return false;
      return true;
    });
  }, [tasks, q, pri, proj, status]);

  return (
    <div>
      <PageHeader
        title="Tasks"
        subtitle="Search, filter, and check things off."
        action={
          <button onClick={() => setOpen(true)} className="px-4 py-2.5 rounded-lg bg-gradient-brand text-white text-sm font-semibold flex items-center gap-2 shadow-glow">
            <Plus size={15} /> New task
          </button>
        }
      />

      <div className="bg-card border border-border rounded-2xl p-4 mb-5">
        <div className="grid md:grid-cols-[1fr_auto_auto_auto] gap-3">
          <div className="relative">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by title or tag…"
              className="w-full bg-white/[0.03] border border-border rounded-lg pl-10 pr-3 py-2.5 text-sm outline-none focus:border-primary/60" />
          </div>
          <select value={proj} onChange={(e) => setProj(e.target.value)}
            className="bg-white/[0.03] border border-border rounded-lg px-3 py-2.5 text-sm outline-none">
            <option value="all" className="bg-card">All projects</option>
            {projects.map((p) => <option key={p.id} value={p.id} className="bg-card">{p.name}</option>)}
          </select>
          <select value={pri} onChange={(e) => setPri(e.target.value as Priority | "all")}
            className="bg-white/[0.03] border border-border rounded-lg px-3 py-2.5 text-sm outline-none">
            <option value="all" className="bg-card">Any priority</option>
            <option value="high" className="bg-card">High</option>
            <option value="medium" className="bg-card">Medium</option>
            <option value="low" className="bg-card">Low</option>
          </select>
          <select value={status} onChange={(e) => setStatus(e.target.value as "all" | "completed" | "pending")}
            className="bg-white/[0.03] border border-border rounded-lg px-3 py-2.5 text-sm outline-none">
            <option value="all" className="bg-card">All</option>
            <option value="pending" className="bg-card">Pending</option>
            <option value="completed" className="bg-card">Completed</option>
          </select>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl divide-y divide-border overflow-hidden">
        {filtered.length === 0 && (
          <div className="p-10 text-center text-sm text-muted-foreground">No tasks match your filters.</div>
        )}
        {filtered.map((t) => {
          const project = projects.find((p) => p.id === t.projectId);
          return (
            <div key={t.id} className="group flex items-center gap-3 p-4 hover:bg-accent/30 transition">
              <button onClick={() => toggleTask(t.id)}
                className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition ${
                  t.completed ? "bg-gradient-brand border-transparent" : "border-border hover:border-primary"
                }`}>
                {t.completed && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12l5 5L20 7" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${t.completed ? "line-through text-muted-foreground" : ""}`}>{t.title}</p>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  {project && <span className="text-[11px] text-muted-foreground">{project.name}</span>}
                  <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full border ${priorityStyles[t.priority]}`}>
                    <Flag size={9} /> {t.priority}
                  </span>
                  {t.tags.map((tag) => (
                    <span key={tag} className="inline-flex items-center gap-1 text-[10px] text-muted-foreground bg-muted/40 px-2 py-0.5 rounded-full">
                      <Tag size={9} /> {tag}
                    </span>
                  ))}
                  <span className="text-[10px] text-muted-foreground">
                    Due {new Date(t.dueDate).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                  </span>
                </div>
              </div>
              <button onClick={() => deleteTask(t.id)}
                className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition">
                <Trash2 size={14} />
              </button>
            </div>
          );
        })}
      </div>

      {open && <TaskModal onClose={() => setOpen(false)} onCreate={(t) => { addTask(t); setOpen(false); }} />}
    </div>
  );
}

function TaskModal({ onClose, onCreate }: { onClose: () => void; onCreate: (t: { projectId: string; title: string; priority: Priority; tags: string[]; dueDate: string }) => void }) {
  const { projects } = useData();
  const [form, setForm] = useState({
    projectId: projects[0]?.id ?? "", title: "", priority: "medium" as Priority,
    tags: "", dueDate: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
  });
  return (
    <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-up" onClick={onClose}>
      <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-md shadow-elevated" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-bold text-lg">New task</h3>
          <button onClick={onClose} className="p-1.5 rounded-md hover:bg-accent"><X size={16} /></button>
        </div>
        <div className="space-y-3">
          <Input label="Title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} placeholder="What needs doing?" />
          <Select label="Project" value={form.projectId} onChange={(v) => setForm({ ...form, projectId: v })}
            options={projects.map((p) => ({ value: p.id, label: p.name }))} />
          <div className="grid grid-cols-2 gap-3">
            <Select label="Priority" value={form.priority} onChange={(v) => setForm({ ...form, priority: v as Priority })}
              options={[{ value: "low", label: "Low" }, { value: "medium", label: "Medium" }, { value: "high", label: "High" }]} />
            <Input label="Due date" type="date" value={form.dueDate} onChange={(v) => setForm({ ...form, dueDate: v })} />
          </div>
          <Input label="Tags (comma separated)" value={form.tags} onChange={(v) => setForm({ ...form, tags: v })} placeholder="frontend, urgent" />
        </div>
        <button disabled={!form.title || !form.projectId}
          onClick={() => onCreate({ ...form, tags: form.tags.split(",").map((s) => s.trim()).filter(Boolean) })}
          className="w-full mt-5 py-3 rounded-lg bg-gradient-brand text-white text-sm font-semibold disabled:opacity-50">
          Add task
        </button>
      </div>
    </div>
  );
}
