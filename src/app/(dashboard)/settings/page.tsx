"use client";

import { Header } from "@/components/layout/header";
import { useAccounts, useRateLimits, useHealth } from "@/lib/hooks/use-settings";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  Zap,
  Link2,
  Key,
  CheckCircle,
  AlertTriangle,
  Copy,
  Eye,
  EyeOff,
  RefreshCw,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { format } from "date-fns";

function AccountStatusBadge({ status }: { status?: string }) {
  const styles: Record<string, React.CSSProperties> = {
    active: { background: "rgba(16,185,129,0.15)", color: "#34d399", border: "1px solid rgba(16,185,129,0.25)" },
    paused: { background: "rgba(245,158,11,0.15)", color: "#fbbf24", border: "1px solid rgba(245,158,11,0.25)" },
    disabled: { background: "rgba(239,68,68,0.15)", color: "#f87171", border: "1px solid rgba(239,68,68,0.25)" },
  };
  const labels: Record<string, string> = { active: "Active", paused: "Paused", disabled: "Disabled" };
  const s = status || "disabled";
  const style = styles[s] || styles.disabled;
  return (
    <span
      className="inline-flex h-5 items-center px-2 rounded-full text-xs font-medium"
      style={style}
    >
      {labels[s] || s}
    </span>
  );
}

