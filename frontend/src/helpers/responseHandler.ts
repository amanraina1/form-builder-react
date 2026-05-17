import axios from "axios";
import { useAlertStore } from "../stores/alert";

export const successHandler = (message: string): void => {
  useAlertStore.getState().show({ type: "success", message });
};

export const errorHandler = (err: unknown): void => {
  let message = "Something went wrong. Please try again.";
  if (axios.isAxiosError(err)) {
    message = err.response?.data?.message || err.message || message;
  } else if (err instanceof Error) {
    message = err.message;
  }
  useAlertStore.getState().show({ type: "danger", message });
};

export const extractFieldErrors = (
  err: unknown,
): Record<string, string[] | string> => {
  if (axios.isAxiosError(err)) {
    return err.response?.data?.errors || {};
  }
  return {};
};
