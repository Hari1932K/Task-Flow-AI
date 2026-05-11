import { Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles, BarChart3, Users, ListChecks, Brain, Shield } from "lucide-react";
import { Logo } from "@/components/Logo";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute -top-40 -left-32 w-[700px] h-[700px] rounded-full pointer-events-none animate-orb1"
           style={{ background: "radial-gradient(circle, oklch(0.62 0.22 285 / 0.18), transparent 65%)" }} />
      <div className="absolute -bottom-40 -right-32 w-[600px] h-[600px] rounded-full pointer-events-none animate-orb2"
           style={{ background: "radial-gradient(circle, oklch(0.55 0.24 305 / 0.16), transparent 65%)" }} />
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
           style={{ backgroundImage: "linear-gradient(white 0.5px, transparent 0.5px), linear-gradient(90deg, white 0.5px, transparent 0.5px)", backgroundSize: "56px 56px" }} />

      <header className="relative z-10 max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        <Logo />
        <nav className="hidden md:flex items-center gap-7 text-sm text-muted-foreground">
          <a href="#features" className="hover:text-foreground transition">Features</a>
          <a href="#analytics" className="hover:text-foreground transition">Analytics</a>
          <a href="#pricing" className="hover:text-foreground transition">Pricing</a>
        </nav>
        <div className="flex items-center gap-2">
          <Link to="/login" className="text-sm px-4 py-2 rounded-lg hover:bg-accent transition">Sign in</Link>
          <Link to="/register" className="text-sm px-4 py-2 rounded-lg bg-gradient-brand text-white font-semibold shadow-glow">
            Get started
          </Link>
        </div>
      </header>

      <section className="relative z-10 max-w-5xl mx-auto px-6 pt-16 md:pt-24 pb-20 text-center animate-fade-up">
        <span className="inline-flex items-center gap-1.5 bg-primary/10 border border-primary/20 rounded-full px-3 py-1 mb-6">
          <Sparkles size={12} className="text-primary" />
          <span className="text-[11px] font-medium tracking-[0.08em] text-primary">AI-POWERED PRODUCTIVITY</span>
        </span>
        <h1 className="font-display font-extrabold text-5xl md:text-7xl tracking-tight leading-[1.05]">
          Your work,{" "}
          <span className="text-gradient-brand">beautifully<br />organized.</span>
        </h1>
        <p className="mt-6 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
          TaskFlow AI brings projects, tasks, analytics, and intelligent suggestions into a single, calm workspace built for modern teams.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Link to="/register" className="px-6 py-3 rounded-xl bg-gradient-brand text-white text-sm font-semibold shadow-glow flex items-center gap-2 relative overflow-hidden shimmer-overlay">
            <span className="relative z-10 flex items-center gap-2">Start free <ArrowRight size={15} /></span>
          </Link>
          <Link to="/login" className="px-6 py-3 rounded-xl border border-border text-sm font-medium hover:bg-accent transition">
            Sign in
          </Link>
        </div>
        <div className="mt-14 flex justify-center gap-8 md:gap-14 text-center">
          <Stat value="12K+" label="Active teams" />
          <Stat value="98%" label="Uptime" />
          <Stat value="4.9★" label="Avg rating" />
        </div>
      </section>

      <section id="features" className="relative z-10 max-w-6xl mx-auto px-6 pb-24">
        <div className="text-center mb-12">
          <h2 className="font-display font-extrabold text-3xl md:text-4xl tracking-tight">Everything your team needs</h2>
          <p className="text-muted-foreground mt-3">A focused toolkit instead of a sprawling suite.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f) => (
            <div key={f.title} className="group bg-card border border-border rounded-2xl p-6 hover:border-primary/40 transition relative overflow-hidden">
              <div className="w-10 h-10 rounded-lg bg-gradient-brand flex items-center justify-center mb-4 shadow-glow">
                <f.icon size={18} className="text-white" />
              </div>
              <h3 className="font-display font-bold text-lg mb-1.5">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="relative z-10 border-t border-border py-8 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} TaskFlow AI · Built for the YS Innovations technical assessment.
      </footer>
    </div>
  );
}

const features = [
  { title: "Smart projects", desc: "Status, priority, due dates, and progress — all visible at a glance.", icon: ListChecks },
  { title: "Focused tasks", desc: "Tags, priorities, and lightning-fast filters keep you in flow.", icon: Sparkles },
  { title: "Live analytics", desc: "Productivity trends and weekly performance, not vanity numbers.", icon: BarChart3 },
  { title: "AI suggestions", desc: "Smart nudges flag overdue work and what to focus on next.", icon: Brain },
  { title: "Team collaboration", desc: "Avatars, comments, and an activity timeline for context.", icon: Users },
  { title: "Secure by default", desc: "Authentication and protected routes ship out of the box.", icon: Shield },
];

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="font-display font-extrabold text-2xl md:text-3xl">{value}</div>
      <div className="text-xs text-muted-foreground mt-1">{label}</div>
    </div>
  );
}
