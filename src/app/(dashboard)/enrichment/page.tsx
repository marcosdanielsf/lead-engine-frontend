"use client";

import { useEnrichmentQueue } from "@/lib/hooks/use-enrichment";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Cpu,
  Clock,
  DollarSign,
  CheckCircle,
  Loader2,
  SkipForward,
  Zap,
  BarChart3,
} from "lucide-react";
import { useWebSocket } from "@/lib/hooks/use-websocket";
import { toast } from "sonner";

export default function EnrichmentPage() {
  const { data: queue, isLoading } = useEnrichmentQueue();
  const { connected } = useWebSocket();

  if (isLoading) {
    return (
      <div className="flex flex-col h-full">
        <Header title="Vision AI Enrichment" />
        <div className="p-6 space-y-4">
          <Skeleton className="h-40 w-full" />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-64" />
            <Skeleton className="h-64" />
          </div>
        </div>
      </div>
    );
  }

  const current = queue?.currently_processing;
  const queued = queue?.queued || [];
  const completed = queue?.completed_today || [];
  const stats = queue?.stats || {
    success_rate: 0,
    avg_time_seconds: 0,
    cost_per_lead: 0,
    total_cost_month: 0,
  };

  return (
    <div className="flex flex-col h-full">
      <Header
        title="Vision AI Enrichment"
        subtitle="GPT-4o real-time enrichment queue"
      />

      <div className="flex-1 p-6 space-y-6">
        {/* WS Status */}
        <div className="flex items-center gap-2">
          <span
            className="h-2 w-2 rounded-full flex-shrink-0"
            style={{ background: connected ? "#10b981" : "#f59e0b" }}
          />
          <span className="text-xs" style={{ color: "#8a8f98" }}>
            {connected
              ? "Real-time updates active"
              : "Polling mode (WebSocket disconnected)"}
          </span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            icon={<CheckCircle className="h-5 w-5" style={{ color: "#34d399" }} />}
            label="Success Rate"
            value={`${stats.success_rate.toFixed(1)}%`}
            iconBg="rgba(16,185,129,0.15)"
          />
          <StatCard
            icon={<Clock className="h-5 w-5" style={{ color: "#818cf8" }} />}
            label="Avg Time"
            value={`${stats.avg_time_seconds.toFixed(1)}s`}
            iconBg="rgba(94,106,210,0.15)"
          />
          <StatCard
            icon={<DollarSign className="h-5 w-5" style={{ color: "#fbbf24" }} />}
            label="Cost/Lead"
            value={`$${stats.cost_per_lead.toFixed(3)}`}
            iconBg="rgba(245,158,11,0.15)"
          />
          <StatCard
            icon={<BarChart3 className="h-5 w-5" style={{ color: "#a78bfa" }} />}
            label="Total This Month"
            value={`$${stats.total_cost_month.toFixed(2)}`}
            iconBg="rgba(139,92,246,0.15)"
          />
        </div>

        {/* Currently Processing */}
        <Card
          style={{
            background: "rgba(94,106,210,0.08)",
            border: "1px solid rgba(94,106,210,0.20)",
          }}
        >
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" style={{ color: "#818cf8" }} />
              Currently Processing
            </CardTitle>
          </CardHeader>
          <CardContent>
            {current ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="h-10 w-10 rounded-full flex items-center justify-center text-white text-sm font-bold"
                      style={{ background: "linear-gradient(135deg, #5e6ad2, #7c3aed)" }}
                    >
                      {(current.lead?.name || current.lead?.ig_handle || "?")[0]?.toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-sm" style={{ color: "#f7f8f8" }}>
                        {current.lead?.name || current.lead?.ig_handle || "Unknown"}
                      </p>
                      {current.lead?.ig_handle && (
                        <p className="text-xs" style={{ color: "#8a8f98" }}>
                          @{current.lead.ig_handle}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {current.eta_seconds && (
                      <span className="text-xs" style={{ color: "#8a8f98" }}>
                        ETA: {current.eta_seconds}s
                      </span>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1 h-7 text-xs"
                      onClick={() => toast.info("Skip requested")}
                    >
                      <SkipForward className="h-3 w-3" /> Skip
                    </Button>
                  </div>
                </div>
                <Progress value={current.progress || 30} className="h-2" />
                <p className="text-xs text-right" style={{ color: "#8a8f98" }}>
                  {current.progress || 30}% complete
                </p>
              </div>
            ) : (
              <div className="text-center py-4">
                <Cpu className="h-8 w-8 mx-auto mb-2 opacity-20" style={{ color: "#8a8f98" }} />
                <p className="text-sm" style={{ color: "#62666d" }}>
                  No active enrichment. Queue is idle.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Queued */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Zap className="h-4 w-4" style={{ color: "#fbbf24" }} />
                  Queued ({queued.length})
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {queued.length === 0 ? (
                <p className="text-xs text-center py-4" style={{ color: "#62666d" }}>
                  Queue is empty
                </p>
              ) : (
                <div className="space-y-2 max-h-64 overflow-auto">
                  {queued.slice(0, 20).map((item, i) => (
                    <div
                      key={item.id || i}
                      className="flex items-center justify-between py-1.5"
                      style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono w-5" style={{ color: "#62666d" }}>
                          {i + 1}.
                        </span>
                        <div
                          className="h-6 w-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                          style={{ background: "linear-gradient(135deg, #5e6ad2, #7c3aed)" }}
                        >
                          {(item.lead?.name || item.lead?.ig_handle || "?")[0]?.toUpperCase()}
                        </div>
                        <span className="text-sm font-medium" style={{ color: "#d0d6e0" }}>
                          {item.lead?.name || item.lead?.ig_handle || `Lead #${i + 1}`}
                        </span>
                      </div>
                      {item.lead?.score !== undefined && (
                        <span
                          className="text-xs px-1.5 py-0.5 rounded font-mono"
                          style={{
                            background: "rgba(255,255,255,0.06)",
                            color: "#8a8f98",
                            border: "1px solid rgba(255,255,255,0.08)",
                          }}
                        >
                          {item.lead.score}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Completed Today */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" style={{ color: "#34d399" }} />
                Completed Today ({completed.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {completed.length === 0 ? (
                <p className="text-xs text-center py-4" style={{ color: "#62666d" }}>
                  No enrichments completed today yet
                </p>
              ) : (
                <div className="space-y-2 max-h-64 overflow-auto">
                  {completed.slice(0, 20).map((item, i) => {
                    const v = item.result?.vision_ai;
                    return (
                      <div
                        key={item.id || i}
                        className="py-2"
                        style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium" style={{ color: "#d0d6e0" }}>
                            {item.lead?.name || item.lead?.ig_handle || `Lead #${i + 1}`}
                          </span>
                          <span
                            className="text-xs px-2 py-0.5 rounded-full font-medium"
                            style={{
                              background: "rgba(16,185,129,0.15)",
                              color: "#34d399",
                              border: "1px solid rgba(16,185,129,0.25)",
                            }}
                          >
                            Done
                          </span>
                        </div>
                        {v && (
                          <div className="flex flex-wrap gap-1">
                            {v.lifestyle && (
                              <span
                                className="text-xs px-2 py-0.5 rounded"
                                style={{
                                  background: "rgba(255,255,255,0.06)",
                                  color: "#8a8f98",
                                }}
                              >
                                {v.lifestyle}
                              </span>
                            )}
                            {v.income_signal && (
                              <span
                                className="text-xs px-2 py-0.5 rounded"
                                style={{
                                  background: "rgba(16,185,129,0.12)",
                                  color: "#34d399",
                                }}
                              >
                                {v.income_signal}
                              </span>
                            )}
                            {v.family_status && (
                              <span
                                className="text-xs px-2 py-0.5 rounded"
                                style={{
                                  background: "rgba(94,106,210,0.15)",
                                  color: "#818cf8",
                                }}
                              >
                                {v.family_status}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  iconBg,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  iconBg?: string;
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div
            className="p-2 rounded-lg flex-shrink-0"
            style={{ background: iconBg || "rgba(255,255,255,0.06)" }}
          >
            {icon}
          </div>
          <div>
            <p className="text-xs font-medium" style={{ color: "#8a8f98" }}>
              {label}
            </p>
            <p className="text-xl font-bold" style={{ color: "#f7f8f8" }}>
              {value}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
