"use client";

import { useState, useCallback } from "react";
import { Header } from "@/components/layout/header";
import { LeadsTable } from "@/components/leads/leads-table";
import { useLeads, useBulkAction } from "@/lib/hooks/use-leads";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import {
  Users,
  TrendingUp,
  Star,
  Plus,
  Download,
  RefreshCw,
  Search,
  Trash2,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { Lead } from "@/lib/types";
import { toast } from "sonner";

export default function LeadsPage() {
  const [search, setSearch] = useState("");
  const [source, setSource] = useState("");
  const [stage, setStage] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const filters = {
    ...(search ? { search } : {}),
    ...(source && source !== "all" ? { source } : {}),
    ...(stage && stage !== "all" ? { stage } : {}),
    limit: 100,
  };

  const { data, isLoading, refetch, isFetching } = useLeads(filters);
  const bulkAction = useBulkAction();

  const leads = data?.leads || [];
  const total = data?.total || leads.length;

  const avgScore =
    leads.length > 0
      ? Math.round(
          leads.reduce((a, b) => a + (b.score || 0), 0) / leads.length
        )
      : 0;

  const newToday = leads.filter((l) => {
    if (!l.created_at) return false;
    const created = new Date(l.created_at);
    const now = new Date();
    return (
      created.getFullYear() === now.getFullYear() &&
      created.getMonth() === now.getMonth() &&
      created.getDate() === now.getDate()
    );
  }).length;

  const enrichedCount = leads.filter(
    (l) => l.stage === "enriched" || l.enriched_at
  ).length;

  const handleAction = useCallback(
    (action: string, lead: Lead) => {
      if (action === "enrich") {
        toast.success(`Queued @${lead.ig_handle || lead.name} for enrichment`);
      } else if (action === "exclude") {
        toast.info(`Excluded @${lead.ig_handle || lead.name}`);
      }
    },
    []
  );

  const handleBulkEnrich = async () => {
    if (!selectedIds.length) return;
    await bulkAction.mutateAsync({ lead_ids: selectedIds, action: "enrich" });
    toast.success(`Queued ${selectedIds.length} leads for enrichment`);
    setSelectedIds([]);
  };

  const handleBulkDelete = async () => {
    if (!selectedIds.length) return;
    await bulkAction.mutateAsync({ lead_ids: selectedIds, action: "delete" });
    toast.success(`Deleted ${selectedIds.length} leads`);
    setSelectedIds([]);
  };

  return (
    <div className="flex flex-col h-full">
      <Header
        title="Leads"
        subtitle={`${total.toLocaleString()} leads discovered`}
      />

      <div className="flex-1 p-6 space-y-6">
        {/* Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard
            icon={<Users className="h-5 w-5" style={{ color: "#818cf8" }} />}
            label="Total Leads"
            value={total.toLocaleString()}
            iconBg="rgba(94,106,210,0.15)"
          />
          <MetricCard
            icon={<Star className="h-5 w-5" style={{ color: "#fbbf24" }} />}
            label="Avg Score"
            value={avgScore || "—"}
            iconBg="rgba(245,158,11,0.15)"
          />
          <MetricCard
            icon={<Zap className="h-5 w-5" style={{ color: "#34d399" }} />}
            label="New Today"
            value={newToday}
            iconBg="rgba(16,185,129,0.15)"
          />
          <MetricCard
            icon={<TrendingUp className="h-5 w-5" style={{ color: "#a78bfa" }} />}
            label="Enriched"
            value={enrichedCount}
            iconBg="rgba(139,92,246,0.15)"
          />
        </div>

        {/* Filters + Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4"
              style={{ color: "#62666d" }}
            />
            <Input
              placeholder="Search by name, handle, email..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <Select value={source} onValueChange={(v) => setSource(v ?? "")}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sources</SelectItem>
              <SelectItem value="ad_library">Ad Library</SelectItem>
              <SelectItem value="ig_likers">IG Likers</SelectItem>
              <SelectItem value="ig_followers">IG Followers</SelectItem>
              <SelectItem value="linkedin">LinkedIn</SelectItem>
              <SelectItem value="website">Website</SelectItem>
              <SelectItem value="manual">Manual</SelectItem>
            </SelectContent>
          </Select>

          <Select value={stage} onValueChange={(v) => setStage(v ?? "")}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Stage" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stages</SelectItem>
              <SelectItem value="raw">Raw</SelectItem>
              <SelectItem value="enriched">Enriched</SelectItem>
              <SelectItem value="queued">Queued</SelectItem>
              <SelectItem value="contacted">Contacted</SelectItem>
              <SelectItem value="replied">Replied</SelectItem>
              <SelectItem value="converted">Converted</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="icon"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
          </Button>

          <Link href="/leads/import">
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> Import
            </Button>
          </Link>
        </div>

        {/* Bulk actions */}
        {selectedIds.length > 0 && (
          <div
            className="flex items-center gap-3 px-4 py-2 rounded-lg"
            style={{
              background: "rgba(94,106,210,0.12)",
              border: "1px solid rgba(94,106,210,0.25)",
            }}
          >
            <span className="text-sm font-medium" style={{ color: "#818cf8" }}>
              {selectedIds.length} selected
            </span>
            <Button
              size="sm"
              variant="outline"
              className="gap-1 h-7 text-xs"
              onClick={handleBulkEnrich}
              disabled={bulkAction.isPending}
            >
              <Zap className="h-3 w-3" /> Enrich
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="gap-1 h-7 text-xs"
              onClick={() => {
                toast.info("Export feature coming soon");
              }}
            >
              <Download className="h-3 w-3" /> Export
            </Button>
            <Button
              size="sm"
              variant="destructive"
              className="gap-1 h-7 text-xs"
              onClick={handleBulkDelete}
              disabled={bulkAction.isPending}
            >
              <Trash2 className="h-3 w-3" /> Delete
            </Button>
          </div>
        )}

        {/* Table */}
        <Card className="flex-1">
          <CardContent className="p-0">
            <LeadsTable
              leads={leads}
              loading={isLoading}
              onSelectionChange={setSelectedIds}
              onAction={handleAction}
            />
          </CardContent>
        </Card>

        {/* Pagination info */}
        {!isLoading && (
          <p className="text-xs text-right" style={{ color: "#62666d" }}>
            Showing {leads.length} of {total} leads
          </p>
        )}
      </div>
    </div>
  );
}

function MetricCard({
  icon,
  label,
  value,
  iconBg,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
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
