import {
  LeadsResponse,
  Lead,
  FunnelData,
  Source,
  EnrichmentQueue,
  Account,
  BulkActionRequest,
} from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || "";

async function fetchAPI<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE}${path}`;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(API_KEY ? { "X-API-Key": API_KEY } : {}),
    ...(options.headers as Record<string, string>),
  };

  const response = await fetch(url, { ...options, headers });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`API Error ${response.status}: ${error}`);
  }

  return response.json();
}

// ---- Leads ----

export interface LeadsFilters {
  search?: string;
  source?: string;
  stage?: string;
  score_min?: number;
  score_max?: number;
  assigned_to?: string;
  date_from?: string;
  date_to?: string;
  limit?: number;
  offset?: number;
  sort_by?: string;
  sort_dir?: "asc" | "desc";
}

export async function getLeads(filters: LeadsFilters = {}): Promise<LeadsResponse> {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") params.set(k, String(v));
  });
  const qs = params.toString();
  try {
    return await fetchAPI<LeadsResponse>(`/api/leads${qs ? `?${qs}` : ""}`);
  } catch {
    // fallback: use growth_leads via stats endpoint or mock
    return { leads: [], total: 0 };
  }
}

export async function getLead(id: string): Promise<Lead> {
  return fetchAPI<Lead>(`/api/leads/${id}`);
}

export async function updateLead(id: string, data: Partial<Lead>): Promise<Lead> {
  return fetchAPI<Lead>(`/api/leads/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function importLeads(leads: Partial<Lead>[]): Promise<{ imported: number; errors: string[] }> {
  return fetchAPI(`/api/leads/import`, {
    method: "POST",
    body: JSON.stringify({ leads }),
  });
}

export async function bulkAction(req: BulkActionRequest): Promise<{ success: boolean; processed: number }> {
  return fetchAPI(`/api/leads/bulk-action`, {
    method: "POST",
    body: JSON.stringify(req),
  });
}

// ---- Funnel ----

export async function getFunnelData(campaign_id?: string): Promise<FunnelData> {
  const qs = campaign_id ? `?campaign_id=${campaign_id}` : "";
  return fetchAPI<FunnelData>(`/api/leads/funnel${qs}`);
}

// ---- Sources ----

export async function getSources(): Promise<{ sources: Source[] }> {
  try {
    return await fetchAPI<{ sources: Source[] }>("/api/sources");
  } catch {
    // Fallback with mock sources if endpoint not yet implemented
    return {
      sources: [
        {
          name: "Ad Library",
          type: "ad_library",
          status: "paused",
          last_run: new Date(Date.now() - 3600000).toISOString(),
          new_leads_count: 0,
          schedule: "24h",
          enabled: true,
        },
        {
          name: "Instagram Discovery",
          type: "ig_likers",
          status: "idle",
          last_run: new Date(Date.now() - 7200000).toISOString(),
          new_leads_count: 0,
          schedule: "12h",
          enabled: true,
        },
        {
          name: "LinkedIn Discovery",
          type: "linkedin",
          status: "paused",
          last_run: new Date(Date.now() - 86400000).toISOString(),
          new_leads_count: 0,
          schedule: "24h",
          enabled: false,
        },
        {
          name: "Website Enrichment",
          type: "website",
          status: "idle",
          last_run: new Date(Date.now() - 1800000).toISOString(),
          new_leads_count: 0,
          schedule: "6h",
          enabled: true,
        },
        {
          name: "Vision AI Enrichment",
          type: "ig_followers",
          status: "running",
          last_run: new Date().toISOString(),
          new_leads_count: 0,
          schedule: "continuous",
          enabled: true,
        },
      ],
    };
  }
}

export async function updateSource(name: string, data: Partial<Source>): Promise<Source> {
  return fetchAPI<Source>(`/api/sources/${encodeURIComponent(name)}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

// ---- Enrichment ----

export async function getEnrichmentQueue(): Promise<EnrichmentQueue> {
  try {
    return await fetchAPI<EnrichmentQueue>("/api/enrichment/queue");
  } catch {
    return {
      queued: [],
      completed_today: [],
      stats: {
        success_rate: 0,
        avg_time_seconds: 0,
        cost_per_lead: 0,
        total_cost_month: 0,
      },
    };
  }
}

// ---- Accounts / Settings ----

export async function getAccounts(): Promise<{ accounts: Account[] }> {
  return fetchAPI<{ accounts: Account[] }>("/api/accounts");
}

export async function getStats(): Promise<{
  queue_total: number;
  dms_today: number;
}> {
  return fetchAPI("/api/stats");
}

export async function getRateLimits(): Promise<{
  accounts: Array<{
    username: string;
    dms_sent: number;
    daily_limit: number;
    remaining: number;
  }>;
}> {
  return fetchAPI("/api/stats/limits");
}

export async function getMetricsSummary(): Promise<{ data: unknown[]; total_rows: number }> {
  return fetchAPI("/api/metrics/summary");
}

export async function getHealth(): Promise<{
  healthy: boolean;
  status: string;
  last_run_at?: string;
  accounts_ok?: number;
  accounts_failed?: number;
  dms_sent?: number;
}> {
  return fetchAPI("/health");
}
