import { createFileRoute } from "@tanstack/react-router";
import { TasksPage } from "@/components/pages/TasksPage";

export const Route = createFileRoute("/_app/tasks")({
  component: TasksPage,
  head: () => ({ meta: [{ title: "Tasks · TaskFlow AI" }] }),
});
