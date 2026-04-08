"use client";

import { useLead, useUpdateLead } from "@/lib/hooks/use-leads";
import { Header } from "@/components/layout/header";
import { ScoreBadge } from "@/components/leads/score-badge";
import { StageBadge } from "@/components/leads/stage-badge";
import { SourceBadge } from "@/components/leads/source-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
 Camera,
 Link as LinkIcon,
 Globe,
 Mail,
 Phone,
 Copy,
 RefreshCw,
 UserX,
 ArrowLeft,
 User,
 CheckCircle,
 ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow, format } from "date-fns";
import { toast } from "sonner";

interface PageProps {
  params: { id: string };
}

export default function LeadDetailPage({ params }: PageProps) {
  const { data: lead, isLoading, error } = useLead(params.id);
  const updateLead = useUpdateLead();

  if (isLoading) {
    return (
      <div className="flex flex-col h-full">
        <Header title="Lead Detail" />
        <div className="p-6 space-y-4">
          <Skeleton className="h-32 w-full" />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-64" />
            <Skeleton className="h-64" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !lead) {
    return (
      <div className="flex flex-col h-full">
        <Header title="Lead Not Found" />
        <div className="p-6 text-center" style={{ color: "#8a8f98" }}>
          <p>Lead not found or API error.</p>
          <Link href="/leads">
            <Button variant="outline" className="mt-4 gap-2">
              <ArrowLeft className="h-4 w-4" /> Back to Leads
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const enrichment = lead.enrichment_data;
  const vision = enrichment?.vision_ai;
  const displayName = lead.name || lead.ig_handle || lead.username || "Unknown";

  const handleCopyContact = () => {
    const info = [lead.email, lead.phone, lead.ig_handle]
      .filter(Boolean)
      .join(" | ");
    navigator.clipboard.writeText(info);
    toast.success("Contact info copied!");
  };

  const handleReEnrich = () => {
    toast.info("Re-enrichment queued");
  };

  const handleExclude = async () => {
    await updateLead.mutateAsync({ id: lead.id, data: { stage: "lost" } });
    toast.success("Lead excluded");
  };

  return (
    <div className="flex flex-col h-full">
      <Header title="Lead Detail" subtitle={displayName} />

      <div className="flex-1 p-6 space-y-6">
        {/* Back */}
        <Link href="/leads">
          <Button variant="ghost" size="sm" className="gap-2 -ml-2">
            <ArrowLeft className="h-4 w-4" /> All Leads
          </Button>
        </Link>

        {/* Hero Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              {/* Avatar */}
              <div
                className="h-16 w-16 rounded-full flex items-center justify-center text-white text-2xl font-bold flex-shrink-0"
                style={{ background: "linear-gradient(135deg, #5e6ad2, #7c3aed)" }}
              >
                {displayName[0]?.toUpperCase() || "?"}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h2 className="text-xl font-bold" style={{ color: "#f7f8f8" }}>
                    {displayName}
                  </h2>
                  {lead.ig_handle && (
                    <span className="text-sm" style={{ color: "#8a8f98" }}>
                      @{lead.ig_handle}
                    </span>
                  )}
                  <StageBadge stage={lead.stage || lead.funnel_stage} />
                  {lead.enriched_at && (
                    <span
                      className="inline-flex h-5 items-center gap-1 px-2 rounded-full text-xs font-medium"
                      style={{
                        background: "rgba(16,185,129,0.15)",
                        color: "#34d399",
                        border: "1px solid rgba(16,185,129,0.25)",
                      }}
                    >
                      <CheckCircle className="h-3 w-3" /> Enriched
                    </span>
                  )}
                </div>
                {lead.bio && (
                  <p className="text-sm line-clamp-2" style={{ color: "#8a8f98" }}>
                    {lead.bio}
                  </p>
                )}
                <div className="flex flex-wrap gap-4 mt-2 text-xs" style={{ color: "#8a8f98" }}>
                  {lead.followers && (
                    <span>
                      <strong style={{ color: "#d0d6e0" }}>
                        {lead.followers.toLocaleString()}
                      </strong>{" "}
                      followers
                    </span>
                  )}
                  {lead.engagement_rate && (
                    <span>
                      <strong style={{ color: "#d0d6e0" }}>
                        {lead.engagement_rate.toFixed(1)}%
                      </strong>{" "}
                      engagement
                    </span>
                  )}
                  <SourceBadge source={lead.source} />
                </div>
              </div>

              <div className="flex gap-2 flex-shrink-0">
                <ScoreBadge score={lead.score} className="text-lg px-3 py-1" />
              </div>
            </div>

            <Separator
              className="my-4"
              style={{ background: "rgba(255,255,255,0.08)" }}
            />

            {/* Actions */}
            <div className="flex flex-wrap gap-2">
              {lead.ig_handle && (
                <a
                  href={`https://instagram.com/${lead.ig_handle}`}
                  target="_blank"
                  rel="noopener"
                >
                  <Button variant="outline" size="sm" className="gap-2 text-xs">
                    <Camera className="h-3 w-3" /> Instagram
                  </Button>
                </a>
              )}
              {lead.linkedin_url && (
                <a href={lead.linkedin_url} target="_blank" rel="noopener">
                  <Button variant="outline" size="sm" className="gap-2 text-xs">
                    <LinkIcon className="h-3 w-3" /> LinkedIn
                  </Button>
                </a>
              )}
              {lead.website_url && (
                <a href={lead.website_url} target="_blank" rel="noopener">
                  <Button variant="outline" size="sm" className="gap-2 text-xs">
                    <Globe className="h-3 w-3" /> Website
                  </Button>
                </a>
              )}
              <Button
                variant="outline"
                size="sm"
                className="gap-2 text-xs"
                onClick={handleCopyContact}
              >
                <Copy className="h-3 w-3" /> Copy Contact
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 text-xs"
                onClick={handleReEnrich}
              >
                <RefreshCw className="h-3 w-3" /> Re-enrich
              </Button>
              <Button
                variant="destructive"
                size="sm"
                className="gap-2 text-xs"
                onClick={handleExclude}
              >
                <UserX className="h-3 w-3" /> Exclude
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Score Breakdown */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Score Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {enrichment ? (
                <>
                  <ScoreRow label="Bio Relevance" score={enrichment.bio_relevance} />
                  <ScoreRow label="Engagement Rate" score={enrichment.engagement_rate} />
                  <ScoreRow label="Follower Quality" score={enrichment.follower_quality} />
                  <ScoreRow label="Activity Recency" score={enrichment.activity_recency} />
                  <ScoreRow label="Geo Match" score={enrichment.geo_match} />
                </>
              ) : (
                <p className="text-sm text-center py-4" style={{ color: "#62666d" }}>
                  Not yet enriched
                </p>
              )}
            </CardContent>
          </Card>

          {/* Vision AI */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Vision AI Enrichment</CardTitle>
            </CardHeader>
            <CardContent>
              {vision ? (
                <div className="space-y-2">
                  {vision.lifestyle && (
                    <InfoRow label="Lifestyle" value={vision.lifestyle} />
                  )}
                  {vision.income_signal && (
                    <InfoRow label="Income Signal" value={vision.income_signal} />
                  )}
                  {vision.family_status && (
                    <InfoRow label="Family Status" value={vision.family_status} />
                  )}
                  {vision.immigration_readiness && (
                    <InfoRow label="Immigration" value={vision.immigration_readiness} />
                  )}
                  {vision.value_hook && (
                    <div
                      className="mt-3 p-3 rounded-lg"
                      style={{
                        background: "rgba(94,106,210,0.10)",
                        border: "1px solid rgba(94,106,210,0.20)",
                      }}
                    >
                      <p
                        className="text-xs font-medium mb-1"
                        style={{ color: "#818cf8" }}
                      >
                        Value Hook
                      </p>
                      <p className="text-sm" style={{ color: "#d0d6e0" }}>
                        {vision.value_hook}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-center py-4" style={{ color: "#62666d" }}>
                  Vision AI not run yet
                </p>
              )}
            </CardContent>
          </Card>

          {/* Contact Info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Contact Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {lead.email && (
                <ContactRow icon={<Mail className="h-3 w-3" />} value={lead.email} />
              )}
              {lead.phone && (
                <ContactRow icon={<Phone className="h-3 w-3" />} value={lead.phone} />
              )}
              {lead.ig_handle && (
                <ContactRow
                  icon={<Camera className="h-3 w-3" />}
                  value={`@${lead.ig_handle}`}
                />
              )}
              {lead.linkedin_url && (
                <ContactRow
                  icon={<LinkIcon className="h-3 w-3" />}
                  value={lead.linkedin_url}
                  link={lead.linkedin_url}
                />
              )}
              {lead.website_url && (
                <ContactRow
                  icon={<Globe className="h-3 w-3" />}
                  value={lead.website_url}
                  link={lead.website_url}
                />
              )}
              {!lead.email && !lead.phone && !lead.ig_handle && (
                <p className="text-sm text-center py-4" style={{ color: "#62666d" }}>
                  No contact info available
                </p>
              )}
            </CardContent>
          </Card>

          {/* Source History */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Source & Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {lead.created_at && (
                <TimelineRow
                  icon={<User className="h-3 w-3" />}
                  label="Discovered"
                  date={lead.created_at}
                  source={lead.source}
                />
              )}
              {lead.enriched_at && (
                <TimelineRow
                  icon={<CheckCircle className="h-3 w-3" style={{ color: "#34d399" }} />}
                  label="Enriched"
                  date={lead.enriched_at}
                />
              )}
              {lead.ghl_synced_at && (
                <TimelineRow
                  icon={<ExternalLink className="h-3 w-3" style={{ color: "#818cf8" }} />}
                  label="Synced to GHL"
                  date={lead.ghl_synced_at}
                  extra={lead.ghl_contact_id}
                />
              )}
              {lead.replied_at && (
                <TimelineRow
                  icon={<CheckCircle className="h-3 w-3" style={{ color: "#a78bfa" }} />}
                  label="Replied"
                  date={lead.replied_at}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function ScoreRow({ label, score }: { label: string; score?: number }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span style={{ color: "#8a8f98" }}>{label}</span>
        <span className="font-mono font-medium" style={{ color: "#d0d6e0" }}>
          {score ?? "—"}
        </span>
      </div>
      <Progress value={score || 0} className="h-1.5" />
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span style={{ color: "#8a8f98" }}>{label}</span>
      <span className="font-medium capitalize" style={{ color: "#d0d6e0" }}>
        {value}
      </span>
    </div>
  );
}

function ContactRow({
  icon,
  value,
  link,
}: {
  icon: React.ReactNode;
  value: string;
  link?: string;
}) {
  const content = (
    <div className="flex items-center gap-2 text-sm">
      <span style={{ color: "#62666d" }}>{icon}</span>
      <span className="font-mono text-xs truncate" style={{ color: "#d0d6e0" }}>
        {value}
      </span>
    </div>
  );

  if (link) {
    return (
      <a
        href={link}
        target="_blank"
        rel="noopener"
        className="hover:opacity-80 block transition-opacity"
      >
        {content}
      </a>
    );
  }
  return content;
}

function TimelineRow({
  icon,
  label,
  date,
  source,
  extra,
}: {
  icon: React.ReactNode;
  label: string;
  date: string;
  source?: string;
  extra?: string;
}) {
  return (
    <div className="flex items-start gap-2 text-sm">
      <span className="mt-0.5" style={{ color: "#62666d" }}>
        {icon}
      </span>
      <div>
        <p className="font-medium text-xs" style={{ color: "#d0d6e0" }}>
          {label}
          {source && (
            <span className="ml-2" style={{ color: "#62666d" }}>
              via {source}
            </span>
          )}
        </p>
        <p className="text-xs" style={{ color: "#8a8f98" }}>
          {format(new Date(date), "MMM d, yyyy HH:mm")} (
          {formatDistanceToNow(new Date(date), { addSuffix: true })})
        </p>
        {extra && (
          <p className="text-xs font-mono" style={{ color: "#62666d" }}>
            {extra}
          </p>
        )}
      </div>
    </div>
  );
}
