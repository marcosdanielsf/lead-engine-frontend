"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { useSources, useUpdateSource } from "@/lib/hooks/use-sources";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Database,
  Globe,
  Play,
  Pause,
  Settings,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Clock,
  TrendingUp,
  Camera,
  LinkIcon,
} from "lucide-react";
import { Source } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";

const sourceIcons: Record<string, React.ReactNode> = {
  ad_library: <Database className="h-5 w-5" />,
  ig_likers: <Camera className="h-5 w-5" />,
  ig_followers: <Camera className="h-5 w-5" />,
  linkedin: <LinkIcon className="h-5 w-5" />,
  website: <Globe className="h-5 w-5" />,
};

const sourceIconColors: Record<string, { color: string; bg: string }> = {
  ad_library: { color: "#f472b6", bg: "rgba(236,72,153,0.15)" },
  ig_likers: { color: "#fb7185", bg: "rgba(244,63,94,0.15)" },
  ig_followers: { color: "#f87171", bg: "rgba(239,68,68,0.15)" },
  linkedin: { color: "#38bdf8", bg: "rgba(14,165,233,0.15)" },
  website: { color: "#2dd4bf", bg: "rgba(20,184,166,0.15)" },
};

function StatusBadge({ status }: { status: Source["status"] }) {
  const styles: Record<string, React.CSSProperties> = {
    running: { background: "rgba(16,185,129,0.15)", color: "#34d399", border: "1px solid rgba(16,185,129,0.25)" },
    paused: { background: "rgba(255,255,255,0.06)", color: "#8a8f98", border: "1px solid rgba(255,255,255,0.10)" },
    error: { background: "rgba(239,68,68,0.15)", color: "#f87171", border: "1px solid rgba(239,68,68,0.25)" },
    rate_limited: { background: "rgba(245,158,11,0.15)", color: "#fbbf24", border: "1px solid rgba(245,158,11,0.25)" },
    idle: { background: "rgba(94,106,210,0.15)", color: "#818cf8", border: "1px solid rgba(94,106,210,0.25)" },
  };
  const labels: Record<string, string> = {
    running: "Running", paused: "Paused", error: "Error", rate_limited: "Rate Limited", idle: "Idle",
  };
  const style = styles[status] || styles.idle;
  return (
    <span
      className="inline-flex h-5 items-center px-2 rounded-full text-xs font-medium"
      style={style}
    >
      {labels[status] || status}
    </span>
  );
}

