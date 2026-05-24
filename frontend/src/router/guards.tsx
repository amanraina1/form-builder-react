import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuthStore } from "../stores/auth";

interface Props {
  children: ReactNode;
}

export const RequireAuth = ({ children }: Props) => {
  //   const token = useAuthStore((s) => s.token);
  //   const location = useLocation();
  //   if (!token) {
  //     const redirect = location.pathname + location.search;
  //     return (
  //       <Navigate
  //         to={`/login?redirect=${encodeURIComponent(redirect)}`}
  //         replace
  //       />
  //     );
  //   }
  return <>{children}</>;
};

export const GuestOnly = ({ children }: Props) => {
  const token = useAuthStore((s) => s.token);
  if (token) return <Navigate to="/" replace />;
  return <>{children}</>;
};
