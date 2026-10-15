import { createContext } from "react";
import type { Session, User } from "@supabase/supabase-js";

/** Subset of a `persons` row surfaced to the UI. */
export interface AuthPerson {
  id: string;
  first_name: string;
  last_name: string;
  preferred_name: string | null;
}

export interface AuthState {
  /** Supabase auth session, null when signed out. */
  session: Session | null;
  /** Convenience alias for session.user. */
  user: User | null;
  /** Domain identity linked to this auth user, if one exists. */
  person: AuthPerson | null;
  /** Roles from `person_roles`, e.g. ["Player", "Parent"]. */
  roles: string[];
  /** True until the initial session check resolves. */
  loading: boolean;
  /** Re-read session + person/roles, e.g. after a profile update. */
  refresh: () => Promise<void>;
}

/*
 * The context object is kept in its own module (no components exported here)
 * so the provider file stays fast-refresh friendly.
 */
export const AuthContext = createContext<AuthState | null>(null);
