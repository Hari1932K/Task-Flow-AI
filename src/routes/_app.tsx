import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { useAuth } from "@/lib/auth";
import { useEffect } from "react";
import { useData } from "@/lib/store";

// Route guard: checks Supabase session cookie (server-safe) or client state
export const Route = createFileRoute("/_app")({
  beforeLoad: async () => {
    // On the server or if Supabase isn't configured, let the client handle it
    if (typeof window === "undefined") return;
    // Check auth state from zustand store (already initialized by AppInitializer)
    const { user, initialized } = useAuth.getState();
    if (initialized && !user) {
      throw redirect({ to: "/login" });
    }
  },
  component: AppLayoutComponent,
});

function AppLayoutComponent() {
  const user = useAuth((s) => s.user);
  const initialized = useAuth((s) => s.initialized);
  const loadAll = useData((s) => s.loadAll);
  const reset = useData((s) => s.reset);

  // Load all data when user is authenticated
  useEffect(() => {
    if (user?.id) {
      void loadAll(user.id);
    } else if (initialized && !user) {
      reset();
    }
  }, [user?.id, initialized]);

  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}
