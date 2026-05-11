import { createFileRoute, redirect } from "@tanstack/react-router";
import { LoginPage } from "@/components/auth/LoginPage";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/login")({
  beforeLoad: async () => {
    if (typeof window === "undefined") return;
    const { user, initialized } = useAuth.getState();
    if (initialized && user) {
      throw redirect({ to: "/dashboard" });
    }
  },
  component: LoginPage,
});
