import { create } from "zustand";
import type { User } from "../types";

const TOKEN_KEY = "fb_token";
const USER_KEY = "fb_user";

const readUser = (): User | null => {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
};

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: () => boolean;
  setSession: (payload: { token: string; user: User }) => void;
  clear: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  token: localStorage.getItem(TOKEN_KEY),
  user: readUser(),
  isAuthenticated: () => !!get().token,
  setSession: ({ token, user }) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    set({ token, user });
  },
  clear: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    set({ token: null, user: null });
  },
}));
