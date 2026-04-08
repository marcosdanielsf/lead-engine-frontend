import { cn } from "@/lib/utils";

const sourceConfig: Record<string, { label: string; style: React.CSSProperties }> = {
  ad_library: {
    label: "Ad Library",
    style: { background: "rgba(236,72,153,0.15)", color: "#f472b6", border: "1px solid rgba(236,72,153,0.25)" },
  },
  ig_likers: {
    label: "IG Likers",
    style: { background: "rgba(244,63,94,0.15)", color: "#fb7185", border: "1px solid rgba(244,63,94,0.25)" },
  },
  ig_followers: {
    label: "IG Followers",
    style: { background: "rgba(239,68,68,0.15)", color: "#f87171", border: "1px solid rgba(239,68,68,0.25)" },
  },
  linkedin: {
    label: "LinkedIn",
    style: { background: "rgba(14,165,233,0.15)", color: "#38bdf8", border: "1px solid rgba(14,165,233,0.25)" },
  },
  website: {
    label: "Website",
    style: { background: "rgba(20,184,166,0.15)", color: "#2dd4bf", border: "1px solid rgba(20,184,166,0.25)" },
  },
  manual: {
    label: "Manual",
    style: { background: "rgba(255,255,255,0.06)", color: "#d0d6e0", border: "1px solid rgba(255,255,255,0.10)" },
  },
};

interface SourceBadgeProps {
  source?: string;
  className?: string;
}

export function SourceBadge({ source, className }: SourceBadgeProps) {
  if (!source)
    return (
      <span className="text-xs" style={{ color: "#62666d" }}>
        —
      </span>
    );
  const config = sourceConfig[source] || {
    label: source,
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
