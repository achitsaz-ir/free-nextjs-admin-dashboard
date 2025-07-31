// store/auth.ts (Zustand store)
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserProfile, LoginResponse } from "@/types";

interface AuthState {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (response: LoginResponse) => void;
  logout: () => void;
  updateUser: (user: UserProfile) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: (response: LoginResponse) => {
        const { access_token, user } = response;
        
        set({
          user,
          token: access_token,
          isAuthenticated: true,
        });

        // Store in localStorage for persistence
        localStorage.setItem("auth_token", access_token);
        localStorage.setItem("auth_user", JSON.stringify(user));
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });

        // Clear localStorage
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_user");
        localStorage.removeItem("rememberMe");
      },

      updateUser: (user: UserProfile) => {
        set({ user });
        localStorage.setItem("auth_user", JSON.stringify(user));
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);