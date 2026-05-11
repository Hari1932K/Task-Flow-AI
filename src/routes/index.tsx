import { createFileRoute } from "@tanstack/react-router";
import { LandingPage } from "@/components/pages/LandingPage";

export const Route = createFileRoute("/")({
  component: LandingPage,
  head: () => ({
    meta: [
      { title: "TaskFlow AI · The intelligent productivity workspace" },
      { name: "description", content: "TaskFlow AI is a modern SaaS workspace to plan projects, manage tasks, and get smart productivity insights — beautifully organized." },
      { property: "og:title", content: "TaskFlow AI" },
      { property: "og:description", content: "Plan projects, manage tasks, and get smart productivity insights." },
    ],
  }),
});
