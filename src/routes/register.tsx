import { createFileRoute } from "@tanstack/react-router";
import { RegisterPage } from "@/components/auth/RegisterPage";

export const Route = createFileRoute("/register")({
  component: RegisterPage,
  head: () => ({
    meta: [
      { title: "Create account · TaskFlow AI" },
      { name: "description", content: "Create your free TaskFlow AI workspace." },
    ],
  }),
});
