import { create } from "zustand";

type AlertType = "success" | "danger" | "";

interface AlertState {
  message: string;
  type: AlertType;
  show: (payload: { type: Exclude<AlertType, "">; message: string }) => void;
  dismiss: () => void;
}

let dismissTimer: ReturnType<typeof setTimeout> | null = null;

export const useAlertStore = create<AlertState>((set) => ({
  message: "",
  type: "",
  show: ({ type, message }) => {
    set({ type, message });
    if (dismissTimer) clearTimeout(dismissTimer);
    dismissTimer = setTimeout(() => {
      set({ type: "", message: "" });
      dismissTimer = null;
    }, 4000);
  },
  dismiss: () => {
    if (dismissTimer) {
      clearTimeout(dismissTimer);
      dismissTimer = null;
    }
    set({ type: "", message: "" });
  },
}));
