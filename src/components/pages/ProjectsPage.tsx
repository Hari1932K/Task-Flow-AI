import { useState } from "react";
import { PageHeader } from "@/components/layout/AppShell";
import { useData } from "@/lib/store";
import { members, type Priority, type ProjectStatus } from "@/lib/mock-data";
import { Plus, Trash2, Calendar, Flag, X } from "lucide-react";

const statusLabels: Record<ProjectStatus, string> = {
  planning: "Planning", active: "Active", on_hold: "On hold", completed: "Completed",
};
const statusStyles: Record<ProjectStatus, string> = {
  planning: "bg-sky-500/15 text-sky-300 border-sky-500/30",
  active: "bg-primary/15 text-primary border-primary/30",
  on_hold: "bg-warning/15 text-warning border-warning/30",
  completed: "bg-success/15 text-success border-success/30",
};
const priorityStyles: Record<Priority, string> = {
  low: "text-sky-300", medium: "text-warning", high: "text-destructive",
};

export function ProjectsPage() {
  const { projects, addProject, updateProject, deleteProject, tasks } = useData();
  const [open, setOpen] = useState(false);

  return (
    <div>
      <PageHeader
        title="Projects"
        subtitle="Plan, prioritize, and ship your work."
        action={
          <button onClick={() => setOpen(true)}
            className="px-4 py-2.5 rounded-lg bg-gradient-brand text-white text-sm font-semibold flex items-center gap-2 shadow-glow">
            <Plus size={15} /> New project
          </button>
        }
      />

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {projects.map((p) => {
          const projectTasks = tasks.filter((t) => t.projectId === p.id);
          const done = projectTasks.filter((t) => t.completed).length;
          const progress = projectTasks.length ? Math.round((done / projectTasks.length) * 100) : p.progress;
          return (
            <div key={p.id} className="group bg-card border border-border rounded-2xl p-5 hover:border-primary/40 transition">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-display font-bold text-lg truncate">{p.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-0.5">{p.description}</p>
                </div>
                <button onClick={() => deleteProject(p.id)} aria-label="Delete project"
                  className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition">
                  <Trash2 size={14} />
                </button>
              </div>

              <div className="flex flex-wrap gap-2 mt-3">
                <select value={p.status}
                  onChange={(e) => updateProject(p.id, { status: e.target.value as ProjectStatus })}
                  className={`text-[11px] font-medium px-2.5 py-1 rounded-full border outline-none cursor-pointer ${statusStyles[p.status]}`}>
                  {Object.entries(statusLabels).map(([k, v]) => <option key={k} value={k} className="bg-card text-foreground">{v}</option>)}
                </select>
                <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full border border-border ${priorityStyles[p.priority]}`}>
                  <Flag size={11} /> {p.priority}
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground px-2.5 py-1 rounded-full border border-border">
                  <Calendar size={11} /> {new Date(p.dueDate).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                </span>
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                  <span>Progress</span><span className="font-semibold text-foreground">{progress}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-gradient-brand rounded-full transition-all" style={{ width: `${progress}%` }} />
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="flex -space-x-2">
                  {p.members.slice(0, 4).map((mid) => {
                    const m = members.find((x) => x.id === mid);
                    if (!m) return null;
                    return (
                      <div key={mid} title={m.name}
                        className={`w-7 h-7 rounded-full border-2 border-card bg-gradient-to-br ${m.avatarColor} flex items-center justify-center text-[10px] font-bold text-white`}>
                        {m.initials}
                      </div>
                    );
                  })}
                </div>
                <span className="text-[11px] text-muted-foreground">{projectTasks.length} task{projectTasks.length === 1 ? "" : "s"}</span>
              </div>
            </div>
          );
        })}
      </div>

      {open && <ProjectModal onClose={() => setOpen(false)} onCreate={(p) => { addProject(p); setOpen(false); }} />}
    </div>
  );
}

function ProjectModal({ onClose, onCreate }: { onClose: () => void; onCreate: (p: { name: string; description: string; status: ProjectStatus; priority: Priority; dueDate: string }) => void }) {
  const [form, setForm] = useState({
    name: "", description: "", status: "planning" as ProjectStatus, priority: "medium" as Priority,
    dueDate: new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
  });
  return (
    <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-up" onClick={onClose}>
      <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-md shadow-elevated" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-bold text-lg">New project</h3>
          <button onClick={onClose} className="p-1.5 rounded-md hover:bg-accent"><X size={16} /></button>
        </div>
        <div className="space-y-3">
          <Input label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} placeholder="Project name" />
          <Input label="Description" value={form.description} onChange={(v) => setForm({ ...form, description: v })} placeholder="What is this project about?" />
          <div className="grid grid-cols-2 gap-3">
            <Select label="Status" value={form.status} onChange={(v) => setForm({ ...form, status: v as ProjectStatus })}
              options={Object.entries(statusLabels).map(([k, v]) => ({ value: k, label: v }))} />
            <Select label="Priority" value={form.priority} onChange={(v) => setForm({ ...form, priority: v as Priority })}
              options={[{ value: "low", label: "Low" }, { value: "medium", label: "Medium" }, { value: "high", label: "High" }]} />
          </div>
          <Input label="Due date" type="date" value={form.dueDate} onChange={(v) => setForm({ ...form, dueDate: v })} />
        </div>
        <button disabled={!form.name}
          onClick={() => onCreate(form)}
          className="w-full mt-5 py-3 rounded-lg bg-gradient-brand text-white text-sm font-semibold disabled:opacity-50">
          Create project
        </button>
      </div>
    </div>
  );
}

export function Input({ label, value, onChange, placeholder, type = "text" }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <div>
      <label className="block text-[10px] font-medium tracking-[0.08em] text-muted-foreground/80 mb-1.5">{label.toUpperCase()}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="w-full bg-white/[0.03] border border-border rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-primary/60" />
    </div>
  );
}

export function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <div>
      <label className="block text-[10px] font-medium tracking-[0.08em] text-muted-foreground/80 mb-1.5">{label.toUpperCase()}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white/[0.03] border border-border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-primary/60">
        {options.map((o) => <option key={o.value} value={o.value} className="bg-card">{o.label}</option>)}
      </select>
    </div>
  );
}
