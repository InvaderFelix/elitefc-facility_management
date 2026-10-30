-- Captures the RLS policies that were applied directly in the Supabase
-- dashboard and were missing from git. Reconstructed from pg_policies on the
-- linked project (iklvorsngnfrlrowwnev) so the repo is the source of truth.
--
-- NOTE: these policies grant the `anon` role widespread INSERT on the
-- registration tables. They predate the register_account RPC; the RPC runs as
-- the service role and bypasses RLS, so these can be tightened later.

ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parent_child_relationship ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.person_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.person_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.person_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.persons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.player_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.player_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seasons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "allow_insert_addresses" ON public.addresses
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "allow_insert_contacts" ON public.contacts
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "allow_insert_parent_child" ON public.parent_child_relationship
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "allow_insert_person_addresses" ON public.person_addresses
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "allow_insert_person_contacts" ON public.person_contacts
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "allow_insert_person_roles" ON public.person_roles
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "allow_insert_person" ON public.persons
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "allow_read_own_person" ON public.persons
  FOR SELECT TO anon USING (auth_user_id = auth.uid());

CREATE POLICY "allow_insert_player_profiles" ON public.player_profiles
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "allow_insert_player_registrations" ON public.player_registrations
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "allow_read_seasons" ON public.seasons
  FOR SELECT TO anon USING (true);
