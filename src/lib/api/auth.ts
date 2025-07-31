// lib/api/auth.ts
import { apiClient } from "./client";
import type { LoginRequest, LoginResponse, ChangePasswordRequest } from "@/types";

export const authApi = {
  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post("/auth/login", data);
    return response.data;
  },

  async changePassword(data: ChangePasswordRequest): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.post("/auth/change-password", data);
    return response.data;
  },

  async logout(): Promise<{ message: string }> {
    const response = await apiClient.post("/auth/logout");
    return response.data;
  },
};