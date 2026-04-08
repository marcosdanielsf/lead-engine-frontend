import { cn } from "@/lib/utils";

const stageConfig: Record<string, { label: string; style: React.CSSProperties }> = {
  raw: {
    label: "Raw",
    style: { background: "rgba(255,255,255,0.06)", color: "#d0d6e0", border: "1px solid rgba(255,255,255,0.10)" },
  },
  new: {
    label: "New",
    style: { background: "rgba(255,255,255,0.06)", color: "#d0d6e0", border: "1px solid rgba(255,255,255,0.10)" },
  },
  enriched: {
    label: "Enriched",
    style: { background: "rgba(94,106,210,0.18)", color: "#818cf8", border: "1px solid rgba(94,106,210,0.30)" },
  },
  queued: {
    label: "Queued",
    style: { background: "rgba(245,158,11,0.15)", color: "#fbbf24", border: "1px solid rgba(245,158,11,0.25)" },
  },
  contacted: {
    label: "Contacted",
    style: { background: "rgba(139,92,246,0.15)", color: "#a78bfa", border: "1px solid rgba(139,92,246,0.25)" },
  },
  replied: {
    label: "Replied",
    style: { background: "rgba(99,102,241,0.18)", color: "#818cf8", border: "1px solid rgba(99,102,241,0.30)" },
  },
  scheduled: {
    label: "Scheduled",
    style: { background: "rgba(249,115,22,0.15)", color: "#fb923c", border: "1px solid rgba(249,115,22,0.25)" },
  },
  converted: {
    label: "Converted",
    style: { background: "rgba(16,185,129,0.15)", color: "#34d399", border: "1px solid rgba(16,185,129,0.25)" },
  },
  prospected: {
    label: "Prospected",
    style: { background: "rgba(6,182,212,0.15)", color: "#22d3ee", border: "1px solid rgba(6,182,212,0.25)" },
  },
  warming: {
    label: "Warming",
    style: { background: "rgba(245,158,11,0.12)", color: "#fcd34d", border: "1px solid rgba(245,158,11,0.20)" },
  },
  warm: {
    label: "Warm",
    style: { background: "rgba(249,115,22,0.15)", color: "#fb923c", border: "1px solid rgba(249,115,22,0.25)" },
  },
  dm_ready: {
    label: "DM Ready",
    style: { background: "rgba(139,92,246,0.18)", color: "#c4b5fd", border: "1px solid rgba(139,92,246,0.30)" },
  },
  won: {
    label: "Won",
    style: { background: "rgba(16,185,129,0.15)", color: "#34d399", border: "1px solid rgba(16,185,129,0.25)" },
  },
  lost: {
    label: "Lost",
    style: { background: "rgba(239,68,68,0.15)", color: "#f87171", border: "1px solid rgba(239,68,68,0.25)" },
  },
};

interface StageBadgeProps {
  stage?: string;
  className?: string;
}

export function StageBadge({ stage, className }: StageBadgeProps) {
  if (!stage)
    return (
      <span className="text-xs" style={{ color: "#62666d" }}>
        —
      </span>
    );
  const config = stageConfig[stage] || {
    label: stage,
    style: { background: "rgba(255,255,255,0.06)", color: "#d0d6e0", border: "1px solid rgba(255,255,255,0.10)" },
  };
  return (
    <span
      className={cn(
        "inline-flex h-5 items-center justify-center px-2 rounded-full text-xs font-medium whitespace-nowrap",
        className
      )}
      style={config.style}
    >
      {config.label}
    </span>
  );
}
