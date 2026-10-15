import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Session } from "@supabase/supabase-js";
import { getSupabase } from "./supabase";
import { AuthContext, type AuthPerson, type AuthState } from "./authContext";

/*
 * Single source of auth truth for the app. Mount once near the root; every
 * consumer reads the same session/subscription instead of calling
 * getSupabase().auth.getSession() and onAuthStateChange independently.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [person, setPerson] = useState<AuthPerson | null>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(() => getSupabase() !== null);

  const loadProfile = useCallback(async (userId: string | undefined) => {
    const supabase = getSupabase();
    if (!supabase || !userId) {
      setPerson(null);
      setRoles([]);
      return;
    }

    /*
     * Maps the signed-in JWT back to a domain person. Depends on the pending
     * `persons.auth_user_id` column (see docs/database/TODO_DATABASE.md); until
     * it exists the query errors and we simply degrade to an unlinked user.
     */
    const { data: personRow, error: personError } = await supabase
      .from("persons")
      .select("id, first_name, last_name, preferred_name")
      .eq("auth_user_id", userId)
      .maybeSingle();

    if (personError || !personRow) {
      setPerson(null);
      setRoles([]);
      return;
    }

    const linked = personRow as AuthPerson;
    setPerson(linked);

    const { data: roleRows } = await supabase
      .from("person_roles")
      .select("role")
      .eq("person_id", linked.id);

    setRoles((roleRows ?? []).map((row: { role: string }) => row.role));
  }, []);

  useEffect(() => {
    const supabase = getSupabase();
    // Initial `loading` already reflects an unconfigured client.
    if (!supabase) return;

    let cancelled = false;

    supabase.auth.getSession().then(async ({ data }) => {
      if (cancelled) return;
      setSession(data.session);
      await loadProfile(data.session?.user.id);
      if (!cancelled) setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, nextSession) => {
      if (cancelled) return;
      setSession(nextSession);
      await loadProfile(nextSession?.user.id);
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [loadProfile]);

  const refresh = useCallback(async () => {
    const supabase = getSupabase();
    if (!supabase) return;
    const { data } = await supabase.auth.getSession();
    setSession(data.session);
    await loadProfile(data.session?.user.id);
  }, [loadProfile]);

  const value = useMemo<AuthState>(
    () => ({
      session,
      user: session?.user ?? null,
      person,
      roles,
      loading,
      refresh,
    }),
    [session, person, roles, loading, refresh],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
