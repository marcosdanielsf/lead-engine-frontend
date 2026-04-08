"use client";
import { useEffect, useRef, useState } from "react";
import { wsClient } from "../websocket";
import { WSMessage } from "../types";

export function useWebSocket(onMessage?: (msg: WSMessage) => void) {
  const [connected, setConnected] = useState(false);
  const unsub = useRef<(() => void) | null>(null);

  useEffect(() => {
    wsClient.connect();

    const checkConn = setInterval(() => {
      setConnected(wsClient.isConnected);
    }, 1000);

    if (onMessage) {
      unsub.current = wsClient.subscribe(onMessage);
    }

    return () => {
      clearInterval(checkConn);
      unsub.current?.();
    };
  }, [onMessage]);

  return { connected };
}
