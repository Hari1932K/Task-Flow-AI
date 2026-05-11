import { PageHeader } from "@/components/layout/AppShell";
import { useData } from "@/lib/store";
import { productivityTrend, weeklyPerformance } from "@/lib/mock-data";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line, PieChart, Pie, Cell, Legend } from "recharts";

const COLORS = ["oklch(0.62 0.22 285)", "oklch(0.55 0.24 305)", "oklch(0.72 0.18 155)", "oklch(0.78 0.16 75)"];

export function AnalyticsPage() {
  const { tasks, projects } = useData();
  const completed = tasks.filter((t) => t.completed).length;
  const pending = tasks.length - completed;

  const completionData = [
    { name: "Completed", value: completed },
    { name: "Pending", value: pending },
  ];

  const projectProgress = projects.map((p) => {
    const pt = tasks.filter((t) => t.projectId === p.id);
    const done = pt.filter((t) => t.completed).length;
    return { name: p.name.length > 14 ? p.name.slice(0, 13) + "…" : p.name, progress: pt.length ? Math.round((done / pt.length) * 100) : p.progress };
  });

  return (
    <div>
      <PageHeader title="Analytics" subtitle="Productivity, trends, and project progress." />

      <div className="grid lg:grid-cols-2 gap-5">
        <Card title="Task completion">
          <div className="h-72 flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={completionData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={100} paddingAngle={3}>
                  {completionData.map((_, i) => <Cell key={i} fill={COLORS[i]} stroke="none" />)}
                </Pie>
                <Tooltip contentStyle={{ background: "oklch(0.17 0.035 280)", border: "1px solid oklch(1 0 0 / 0.1)", borderRadius: 10, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Weekly performance score">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyPerformance} margin={{ left: -20, right: 5 }}>
                <CartesianGrid stroke="oklch(1 0 0 / 0.06)" vertical={false} />
                <XAxis dataKey="week" stroke="oklch(0.68 0.02 280)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="oklch(0.68 0.02 280)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "oklch(0.17 0.035 280)", border: "1px solid oklch(1 0 0 / 0.1)", borderRadius: 10, fontSize: 12 }} />
                <Line type="monotone" dataKey="score" stroke="oklch(0.62 0.22 285)" strokeWidth={2.5} dot={{ r: 4, fill: "oklch(0.62 0.22 285)" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Productivity trend">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={productivityTrend} margin={{ left: -20, right: 5 }}>
                <CartesianGrid stroke="oklch(1 0 0 / 0.06)" vertical={false} />
                <XAxis dataKey="day" stroke="oklch(0.68 0.02 280)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="oklch(0.68 0.02 280)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "oklch(0.17 0.035 280)", border: "1px solid oklch(1 0 0 / 0.1)", borderRadius: 10, fontSize: 12 }} />
                <Bar dataKey="completed" fill="oklch(0.62 0.22 285)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="created" fill="oklch(0.55 0.24 305)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Project progress">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={projectProgress} layout="vertical" margin={{ left: 10, right: 20 }}>
                <CartesianGrid stroke="oklch(1 0 0 / 0.06)" horizontal={false} />
                <XAxis type="number" stroke="oklch(0.68 0.02 280)" fontSize={11} tickLine={false} axisLine={false} domain={[0, 100]} />
                <YAxis type="category" dataKey="name" stroke="oklch(0.68 0.02 280)" fontSize={11} tickLine={false} axisLine={false} width={90} />
                <Tooltip contentStyle={{ background: "oklch(0.17 0.035 280)", border: "1px solid oklch(1 0 0 / 0.1)", borderRadius: 10, fontSize: 12 }} />
                <Bar dataKey="progress" fill="oklch(0.72 0.18 155)" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-5">
      <h2 className="font-display font-bold text-lg mb-3">{title}</h2>
      {children}
    </div>
  );
}
