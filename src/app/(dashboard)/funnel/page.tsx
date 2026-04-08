"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { useFunnelData } from "@/lib/hooks/use-leads";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { TrendingUp, Award, AlertTriangle, Activity } from "lucide-react";

const STAGE_LABELS: Record<string, string> = {
  new: "New",
  raw: "Raw",
  enriched: "Enriched",
  queued: "Queued",
  prospected: "Prospected",
  warming: "Warming",
  warm: "Warm",
  dm_ready: "DM Ready",
  contacted: "Contacted",
  replied: "Replied",
  scheduled: "Scheduled",
  converted: "Converted",
  won: "Won",
  lost: "Lost",
};

const STAGE_ORDER = [
  "new", "raw", "enriched", "queued", "prospected", "warming",
  "warm", "dm_ready", "contacted", "replied", "scheduled", "converted", "won",
];

const COLORS = [
  "#5e6ad2", "#6366f1", "#7c3aed", "#9333ea", "#c026d3",
  "#db2777", "#e11d48", "#f59e0b", "#10b981", "#14b8a6",
  "#06b6d4", "#0ea5e9", "#6366f1",
];

export default function FunnelPage() {
  const [campaignId, setCampaignId] = useState<string>("");
  const { data, isLoading } = useFunnelData(campaignId || undefined);

  const funnel = data?.funnel || {};

  const funnelData = STAGE_ORDER.filter((s) => funnel[s] !== undefined)
    .map((stage, i) => ({
      stage,
      label: STAGE_LABELS[stage] || stage,
      count: funnel[stage] || 0,
      fill: COLORS[i % COLORS.length],
    }))
    .filter((d) => d.count > 0);

  Object.entries(funnel).forEach(([stage, count]) => {
    if (!STAGE_ORDER.includes(stage) && count > 0) {
      funnelData.push({
        stage,
        label: STAGE_LABELS[stage] || stage,
        count: count as number,
        fill: "#8a8f98",
      });
    }
  });

  const totalLeads = funnelData.reduce((a, b) => a + b.count, 0);
  const topStage = funnelData[0];
  const convertedStage = funnelData.find(
    (d) => d.stage === "converted" || d.stage === "won"
  );
  const conversionRate =
    topStage && convertedStage
      ? ((convertedStage.count / topStage.count) * 100).toFixed(1)
      : "0";

  const funnelWithPct = funnelData.map((d) => ({
    ...d,
    percentage: topStage ? Math.round((d.count / topStage.count) * 100) : 0,
  }));

  const sourceBreakdown = [
    { source: "Ad Library", raw: 1245, enriched: 892, contacted: 345, replied: 123 },
    { source: "IG Likers", raw: 2100, enriched: 1450, contacted: 560, replied: 212 },
    { source: "LinkedIn", raw: 780, enriched: 420, contacted: 180, replied: 67 },
    { source: "Manual", raw: 350, enriched: 280, contacted: 120, replied: 45 },
  ];

  return (
    <div className="flex flex-col h-full">
      <Header title="Conversion Funnel" subtitle="Lead progression from discovery to conversion" />

      <div className="flex-1 p-6 space-y-6">
        {/* Controls */}
        <div className="flex items-center gap-3">
          <Select
            value={campaignId || "all"}
            onValueChange={(v) => setCampaignId(v === "all" ? "" : (v ?? ""))}
          >
            <SelectTrigger className="w-44">
              <SelectValue placeholder="All Campaigns" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Campaigns</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Insight Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <InsightCard
            icon={<Activity className="h-5 w-5" style={{ color: "#818cf8" }} />}
            label="Total in Funnel"
            value={totalLeads.toLocaleString()}
            iconBg="rgba(94,106,210,0.15)"
          />
          <InsightCard
            icon={<TrendingUp className="h-5 w-5" style={{ color: "#34d399" }} />}
            label="Conversion Rate"
            value={`${conversionRate}%`}
            iconBg="rgba(16,185,129,0.15)"
          />
          <InsightCard
            icon={<Award className="h-5 w-5" style={{ color: "#a78bfa" }} />}
            label="Best Source"
            value="IG Likers"
            iconBg="rgba(139,92,246,0.15)"
          />
          <InsightCard
            icon={<AlertTriangle className="h-5 w-5" style={{ color: "#fbbf24" }} />}
            label="Enrichment Gap"
            value={
              topStage
                ? `${100 - (funnelWithPct.find((d) => d.stage === "enriched")?.percentage || 0)}%`
                : "—"
            }
            iconBg="rgba(245,158,11,0.15)"
          />
        </div>

        {/* Funnel Visualization */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Lead Funnel</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : funnelWithPct.length === 0 ? (
              <div className="text-center py-16" style={{ color: "#62666d" }}>
                No funnel data available
              </div>
            ) : (
              <div className="space-y-2">
                {funnelWithPct.map((stage) => (
                  <div key={stage.stage} className="flex items-center gap-3">
                    <div
                      className="w-28 text-right text-xs font-medium"
                      style={{ color: "#8a8f98" }}
                    >
                      {stage.label}
                    </div>
                    <div
                      className="flex-1 relative h-9 rounded-lg overflow-hidden"
                      style={{ background: "rgba(255,255,255,0.04)" }}
                    >
                      <div
                        className="h-full rounded-lg flex items-center pl-3 transition-all duration-500"
                        style={{
                          width: `${Math.max(stage.percentage, 2)}%`,
                          backgroundColor: stage.fill,
                          opacity: 0.85,
                        }}
                      >
                        <span className="text-white text-xs font-bold whitespace-nowrap">
                          {stage.count.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div
                      className="w-14 text-right text-xs font-mono"
                      style={{ color: "#8a8f98" }}
                    >
                      {stage.percentage}%
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Bar Chart */}
        {funnelWithPct.length > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Stage Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart
                  data={funnelWithPct}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.06)"
                  />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 11, fill: "#8a8f98" }}
                    angle={-30}
                    textAnchor="end"
                    height={50}
                    axisLine={{ stroke: "rgba(255,255,255,0.08)" }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#8a8f98" }}
                    axisLine={{ stroke: "rgba(255,255,255,0.08)" }}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "#161718",
                      border: "1px solid rgba(255,255,255,0.12)",
                      borderRadius: "8px",
                      color: "#f7f8f8",
                    }}
                    formatter={(value) => [Number(value).toLocaleString(), "Leads"]}
                    labelStyle={{ fontWeight: "bold", color: "#d0d6e0" }}
                  />
                 <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                   {funnelWithPct.map((entry) => (
                      <Cell key={entry.stage} fill={entry.fill} />  
                   ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* By Source Table */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>By Source</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                    <th className="text-left py-2 text-xs font-medium" style={{ color: "#8a8f98" }}>Source</th>
                    <th className="text-right py-2 text-xs font-medium" style={{ color: "#8a8f98" }}>Raw</th>
                    <th className="text-right py-2 text-xs font-medium" style={{ color: "#8a8f98" }}>Enriched</th>
                    <th className="text-right py-2 text-xs font-medium" style={{ color: "#8a8f98" }}>Contacted</th>
                    <th className="text-right py-2 text-xs font-medium" style={{ color: "#8a8f98" }}>Replied</th>
                    <th className="text-right py-2 text-xs font-medium" style={{ color: "#8a8f98" }}>Reply Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {sourceBreakdown.map((row) => (
                    <tr
                      key={row.source}
                      className="transition-colors hover:bg-white/[0.02]"
                      style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
                    >
                      <td className="py-2 text-xs font-medium" style={{ color: "#d0d6e0" }}>{row.source}</td>
                      <td className="py-2 text-right font-mono text-xs" style={{ color: "#d0d6e0" }}>{row.raw.toLocaleString()}</td>
                      <td className="py-2 text-right font-mono text-xs" style={{ color: "#d0d6e0" }}>{row.enriched.toLocaleString()}</td>
                      <td className="py-2 text-right font-mono text-xs" style={{ color: "#d0d6e0" }}>{row.contacted.toLocaleString()}</td>
                      <td className="py-2 text-right font-mono text-xs" style={{ color: "#d0d6e0" }}>{row.replied.toLocaleString()}</td>
                      <td className="py-2 text-right text-xs font-medium" style={{ color: "#34d399" }}>
                        {row.contacted > 0
                          ? `${((row.replied / row.contacted) * 100).toFixed(1)}%`
                          : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function InsightCard({
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
