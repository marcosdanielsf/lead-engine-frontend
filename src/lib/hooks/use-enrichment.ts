"use client";
import { useQuery } from "@tanstack/react-query";
import { getEnrichmentQueue } from "../api";
import { useWebSocket } from "./use-websocket";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { WSMessage } from "../types";

export function useEnrichmentQueue() {
  const qc = useQueryClient();

  const onMessage = useCallback(
    (msg: WSMessage) => {
      if (msg.type === "enrichment_update") {
        qc.invalidateQueries({ queryKey: ["enrichment-queue"] });
      }
    },
    [qc]
  );

  useWebSocket(onMessage);

  return useQuery({
    queryKey: ["enrichment-queue"],
    queryFn: getEnrichmentQueue,
    refetchInterval: 5_000,
  });
}
