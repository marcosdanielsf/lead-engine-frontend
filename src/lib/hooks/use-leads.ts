"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getLeads,
  getLead,
  updateLead,
  importLeads,
  bulkAction,
  getFunnelData,
  LeadsFilters,
} from "../api";
import { Lead, BulkActionRequest } from "../types";

export function useLeads(filters: LeadsFilters = {}) {
  return useQuery({
    queryKey: ["leads", filters],
    queryFn: () => getLeads(filters),
    placeholderData: (prev) => prev,
  });
}

export function useLead(id: string) {
  return useQuery({
    queryKey: ["lead", id],
    queryFn: () => getLead(id),
    enabled: !!id,
  });
}

export function useUpdateLead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Lead> }) =>
      updateLead(id, data),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["leads"] });
      qc.invalidateQueries({ queryKey: ["lead", vars.id] });
    },
  });
}

export function useImportLeads() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (leads: Partial<Lead>[]) => importLeads(leads),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["leads"] });
    },
  });
}

export function useBulkAction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (req: BulkActionRequest) => bulkAction(req),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["leads"] });
    },
  });
}

export function useFunnelData(campaign_id?: string) {
  return useQuery({
    queryKey: ["funnel", campaign_id],
    queryFn: () => getFunnelData(campaign_id),
    refetchInterval: 30_000,
  });
}
