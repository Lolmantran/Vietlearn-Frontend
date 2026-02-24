// WebSocket event types for the AI tutor chat

export interface WsUserMessagePayload {
  text: string;
}

export interface WsTutorCorrection {
  original: string;
  corrected: string;
  explanation: string;
}

export interface WsAssistantMessagePayload {
  text: string;
  corrections?: WsTutorCorrection[];
  suggestions?: string[];
  isComplete?: boolean; // for streaming
}

export interface WsTokenStreamPayload {
  token: string;
  isLast: boolean;
}

export type WsClientEvent = "user_message";
export type WsServerEvent = "assistant_message" | "token_stream" | "typing" | "error";

export interface WsConnectionOptions {
  sessionId: string;
  userId: string;
  apiBaseUrl: string;
  /** Called with each server event */
  onMessage: (payload: WsAssistantMessagePayload) => void;
  onTokenStream?: (payload: WsTokenStreamPayload) => void;
  onTyping?: (isTyping: boolean) => void;
  onError?: (error: string) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
}
