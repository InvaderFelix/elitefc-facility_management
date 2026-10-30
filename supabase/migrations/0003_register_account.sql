-- Provisions a parent account and all of their children in a single
-- transaction. Called by the register-account Edge Function after the
-- Supabase Auth user has been created, so any failure here rolls back
-- every domain insert together.

CREATE OR REPLACE FUNCTION public.register_account(p_payload jsonb)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  v_parent_id uuid;
  v_email_contact_id bigint;
  v_phone_contact_id bigint;
  v_address_id bigint;
  v_season_name text;
  v_child jsonb;
  v_child_id uuid;
  v_child_ids uuid[] := '{}';
BEGIN
  IF COALESCE(jsonb_typeof(p_payload -> 'children'), 'null') <> 'array'
     OR jsonb_array_length(p_payload -> 'children') = 0 THEN
    RAISE EXCEPTION 'At least one child is required';
  END IF;

  -- Parent
  INSERT INTO public.persons (
    first_name,
    last_name,
    identity_status,
    auth_user_id
  )
  VALUES (
    p_payload -> 'parent' ->> 'firstName',
    p_payload -> 'parent' ->> 'lastName',
    'Pending',
    (p_payload ->> 'authUserId')::uuid
  )
  RETURNING id INTO v_parent_id;

  INSERT INTO public.person_roles (person_id, role)
  VALUES (v_parent_id, 'Parent');

  -- Email contact: one row per address, shared by parents and children via
  -- person_contacts. Reuse an existing (possibly orphaned) row; the partial
  -- unique index raises 23505 if a concurrent registration wins the insert.
  SELECT id
  INTO v_email_contact_id
  FROM public.contacts
  WHERE contact_type = 'Email'
    AND lower(btrim(contact_value)) = lower(btrim(p_payload ->> 'email'))
  FOR UPDATE;

  IF v_email_contact_id IS NULL THEN
    INSERT INTO public.contacts (contact_type, contact_value)
    VALUES ('Email', lower(btrim(p_payload ->> 'email')))
    RETURNING id INTO v_email_contact_id;
  END IF;

  INSERT INTO public.person_contacts (
    person_id,
    contact_id,
    is_primary,
    contact_role
  )
  VALUES (v_parent_id, v_email_contact_id, true, 'Personal');

  -- Phone contact
  INSERT INTO public.contacts (contact_type, contact_value)
  VALUES ('Phone', p_payload ->> 'phone')
  RETURNING id INTO v_phone_contact_id;

  INSERT INTO public.person_contacts (
    person_id,
    contact_id,
    is_primary,
    contact_role
  )
  VALUES (v_parent_id, v_phone_contact_id, false, 'Personal');

  -- Address
  INSERT INTO public.addresses (
    address_line_1,
    address_line_2,
    suburb,
    postcode,
    country
  )
  VALUES (
    concat_ws(
      ' ',
      p_payload -> 'address' ->> 'houseNumber',
      p_payload -> 'address' ->> 'streetName'
    ),
    NULLIF(p_payload -> 'address' ->> 'unitNumber', ''),
    p_payload -> 'address' ->> 'suburb',
    p_payload -> 'address' ->> 'postcode',
    'Australia'
  )
  RETURNING id INTO v_address_id;

  INSERT INTO public.person_addresses (
    person_id,
    address_id,
    address_type,
    is_primary
  )
  VALUES (v_parent_id, v_address_id, 'Home', true);

  -- Current season for player registrations
  SELECT name
  INTO v_season_name
  FROM public.seasons
  WHERE is_current = true
  ORDER BY start_date DESC
  LIMIT 1;

  v_season_name := COALESCE(v_season_name, '2026');

  -- Children
  FOR v_child IN
    SELECT value FROM jsonb_array_elements(p_payload -> 'children')
  LOOP
    INSERT INTO public.persons (
      first_name,
      last_name,
      date_of_birth,
      identity_status
    )
    VALUES (
      v_child ->> 'firstName',
      v_child ->> 'lastName',
      (v_child ->> 'dateOfBirth')::date,
      'Pending'
    )
    RETURNING id INTO v_child_id;

    v_child_ids := array_append(v_child_ids, v_child_id);

    INSERT INTO public.person_roles (person_id, role)
    VALUES (v_child_id, 'Player');

    -- The child is reached through the parent's contacts
    INSERT INTO public.person_contacts (person_id, contact_id, is_primary, contact_role)
    VALUES (v_child_id, v_email_contact_id, true, 'Guardian');

    INSERT INTO public.person_contacts (person_id, contact_id, is_primary, contact_role)
    VALUES (v_child_id, v_phone_contact_id, false, 'Guardian');

    INSERT INTO public.parent_child_relationship (
      parent_id,
      child_id,
      relationship_type,
      is_primary_guardian,
      pickup_authority,
      medical_authority,
      financial_responsibility
    )
    VALUES (v_parent_id, v_child_id, 'Parent', true, true, true, true);

    INSERT INTO public.player_profiles (person_id)
    VALUES (v_child_id);

    INSERT INTO public.player_registrations (
      person_id,
      season,
      registration_status,
      fee_status
    )
    VALUES (v_child_id, v_season_name, 'Pending', 'Unpaid');
  END LOOP;

  RETURN jsonb_build_object(
    'parentId', v_parent_id,
    'childIds', to_jsonb(v_child_ids)
  );
END;
$$;

-- Only the service-role Edge Function may provision accounts; this bypasses
-- the client-side payload validation otherwise.
REVOKE ALL ON FUNCTION public.register_account(jsonb) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.register_account(jsonb) FROM anon, authenticated;
GRANT EXECUTE ON FUNCTION public.register_account(jsonb) TO service_role;
