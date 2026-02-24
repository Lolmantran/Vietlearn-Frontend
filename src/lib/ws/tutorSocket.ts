import type {
  WsConnectionOptions,
  WsAssistantMessagePayload,
  WsTokenStreamPayload,
} from "./types";

const MAX_RETRIES = 5;
const BASE_DELAY_MS = 1000;

export class TutorSocketClient {
  private ws: WebSocket | null = null;
  private options: WsConnectionOptions;
  private retryCount = 0;
  private retryTimer: ReturnType<typeof setTimeout> | null = null;
  private intentionalClose = false;

  constructor(options: WsConnectionOptions) {
    this.options = options;
  }

  connect(): void {
    this.intentionalClose = false;
    this._openConnection();
  }

  disconnect(): void {
    this.intentionalClose = true;
    if (this.retryTimer) clearTimeout(this.retryTimer);
    this.ws?.close();
    this.ws = null;
  }

  sendMessage(text: string): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.warn("WS not open, message dropped");
      return;
    }
    this.ws.send(JSON.stringify({ event: "user_message", data: { text } }));
  }

  private _openConnection(): void {
    const { sessionId, userId, apiBaseUrl } = this.options;
    // Strip /api suffix to get the raw base, then convert http→ws
    const wsBase = apiBaseUrl.replace(/\/api$/, "").replace(/^http/, "ws");
    const url = `${wsBase}/tutor?sessionId=${encodeURIComponent(sessionId)}&userId=${encodeURIComponent(userId)}`;

    this.ws = new WebSocket(url);

    this.ws.onopen = () => {
      this.retryCount = 0;
      this.options.onConnect?.();
    };

    this.ws.onmessage = (event: MessageEvent) => {
      try {
        const parsed = JSON.parse(event.data as string) as {
          event: string;
          data: unknown;
        };
        if (parsed.event === "assistant_message") {
          this.options.onMessage(parsed.data as WsAssistantMessagePayload);
        } else if (parsed.event === "token_stream") {
          this.options.onTokenStream?.(parsed.data as WsTokenStreamPayload);
        } else if (parsed.event === "typing") {
          this.options.onTyping?.(true);
        } else if (parsed.event === "error") {
          this.options.onError?.(String(parsed.data));
        }
      } catch {
        // ignore malformed message
      }
    };

    this.ws.onclose = () => {
      this.options.onDisconnect?.();
      if (!this.intentionalClose) {
        this._scheduleReconnect();
      }
    };

    this.ws.onerror = () => {
      this.options.onError?.("WebSocket connection error");
    };
  }

  private _scheduleReconnect(): void {
    if (this.retryCount >= MAX_RETRIES) {
      this.options.onError?.("Max reconnect attempts reached");
      return;
    }
    const delay = BASE_DELAY_MS * Math.pow(2, this.retryCount);
    this.retryCount++;
    this.retryTimer = setTimeout(() => {
      this._openConnection();
    }, delay);
  }
}
