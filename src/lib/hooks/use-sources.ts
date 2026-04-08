"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSources, updateSource } from "../api";
import { Source } from "../types";

export function useSources() {
  return useQuery({
    queryKey: ["sources"],
    queryFn: getSources,
    refetchInterval: 15_000,
  });
}

export function useUpdateSource() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ name, data }: { name: string; data: Partial<Source> }) =>
      updateSource(name, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["sources"] });
    },
  });
}
