// Lead Engine Types

export type LeadSource =
  | "ad_library"
  | "ig_likers"
  | "ig_followers"
  | "linkedin"
  | "website"
  | "manual";

export type LeadStage =
  | "raw"
  | "enriched"
  | "queued"
  | "contacted"
  | "replied"
  | "scheduled"
  | "converted"
  | "new"
  | "prospected"
  | "warming"
  | "warm"
  | "dm_ready"
  | "won"
  | "lost";

export interface VisionAI {
  lifestyle?: string;
  income_signal?: string;
  family_status?: string;
  immigration_readiness?: string;
  value_hook?: string;
}

export interface EnrichmentData {
  bio_relevance?: number;
  engagement_rate?: number;
  follower_quality?: number;
  activity_recency?: number;
  geo_match?: number;
  vision_ai?: VisionAI;
}

export interface Lead {
  id: string;
  ig_handle?: string;
  email?: string;
  phone?: string;
  name?: string;
  bio?: string;
  followers?: number;
  engagement_rate?: number;
  source?: LeadSource;
  score?: number;
  stage?: LeadStage;
  funnel_stage?: string;
  enrichment_data?: EnrichmentData;
  client_id?: string;
  assigned_to?: string;
  ghl_contact_id?: string;
  created_at?: string;
  enriched_at?: string;
  ghl_synced_at?: string;
  profile_pic_url?: string;
  linkedin_url?: string;
  website_url?: string;
  // from prospector_queue_leads
  username?: string;
  campaign_id?: string;
  temperature?: string;
  replied_at?: string;
}

export interface LeadsResponse {
  leads: Lead[];
  total: number;
  page?: number;
  per_page?: number;
}

export interface FunnelStage {
  stage: string;
  count: number;
  percentage?: number;
}

export interface FunnelData {
  funnel: Record<string, number>;
  campaign_id?: string;
}

export interface Source {
  name: string;
  type: LeadSource;
  status: "running" | "paused" | "error" | "rate_limited" | "idle";
  last_run?: string;
  new_leads_count?: number;
  schedule?: string;
  config?: Record<string, unknown>;
  enabled?: boolean;
}

export interface EnrichmentQueueItem {
  id: string;
  lead: Lead;
  status: "processing" | "queued" | "completed" | "failed";
  progress?: number;
  eta_seconds?: number;
  started_at?: string;
  completed_at?: string;
  result?: EnrichmentData;
}

export interface EnrichmentQueue {
  currently_processing?: EnrichmentQueueItem;
  queued: EnrichmentQueueItem[];
  completed_today: EnrichmentQueueItem[];
  stats: {
    success_rate: number;
    avg_time_seconds: number;
    cost_per_lead: number;
    total_cost_month: number;
  };
}

export interface Account {
  username: string;
  status: "active" | "paused" | "disabled";
  campaign_id?: string;
  dms_sent_today?: number;
  daily_limit?: number;
  last_login_at?: string;
  last_dm_at?: string;
  system_prompt?: string;
}

export interface ImportResult {
  id: string;
  timestamp: string;
  method: "csv" | "webhook" | "api";
  lead_count: number;
  status: "success" | "partial" | "failed";
  errors?: string[];
}

export interface BulkActionRequest {
  lead_ids: string[];
  action: "enrich" | "assign" | "export" | "delete" | "exclude";
  params?: Record<string, unknown>;
}

export interface WSMessage {
  type:
    | "enrichment_update"
    | "lead_update"
    | "source_update"
    | "stats_update"
    | "ping";
  data?: unknown;
  timestamp?: string;
}
