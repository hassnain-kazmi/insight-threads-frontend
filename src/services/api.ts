import { toast } from "sonner";
import { supabase } from "./supabase";
import { logError } from "@/lib/logger";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export interface ApiRequestOptions extends RequestInit {
  requireAuth?: boolean;
}

export class ApiError extends Error {
  status?: number;
  statusText?: string;
  constructor(
    message: string,
    options?: { status?: number; statusText?: string },
  ) {
    super(message);
    this.name = "ApiError";
    this.status = options?.status;
    this.statusText = options?.statusText;
  }
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/$/, "");
  }

  private async getAuthHeaders(): Promise<Record<string, string>> {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (session?.access_token) {
      headers["Authorization"] = `Bearer ${session.access_token}`;
    }
    return headers;
  }

  private async request<T>(
    endpoint: string,
    options: ApiRequestOptions = {},
  ): Promise<T> {
    const { requireAuth = true, ...fetchOptions } = options;
    const url = `${this.baseUrl}${endpoint}`;

    const headers = new Headers(fetchOptions.headers);
    if (requireAuth) {
      const authHeaders = await this.getAuthHeaders();
      for (const [key, value] of Object.entries(authHeaders)) {
        headers.set(key, value);
      }
    } else {
      if (!headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
      }
    }

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        headers,
      });

      if (!response.ok) {
        let errorMessage = `Request failed: ${response.statusText}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.detail || errorData.message || errorMessage;
        } catch {
          // Response is not JSON, use default error message
        }

        const error = new ApiError(errorMessage, {
          status: response.status,
          statusText: response.statusText,
        });

        if (response.status === 401) {
          toast.error("Session expired. Please sign in again.");
          await supabase.auth.signOut();
          window.location.replace("/login");
        } else {
          logError(errorMessage, {
            endpoint: url,
            status: response.status,
          });
        }

        throw error;
      }

      if (response.status === 204) {
        return undefined as T;
      }

      const contentType = response.headers.get("content-type");
      if (contentType?.includes("application/json")) {
        try {
          return await response.json();
        } catch (error) {
          if (error instanceof SyntaxError) {
            return undefined as T;
          }
          throw error;
        }
      }

      return undefined as T;
    } catch (error) {
      if (error instanceof TypeError && error.message === "Failed to fetch") {
        logError("Network error", { endpoint: url });
        throw new ApiError("Network error. Please check your connection.", {
          status: 0,
        });
      }
      throw error;
    }
  }

  async get<T>(endpoint: string, options?: ApiRequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "GET" });
  }

  async post<T>(
    endpoint: string,
    data?: unknown,
    options?: ApiRequestOptions,
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
