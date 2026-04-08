import { WSMessage } from "./types";

type WSListener = (msg: WSMessage) => void;

class WebSocketClient {
  private ws: WebSocket | null = null;
  private listeners: Set<WSListener> = new Set();
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private reconnectDelay = 2000;
  private url: string;
  private shouldConnect = false;

  constructor(url: string) {
    this.url = url;
  }

  connect() {
    if (typeof window === "undefined") return;
    this.shouldConnect = true;
    this._connect();
  }

  private _connect() {
    if (!this.shouldConnect) return;
    try {
      this.ws = new WebSocket(this.url);

      this.ws.onopen = () => {
        console.log("[WS] Connected to", this.url);
        this.reconnectDelay = 2000;
      };

      this.ws.onmessage = (event) => {
        try {
          const msg: WSMessage = JSON.parse(event.data);
          this.listeners.forEach((l) => l(msg));
        } catch {
          // ignore parse errors
        }
      };

      this.ws.onclose = () => {
        console.log("[WS] Disconnected, reconnecting in", this.reconnectDelay, "ms");
        if (this.shouldConnect) {
          this.reconnectTimer = setTimeout(() => {
            this.reconnectDelay = Math.min(this.reconnectDelay * 1.5, 30000);
            this._connect();
          }, this.reconnectDelay);
        }
      };

      this.ws.onerror = (err) => {
        console.warn("[WS] Error:", err);
        this.ws?.close();
      };
    } catch (e) {
      console.warn("[WS] Failed to connect:", e);
    }
  }

  disconnect() {
    this.shouldConnect = false;
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.ws?.close();
    this.ws = null;
  }

  subscribe(listener: WSListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  send(data: unknown) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }

  get isConnected() {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}

const WS_URL =
  typeof window !== "undefined"
    ? (process.env.NEXT_PUBLIC_WS_URL ||
        `ws://${window.location.hostname}:8000/ws/status`)
    : "ws://localhost:8000/ws/status";

export const wsClient = new WebSocketClient(WS_URL);