export default function SourcesPage() {
  const { data, isLoading, refetch } = useSources();
  const updateSource = useUpdateSource();
  const [configSource, setConfigSource] = useState<Source | null>(null);
  const [schedule, setSchedule] = useState("");
  const [keywords, setKeywords] = useState("");

  const sources = data?.sources || [];

  const handleToggle = async (source: Source) => {
    const newEnabled = !source.enabled;
    await updateSource.mutateAsync({
      name: source.name,
      data: { enabled: newEnabled, status: newEnabled ? "idle" : "paused" },
    });
    toast.success(`${source.name} ${newEnabled ? "enabled" : "disabled"}`);
  };

  const handleConfigure = (source: Source) => {
    setConfigSource(source);
    setSchedule(source.schedule || "24h");
    setKeywords((source.config?.keywords as string) || "");
  };

  const handleSaveConfig = async () => {
    if (!configSource) return;
    await updateSource.mutateAsync({
      name: configSource.name,
      data: {
        schedule,
        config: { ...configSource.config, keywords },
      },
    });
    toast.success("Source configuration saved");
    setConfigSource(null);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-full">
        <Header title="Sources" />
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <Header title="Sources" subtitle="Configure & monitor discovery sources" />

      <div className="flex-1 p-6 space-y-6">
        {/* Summary row */}
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg" style={{ background: "rgba(16,185,129,0.15)" }}>
                <CheckCircle className="h-5 w-5" style={{ color: "#34d399" }} />
              </div>
              <div>
                <p className="text-xs" style={{ color: "#8a8f98" }}>Active</p>
                <p className="text-xl font-bold" style={{ color: "#f7f8f8" }}>
                  {sources.filter((s) => s.enabled !== false).length}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg" style={{ background: "rgba(94,106,210,0.15)" }}>
                <Play className="h-5 w-5" style={{ color: "#818cf8" }} />
              </div>
              <div>
                <p className="text-xs" style={{ color: "#8a8f98" }}>Running</p>
                <p className="text-xl font-bold" style={{ color: "#f7f8f8" }}>
                  {sources.filter((s) => s.status === "running").length}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg" style={{ background: "rgba(245,158,11,0.15)" }}>
                <AlertTriangle className="h-5 w-5" style={{ color: "#fbbf24" }} />
              </div>
              <div>
                <p className="text-xs" style={{ color: "#8a8f98" }}>Issues</p>
                <p className="text-xl font-bold" style={{ color: "#f7f8f8" }}>
                  {sources.filter((s) => s.status === "error" || s.status === "rate_limited").length}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Refresh */}
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => refetch()}
          >
            <RefreshCw className="h-3 w-3" /> Refresh
          </Button>
        </div>

        {/* Sources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sources.map((source) => {
            const iconStyle =
              sourceIconColors[source.type] ||
              { color: "#8a8f98", bg: "rgba(255,255,255,0.06)" };

            return (
              <Card key={source.name}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="p-2 rounded-lg"
                        style={{ background: iconStyle.bg, color: iconStyle.color }}
                      >
                        {sourceIcons[source.type] || <Database className="h-5 w-5" />}
                      </div>
                      <div>
                        <p className="text-sm font-semibold" style={{ color: "#f7f8f8" }}>
                          {source.name}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <StatusBadge status={source.status} />
                          {source.schedule && (
                            <span
                              className="text-xs flex items-center gap-1"
                              style={{ color: "#62666d" }}
                            >
                              <Clock className="h-3 w-3" /> Every {source.schedule}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <Switch
                      checked={source.enabled !== false}
                      onCheckedChange={() => handleToggle(source)}
                    />
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs mb-0.5" style={{ color: "#8a8f98" }}>
                        Last Run
                      </p>
                      <p className="text-xs font-medium" style={{ color: "#d0d6e0" }}>
                        {source.last_run
                          ? formatDistanceToNow(new Date(source.last_run), { addSuffix: true })
                          : "Never"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs mb-0.5" style={{ color: "#8a8f98" }}>
                        New Leads
                      </p>
                      <p className="text-xs font-medium flex items-center gap-1" style={{ color: "#d0d6e0" }}>
                        <TrendingUp className="h-3 w-3" style={{ color: "#34d399" }} />
                        {source.new_leads_count ?? 0}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 flex-1 text-xs h-8"
                      onClick={() => handleConfigure(source)}
                    >
                      <Settings className="h-3 w-3" /> Configure
                    </Button>
                    {source.status === "running" ? (
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1 text-xs h-8"
                        onClick={() => toast.info(`${source.name} paused`)}
                      >
                        <Pause className="h-3 w-3" />
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1 text-xs h-8"
                        onClick={() => toast.info(`${source.name} started`)}
                      >
                        <Play className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Configure Dialog */}
      <Dialog
        open={!!configSource}
        onOpenChange={(open) => !open && setConfigSource(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Configure: {configSource?.name}</DialogTitle>
            <DialogDescription>
              Adjust schedule and settings for this discovery source.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-2">
            <div className="space-y-2">
              <Label>Schedule</Label>
              <Select value={schedule} onValueChange={(v) => setSchedule(v ?? "")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1h">Every 1 hour</SelectItem>
                  <SelectItem value="6h">Every 6 hours</SelectItem>
                  <SelectItem value="12h">Every 12 hours</SelectItem>
                  <SelectItem value="24h">Every 24 hours</SelectItem>
                  <SelectItem value="continuous">Continuous</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Keywords / Filters</Label>
              <Input
                placeholder="coach, fitness, online business..."
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
              />
              <p className="text-xs" style={{ color: "#8a8f98" }}>
                Comma-separated keywords to filter leads
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => setConfigSource(null)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveConfig}
                disabled={updateSource.isPending}
                className="flex-1"
              >
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
