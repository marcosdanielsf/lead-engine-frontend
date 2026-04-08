"use client";
import { useQuery } from "@tanstack/react-query";
import { getAccounts, getStats, getRateLimits, getHealth } from "../api";

export function useAccounts() {
  return useQuery({
    queryKey: ["accounts"],
    queryFn: getAccounts,
    refetchInterval: 30_000,
  });
}

export function useStats() {
  return useQuery({
    queryKey: ["stats"],
    queryFn: getStats,
    refetchInterval: 15_000,
  });
}

export function useRateLimits() {
  return useQuery({
    queryKey: ["rate-limits"],
    queryFn: getRateLimits,
    refetchInterval: 30_000,
  });
}

export function useHealth() {
  return useQuery({
    queryKey: ["health"],
    queryFn: getHealth,
    refetchInterval: 60_000,
  });
}
