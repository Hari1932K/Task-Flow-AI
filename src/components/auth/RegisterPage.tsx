import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Mail, Lock, User, ArrowRight } from "lucide-react";
import { Logo } from "@/components/Logo";
import { useAuth } from "@/lib/auth";

export function RegisterPage() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    if (!name || !email || password.length < 6) {
      setErr("Please fill all fields. Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      await signUp(name, email, password);
      // Supabase sends a confirmation email by default.
      // If email confirmations are disabled, user is signed in immediately.
      const { user } = useAuth.getState();
      if (user) {
        navigate({ to: "/dashboard" });
      } else {
        setEmailSent(true);
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Could not create your account.";
      setErr(msg.includes("already registered") ? "An account with this email already exists." : msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-background">
      <div className="absolute -top-40 -right-24 w-[500px] h-[500px] rounded-full animate-orb1"
           style={{ background: "radial-gradient(circle, oklch(0.55 0.24 305 / 0.16), transparent 65%)" }} />
      <div className="absolute -bottom-32 -left-16 w-[400px] h-[400px] rounded-full animate-orb2"
           style={{ background: "radial-gradient(circle, oklch(0.62 0.22 285 / 0.16), transparent 65%)" }} />

      <div className="relative z-10 w-full max-w-md bg-card border border-border rounded-2xl p-9 shadow-elevated animate-fade-up">
        <div className="flex justify-center mb-7"><Logo /></div>
        <div className="text-center mb-7">
          <h2 className="font-display font-extrabold text-2xl tracking-tight">Create your workspace</h2>
          <p className="text-xs text-muted-foreground mt-1">Start organizing in under a minute.</p>
        </div>

        {emailSent ? (
          <div className="rounded-lg bg-primary/10 border border-primary/20 p-5 text-center">
            <p className="font-semibold text-primary text-sm">Check your inbox!</p>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
              We sent a confirmation link to <strong>{email}</strong>. Click it to activate your account.
            </p>
            <Link to="/login" className="mt-4 inline-block text-xs font-semibold text-primary hover:underline">
              Back to sign in →
            </Link>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="flex flex-col gap-3.5">
            <Field icon={<User size={14} />} label="FULL NAME">
              <input value={name} onChange={(e) => setName(e.target.value)}
                placeholder="Ada Lovelace"
                className="w-full bg-white/[0.03] border border-border rounded-lg pl-10 pr-3.5 py-3 text-sm outline-none focus:border-primary/60 transition placeholder:text-muted-foreground/60" />
            </Field>
            <Field icon={<Mail size={14} />} label="EMAIL ADDRESS">
              <input type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-white/[0.03] border border-border rounded-lg pl-10 pr-3.5 py-3 text-sm outline-none focus:border-primary/60 transition placeholder:text-muted-foreground/60" />
            </Field>
            <Field icon={<Lock size={14} />} label="PASSWORD">
              <input type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full bg-white/[0.03] border border-border rounded-lg pl-10 pr-3.5 py-3 text-sm outline-none focus:border-primary/60 transition placeholder:text-muted-foreground/60" />
            </Field>

            {err && <p className="text-xs text-destructive">{err}</p>}

            <button type="submit" disabled={loading}
              className="relative w-full py-3 rounded-lg bg-gradient-brand text-white text-sm font-semibold overflow-hidden shimmer-overlay disabled:opacity-70 mt-1">
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? "Creating…" : "Create account"} {!loading && <ArrowRight size={14} />}
              </span>
            </button>
          </form>
        )}

        <p className="text-center text-xs text-muted-foreground/70 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-primary font-semibold hover:underline">Sign in</Link>
        </p>
      </div>
    </main>
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
