import { type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../lib/useAuth";

interface RequireRoleProps {
  /** Route is shown when the signed-in person holds at least one of these. */
  roles: string[];
  /** Where to send authenticated users who lack the role. */
  fallbackTo?: string;
  children: ReactNode;
}

/** Gate a route tree behind a role (from `person_roles`). */
export function RequireRole({
  roles,
  fallbackTo = "/portal",
  children,
}: RequireRoleProps) {
  const { loading, person, roles: granted } = useAuth();

  if (loading) return null;

  if (!person) {
    return <Navigate to="/" replace />;
  }

  const allowed = roles.some((role) => granted.includes(role));
  if (!allowed) {
    return <Navigate to={fallbackTo} replace />;
  }

  return <>{children}</>;
}
