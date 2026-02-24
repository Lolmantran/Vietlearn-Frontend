import type { ApiError } from "@/types";
import Cookies from "js-cookie";

// Set NEXT_PUBLIC_API_BASE_URL in your .env.local
// e.g. NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api
export const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000/api";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("viet_access_token");
}

export function setToken(token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("viet_access_token", token);
  // Also persist in a cookie so Next.js middleware can read it
  Cookies.set("accessToken", token, {
    expires: 7,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
}

export function clearToken(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem("viet_access_token");
  Cookies.remove("accessToken");
}

export function setAvatarUrl(url: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("viet_avatar_url", url);
}

export function getAvatarUrl(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("viet_avatar_url");
}

export function clearAvatarUrl(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem("viet_avatar_url");
}

interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | boolean>;
}

export class ApiClientError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = "ApiClientError";
  }
}

async function request<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { params, headers: extraHeaders, ...rest } = options;

  let url = `${API_BASE}${endpoint}`;
  if (params) {
    const qs = new URLSearchParams(
      Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)]))
    ).toString();
    url += `?${qs}`;
  }

  const token = getToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extraHeaders,
  };

  const res = await fetch(url, { ...rest, headers });

  if (res.status === 401) {
    clearToken();
    throw new ApiClientError("Unauthorised", 401);
  }

  if (!res.ok) {
    let errBody: ApiError = { message: "Unknown error", statusCode: res.status };
    try {
      errBody = await res.json();
    } catch {
      // ignore parse error
    }
    throw new ApiClientError(errBody.message ?? "Request failed", res.status);
  }

  // Handle 204 or empty body
  const text = await res.text();
  if (!text) return {} as T;
  const json = JSON.parse(text);
  // Unwrap backend envelope: { data: ... }
  return (json !== null && typeof json === "object" && "data" in json ? json.data : json) as T;
}

export const apiClient = {
  get: <T>(endpoint: string, params?: Record<string, string | number | boolean>) =>
    request<T>(endpoint, { method: "GET", params }),

  post: <T>(endpoint: string, body?: unknown) =>
    request<T>(endpoint, { method: "POST", body: JSON.stringify(body) }),

  put: <T>(endpoint: string, body?: unknown) =>
    request<T>(endpoint, { method: "PUT", body: JSON.stringify(body) }),

  patch: <T>(endpoint: string, body?: unknown) =>
    request<T>(endpoint, { method: "PATCH", body: JSON.stringify(body) }),

  delete: <T>(endpoint: string) =>
    request<T>(endpoint, { method: "DELETE" }),
};
