import axios from "axios";
import { ApiResponse, ApiError } from "@/types/api";

// Create axios instance with default config
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage or your auth solution
    const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // Server responded with error status
      const apiError: ApiError = {
        statusCode: error.response.status,
        message: error.response.data?.message || "An error occurred",
        error: error.response.data?.error,
        timestamp: new Date().toISOString(),
      };
      
      // Handle specific status codes
      if (error.response.status === 401) {
        // Unauthorized - clear auth and redirect to login
        if (typeof window !== "undefined") {
          localStorage.removeItem("auth_token");
          window.location.href = "/login";
        }
      }
      
      return Promise.reject(apiError);
    } else if (error.request) {
      // Request made but no response received
      return Promise.reject({
        statusCode: 0,
        message: "No response from server",
        timestamp: new Date().toISOString(),
      });
    } else {
      // Something else happened
      return Promise.reject({
        statusCode: 0,
        message: error.message || "Request failed",
        timestamp: new Date().toISOString(),
      });
    }
  }
);

/**
 * Helper function to handle API responses
 */
export async function handleApiResponse<T>(
  promise: Promise<{ data: ApiResponse<T> }>
): Promise<T> {
  const response = await promise;
  
  if (response.data.success && response.data.data) {
    return response.data.data;
  }
  
  throw new Error(response.data.error || "API request failed");
}
