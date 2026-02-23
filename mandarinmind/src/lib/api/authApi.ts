import { apiClient, setToken, clearToken } from "./client";
import type { AuthCredentials, RegisterPayload, AuthResponse, User } from "@/types";

export const authApi = {
  login: async (credentials: AuthCredentials): Promise<AuthResponse> => {
    const res = await apiClient.post<AuthResponse>("/auth/login", credentials);
    setToken(res.accessToken);
    return res;
  },

  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    const res = await apiClient.post<AuthResponse>("/auth/register", payload);
    setToken(res.accessToken);
    return res;
  },

  getMe: (): Promise<User> => apiClient.get<User>("/me"),

  logout: (): void => {
    clearToken();
  },
};
