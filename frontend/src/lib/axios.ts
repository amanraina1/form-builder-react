import axios from "axios";
// import { useAuthStore } from "../stores/auth";

let onUnauthorized: ((redirectTo: string) => void) | null = null;

export const setUnauthorizedHandler = (
  handler: (redirectTo: string) => void,
): void => {
  onUnauthorized = handler;
};

export const installAxiosInterceptors = (): void => {
  axios.defaults.baseURL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

  axios.interceptors.request.use((config) => {
    // const token = useAuthStore.getState().token;
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  });

  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error?.response?.status === 401) {
        // useAuthStore.getState().clear();
        const path = window.location.pathname + window.location.search;
        if (window.location.pathname !== "/login") {
          onUnauthorized?.(path);
        }
      }
      return Promise.reject(error);
    },
  );
};

export default axios;
