import { useMemo } from "react";
import { PageHeader } from "@/components/layout/AppShell";
import { useData } from "@/lib/store";
import { activities, members } from "@/lib/mock-data";
import { useAISuggestions } from "@/lib/ai-suggestions";
import { FolderKanban, ListChecks, CheckCircle2, Clock, TrendingUp, Brain, AlertCircle } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, AreaChart, Area } from "recharts";
import { productivityTrend } from "@/lib/mock-data";

export function DashboardPage() {
  const { projects, tasks } = useData();

  const stats = useMemo(() => {
    const completed = tasks.filter((t) => t.completed).length;
    const pending = tasks.length - completed;
    const productivity = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;
    return { completed, pending, productivity };
  }, [tasks]);

  const suggestions = useAISuggestions();

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="A snapshot of your workspace today." />

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
        <StatCard icon={FolderKanban} label="Projects" value={projects.length} accent="from-indigo-500 to-purple-500" />
        <StatCard icon={ListChecks} label="Total Tasks" value={tasks.length} accent="from-sky-500 to-indigo-500" />
        <StatCard icon={CheckCircle2} label="Completed" value={stats.completed} accent="from-emerald-500 to-teal-500" />
        <StatCard icon={Clock} label="Pending" value={stats.pending} accent="from-amber-500 to-orange-500" />
        <StatCard icon={TrendingUp} label="Productivity" value={`${stats.productivity}%`} accent="from-fuchsia-500 to-pink-500" />
      </div>

      <div className="grid lg:grid-cols-3 gap-5 mt-6">
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-display font-bold text-lg">Productivity this week</h2>
              <p className="text-xs text-muted-foreground">Tasks completed vs. created</p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={productivityTrend} margin={{ left: -20, right: 5, top: 5 }}>
                <defs>
                  <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.62 0.22 285)" stopOpacity={0.55} />
                    <stop offset="100%" stopColor="oklch(0.62 0.22 285)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="g2" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.55 0.24 305)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="oklch(0.55 0.24 305)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="oklch(1 0 0 / 0.06)" vertical={false} />
                <XAxis dataKey="day" stroke="oklch(0.68 0.02 280)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="oklch(0.68 0.02 280)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "oklch(0.17 0.035 280)", border: "1px solid oklch(1 0 0 / 0.1)", borderRadius: 10, fontSize: 12 }} />
                <Area type="monotone" dataKey="completed" stroke="oklch(0.62 0.22 285)" fill="url(#g1)" strokeWidth={2} />
                <Area type="monotone" dataKey="created" stroke="oklch(0.55 0.24 305)" fill="url(#g2)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Brain size={16} className="text-primary" />
            <h2 className="font-display font-bold text-lg">AI Suggestions</h2>
          </div>
          <div className="space-y-3">
            {suggestions.map((s) => (
              <div key={s.title} className="p-3 rounded-xl border border-border bg-background/40 flex gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  s.tone === "warning" ? "bg-warning/15 text-warning"
                    : s.tone === "danger" ? "bg-destructive/15 text-destructive"
                    : "bg-primary/15 text-primary"
                }`}>
                  <AlertCircle size={15} />
                </div>
                <div>
                  <p className="text-sm font-semibold">{s.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{s.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-5 mt-5">
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-5">
          <h2 className="font-display font-bold text-lg mb-4">Recent activity</h2>
          <ul className="space-y-3">
            {activities.map((a) => {
              const m = members.find((x) => x.name === a.user);
              return (
                <li key={a.id} className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${m?.avatarColor ?? "from-indigo-500 to-purple-500"} text-white text-xs font-semibold flex items-center justify-center`}>
                    {m?.initials ?? a.user.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">
                      <span className="font-semibold">{a.user}</span>{" "}
                      <span className="text-muted-foreground">{a.action}</span>{" "}
                      <span className="font-medium">{a.target}</span>
                    </p>
                    <p className="text-[11px] text-muted-foreground">{a.time}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5">
          <h2 className="font-display font-bold text-lg mb-4">Project momentum</h2>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={productivityTrend.map((d) => ({ day: d.day, score: d.completed * 6 }))} margin={{ left: -20, right: 5 }}>
                <CartesianGrid stroke="oklch(1 0 0 / 0.06)" vertical={false} />
                <XAxis dataKey="day" stroke="oklch(0.68 0.02 280)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="oklch(0.68 0.02 280)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "oklch(0.17 0.035 280)", border: "1px solid oklch(1 0 0 / 0.1)", borderRadius: 10, fontSize: 12 }} />
                <Line type="monotone" dataKey="score" stroke="oklch(0.72 0.18 155)" strokeWidth={2.5} dot={{ r: 3, fill: "oklch(0.72 0.18 155)" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, accent }: { icon: React.ElementType; label: string; value: number | string; accent: string }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-4 relative overflow-hidden">
      <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${accent} flex items-center justify-center mb-3`}>
        <Icon size={16} className="text-white" />
      </div>
      <div className="font-display font-extrabold text-2xl tracking-tight">{value}</div>
      <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
    </div>
  );
}
