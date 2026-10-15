import { type ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../lib/useAuth";

/** Gate a route tree behind a valid session. */
export function RequireAuth({ children }: { children: ReactNode }) {
  const { loading, session } = useAuth();
  const location = useLocation();

  if (loading) return null;

  if (!session) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return <>{children}</>;
}
