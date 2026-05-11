import { Link } from "@tanstack/react-router";
import { CheckSquare } from "lucide-react";

export function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const px = size === "sm" ? 28 : size === "lg" ? 40 : 32;
  const text = size === "sm" ? "text-base" : size === "lg" ? "text-2xl" : "text-lg";
  return (
    <Link to="/" className="flex items-center gap-2.5 group">
      <div
        className="bg-gradient-brand rounded-lg flex items-center justify-center shadow-glow"
        style={{ width: px, height: px }}
      >
        <CheckSquare className="text-white" style={{ width: px * 0.5, height: px * 0.5 }} strokeWidth={2.2} />
      </div>
      <span className={`font-display font-extrabold tracking-tight ${text}`}>
        TaskFlow<span className="text-gradient-brand">AI</span>
      </span>
    </Link>
  );
}