export default function SettingsPage() {
  const { data: accountsData, isLoading: loadingAccounts } = useAccounts();
  const { data: limitsData, isLoading: loadingLimits } = useRateLimits();
  const { data: health } = useHealth();
  const [showApiKey, setShowApiKey] = useState(false);

  const accounts = accountsData?.accounts || [];
  const limits = limitsData?.accounts || [];
  const apiKey = process.env.NEXT_PUBLIC_API_KEY || "sk-xxx...xxxx";
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  return (
    <div className="flex flex-col h-full">
      <Header title="Settings" subtitle="Global Lead Engine configuration" />

      <div className="flex-1 p-6">
        <Tabs defaultValue="accounts">
          <TabsList className="mb-6">
            <TabsTrigger value="accounts" className="gap-2">
              <Users className="h-4 w-4" /> Accounts
            </TabsTrigger>
            <TabsTrigger value="limits" className="gap-2">
              <Zap className="h-4 w-4" /> Rate Limits
            </TabsTrigger>
            <TabsTrigger value="ghl" className="gap-2">
              <Link2 className="h-4 w-4" /> GHL Integration
            </TabsTrigger>
            <TabsTrigger value="api" className="gap-2">
              <Key className="h-4 w-4" /> API Keys
            </TabsTrigger>
          </TabsList>

          {/* Accounts Tab */}
          <TabsContent value="accounts" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Account Registry</CardTitle>
                <CardDescription>
                  All Instagram accounts registered in the Prospector system.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingAccounts ? (
                  <div className="space-y-2">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <Skeleton key={i} className="h-14" />
                    ))}
                  </div>
                ) : accounts.length === 0 ? (
                  <p className="text-sm text-center py-6" style={{ color: "#62666d" }}>
                    No accounts configured
                  </p>
                ) : (
                  <div className="space-y-2">
                    {accounts.map((acc) => (
                      <div
                        key={acc.username}
                        className="flex items-center justify-between p-3 rounded-lg transition-colors"
                        style={{
                          border: "1px solid rgba(255,255,255,0.08)",
                          background: "rgba(255,255,255,0.02)",
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="h-9 w-9 rounded-full flex items-center justify-center text-white text-sm font-bold"
                            style={{ background: "linear-gradient(135deg, #ec4899, #e11d48)" }}
                          >
                            {acc.username[0]?.toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-sm" style={{ color: "#f7f8f8" }}>
                              @{acc.username}
                            </p>
                            <p className="text-xs" style={{ color: "#62666d" }}>
                              {acc.campaign_id ? `Campaign: ${acc.campaign_id}` : "No campaign"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {acc.dms_sent_today !== undefined && (
                            <span className="text-xs font-mono" style={{ color: "#8a8f98" }}>
                              {acc.dms_sent_today}/{acc.daily_limit || 20} DMs
                            </span>
                          )}
                          <AccountStatusBadge status={acc.status} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Rate Limits Tab */}
          <TabsContent value="limits" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Rate Limits</CardTitle>
                    <CardDescription>Current DM limits per account</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" className="gap-2">
                    <RefreshCw className="h-3 w-3" /> Refresh
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {loadingLimits ? (
                  <div className="space-y-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <Skeleton key={i} className="h-16" />
                    ))}
                  </div>
                ) : limits.length === 0 ? (
                  <p className="text-sm text-center py-6" style={{ color: "#62666d" }}>
                    No rate limit data available
                  </p>
                ) : (
                  <div className="space-y-4">
                    {limits.map((acc) => {
                      const pct = acc.daily_limit
                        ? Math.round((acc.dms_sent / acc.daily_limit) * 100)
                        : 0;
                      const isWarning = pct >= 80;
                      const isFull = pct >= 100;
                      return (
                        <div key={acc.username} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium" style={{ color: "#d0d6e0" }}>
                              @{acc.username}
                            </span>
                            <span
                              className="text-xs font-mono"
                              style={{
                                color: isFull ? "#f87171" : isWarning ? "#fbbf24" : "#8a8f98",
                              }}
                            >
                              {acc.dms_sent}/{acc.daily_limit} DMs
                              {isFull && " (FULL)"}
                              {isWarning && !isFull && " (Near limit)"}
                            </span>
                          </div>
                          <Progress
                            value={pct}
                            className={`h-2 ${isFull ? "[&>div]:bg-red-500" : isWarning ? "[&>div]:bg-yellow-500" : ""}`}
                          />
                          <p className="text-xs" style={{ color: "#62666d" }}>
                            {acc.remaining} remaining today
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* GHL Integration Tab */}
          <TabsContent value="ghl" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>GoHighLevel Integration</CardTitle>
                <CardDescription>
                  Sync leads and contacts with your GHL CRM.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div
                  className="flex items-center gap-3 p-3 rounded-lg"
                  style={{ border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  <div
                    className="p-2 rounded-lg"
                    style={{
                      background: health?.healthy
                        ? "rgba(16,185,129,0.15)"
                        : "rgba(239,68,68,0.15)",
                    }}
                  >
                    {health?.healthy ? (
                      <CheckCircle className="h-5 w-5" style={{ color: "#34d399" }} />
                    ) : (
                      <AlertTriangle className="h-5 w-5" style={{ color: "#f87171" }} />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm" style={{ color: "#f7f8f8" }}>
                      API Status: {health?.status || "Unknown"}
                    </p>
                    {health?.last_run_at && (
                      <p className="text-xs" style={{ color: "#8a8f98" }}>
                        Last run:{" "}
                        {format(new Date(health.last_run_at), "MMM d, HH:mm")}
                      </p>
                    )}
                  </div>
                  <div className="text-right text-xs" style={{ color: "#8a8f98" }}>
                    <p>{health?.accounts_ok ?? "—"} accounts OK</p>
                    <p>{health?.dms_sent ?? "—"} DMs sent</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>GHL Location</Label>
                  <Input
                    placeholder="Location ID"
                    readOnly
                    value="Configured via environment"
                    className="text-xs"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Sync Status</Label>
                  <div
                    className="text-sm p-3 rounded-lg"
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.06)",
                      color: "#8a8f98",
                    }}
                  >
                    Auto-sync enabled for all enriched leads. Contacts are
                    created/updated via GHL API when leads reach &ldquo;enriched&rdquo; stage.
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* API Keys Tab */}
          <TabsContent value="api" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>API Keys</CardTitle>
                <CardDescription>
                  Manage authentication keys for the Lead Engine API.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>PROSPECTOR_API_KEY (X-API-Key)</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type={showApiKey ? "text" : "password"}
                      value={apiKey}
                      readOnly
                      className="font-mono text-xs flex-1"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setShowApiKey((v) => !v)}
                    >
                      {showApiKey ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        navigator.clipboard.writeText(apiKey);
                        toast.success("API key copied");
                      }}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>API Base URL</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      value={apiBase}
                      readOnly
                      className="font-mono text-xs flex-1"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        navigator.clipboard.writeText(apiBase);
                        toast.success("URL copied");
                      }}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div
                  className="p-3 rounded-lg text-xs"
                  style={{
                    background: "rgba(245,158,11,0.10)",
                    border: "1px solid rgba(245,158,11,0.20)",
                    color: "#fbbf24",
                  }}
                >
                  Keep your API key secret. Never expose it in client-side code
                  in production. Use environment variables.
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
