import { createFileRoute } from "@tanstack/react-router";
import { TeamPage } from "@/components/pages/TeamPage";

export const Route = createFileRoute("/_app/team")({
  component: TeamPage,
  head: () => ({ meta: [{ title: "Team · TaskFlow AI" }] }),
});
