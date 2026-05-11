import { createFileRoute } from "@tanstack/react-router";
import { AnalyticsPage } from "@/components/pages/AnalyticsPage";

export const Route = createFileRoute("/_app/analytics")({
  component: AnalyticsPage,
  head: () => ({ meta: [{ title: "Analytics · TaskFlow AI" }] }),
});
