ALTER TABLE public.persons ADD COLUMN IF NOT EXISTS auth_user_id uuid UNIQUE REFERENCES auth.users(id);
ALTER TABLE public.persons ADD COLUMN IF NOT EXISTS age_group text;
ALTER TABLE public.persons ADD COLUMN IF NOT EXISTS program text;