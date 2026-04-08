import { cn } from "@/lib/utils";

interface ScoreBadgeProps {
  score?: number;
  className?: string;
}

export function ScoreBadge({ score, className }: ScoreBadgeProps) {
  if (score === undefined || score === null) {
    return (
      <span
        className={cn("text-xs font-mono", className)}
        style={{ color: "#62666d" }}
      >
        —
      </span>
    );
  }

  const style =
    score >= 80
      ? {
          background: "rgba(16,185,129,0.15)",
          color: "#34d399",
          border: "1px solid rgba(16,185,129,0.25)",
        }
      : score >= 60
      ? {
          background: "rgba(245,158,11,0.15)",
          color: "#fbbf24",
          border: "1px solid rgba(245,158,11,0.25)",
        }
      : score >= 40
      ? {
          background: "rgba(249,115,22,0.15)",
          color: "#fb923c",
          border: "1px solid rgba(249,115,22,0.25)",
        }
      : {
          background: "rgba(239,68,68,0.15)",
          color: "#f87171",
          border: "1px solid rgba(239,68,68,0.25)",
        };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded text-xs font-bold font-mono",
        className
      )}
      style={style}
    >
      {score}
    </span>
  );
}
