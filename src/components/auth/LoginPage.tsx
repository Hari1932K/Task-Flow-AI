import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { Logo } from "@/components/Logo";
import { useAuth } from "@/lib/auth";

export function LoginPage() {
  const navigate = useNavigate();
  const { signIn, resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    if (!email || !password) {
      setErr("Please enter your email and password.");
      return;
    }
    setLoading(true);
    try {
      await signIn(email, password);
      navigate({ to: "/dashboard" });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Could not sign you in.";
      setErr(msg.includes("Invalid login") ? "Invalid email or password." : msg);
    } finally {
      setLoading(false);
    }
  };

  const onForgotPassword = async () => {
    if (!email) {
      setErr("Enter your email address above, then click Forgot password.");
      return;
    }
    setLoading(true);
    setErr(null);
    try {
      await resetPassword(email);
      setResetSent(true);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Could not send reset email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-background">
      <div className="absolute -top-40 -left-24 w-[500px] h-[500px] rounded-full animate-orb1"
           style={{ background: "radial-gradient(circle, oklch(0.62 0.22 285 / 0.18), transparent 65%)" }} />
      <div className="absolute -bottom-32 -right-16 w-[400px] h-[400px] rounded-full animate-orb2"
           style={{ background: "radial-gradient(circle, oklch(0.55 0.24 305 / 0.15), transparent 65%)" }} />
      <div className="absolute inset-0 opacity-[0.04]"
           style={{ backgroundImage: "linear-gradient(white 0.5px, transparent 0.5px), linear-gradient(90deg, white 0.5px, transparent 0.5px)", backgroundSize: "56px 56px" }} />

      <div className="relative z-10 w-full max-w-[860px] grid md:grid-cols-[38%_1fr] rounded-2xl overflow-hidden border border-border shadow-elevated animate-fade-up">
        {/* Left brand panel */}
        <div className="bg-gradient-panel p-9 hidden md:flex flex-col justify-between relative overflow-hidden min-h-[560px]">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-60 h-60 rounded-full border border-primary/20" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 h-36 rounded-full border border-brand-2/25" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full"
               style={{ background: "radial-gradient(circle, oklch(0.62 0.22 285 / 0.35), transparent 70%)" }} />

          <div className="relative z-10">
            <Logo />
            <div className="mt-3 w-8 h-0.5 bg-gradient-brand rounded" />
          </div>

          <div className="relative z-10">
            <h1 className="font-display font-extrabold text-[26px] leading-[1.2] tracking-tight">
              Your work,<br />beautifully<br />organized.
            </h1>
            <p className="mt-3 text-sm text-muted-foreground font-light leading-relaxed">
              Manage projects, track tasks, and collaborate intelligently — all in one unified workspace.
            </p>
          </div>

          <div className="relative z-10 flex gap-6">
            <Stat value="12K+" label="Teams" />
            <Stat value="98%" label="Uptime" />
            <Stat value="4.9★" label="Rating" />
          </div>

          <div className="absolute top-9 right-6 flex gap-1">
            {[0, 0.4, 0.8, 1.2].map((d, i) => (
              <span key={i} className="w-1 h-1 rounded-full animate-pulse-dot"
                    style={{ background: i % 2 ? "oklch(0.55 0.24 305)" : "oklch(0.62 0.22 285)", animationDelay: `${d}s` }} />
            ))}
          </div>
        </div>

        {/* Right form panel */}
        <div className="bg-card p-10 flex flex-col justify-center">
          <div className="mb-7">
            <span className="inline-flex items-center gap-1.5 bg-primary/10 border border-primary/20 rounded-full px-2.5 py-0.5 mb-3.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span className="text-[10px] font-medium tracking-[0.08em] text-primary/90">SECURE LOGIN</span>
            </span>
            <h2 className="font-display font-extrabold text-2xl tracking-tight">Welcome back</h2>
            <p className="text-xs text-muted-foreground font-light mt-1">Sign in to continue to your workspace</p>
          </div>

          {resetSent ? (
            <div className="rounded-lg bg-primary/10 border border-primary/20 p-4 text-sm text-center">
              <p className="font-medium text-primary">Reset link sent!</p>
              <p className="text-xs text-muted-foreground mt-1">Check your email to reset your password.</p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="flex flex-col gap-3.5">
              <Field icon={<Mail size={14} />} label="EMAIL ADDRESS">
                <input
                  type="email" autoComplete="email" value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-white/[0.03] border border-border rounded-lg pl-10 pr-3.5 py-3 text-sm outline-none focus:border-primary/60 transition placeholder:text-muted-foreground/60"
                />
              </Field>
              <Field icon={<Lock size={14} />} label="PASSWORD">
                <input
                  type="password" autoComplete="current-password" value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/[0.03] border border-border rounded-lg pl-10 pr-3.5 py-3 text-sm outline-none focus:border-primary/60 transition placeholder:text-muted-foreground/60"
                />
              </Field>

              <div className="flex justify-end -mt-1">
                <button
                  type="button"
                  onClick={onForgotPassword}
                  className="text-[11px] font-medium text-primary/80 hover:text-primary"
                >
                  Forgot password?
                </button>
              </div>

              {err && <p className="text-xs text-destructive">{err}</p>}

              <button
                type="submit" disabled={loading}
                className="relative w-full py-3 rounded-lg bg-gradient-brand text-white text-sm font-semibold overflow-hidden shimmer-overlay disabled:opacity-70"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {loading ? "Signing in…" : "Sign In"}
                  {!loading && <ArrowRight size={14} />}
                </span>
              </button>
            </form>
          )}

          <div className="flex items-center gap-2.5 my-5">
            <div className="flex-1 h-px bg-white/5" />
            <span className="text-[10px] font-medium text-muted-foreground/40">OR</span>
            <div className="flex-1 h-px bg-white/5" />
          </div>

          <p className="text-center text-xs text-muted-foreground/70">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary font-semibold hover:underline">Create one →</Link>
          </p>
        </div>
      </div>
    </main>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="font-display font-extrabold text-base">{value}</div>
      <div className="text-[10px] text-muted-foreground/70 mt-0.5">{label}</div>
    </div>
  );
}

function Field({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block mb-1.5 text-[10px] font-medium tracking-[0.08em] text-muted-foreground/80">{label}</label>
      <div className="relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/50">{icon}</span>
        {children}
      </div>
    </div>
  );
}
