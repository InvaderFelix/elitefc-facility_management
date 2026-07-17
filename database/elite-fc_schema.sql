-- EliteFC schema
-- ==============

-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.persons (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  first_name character varying NOT NULL,
  middle_name character varying,
  last_name character varying NOT NULL,
  preferred_name character varying,
  date_of_birth date,
  gender character varying,
  identity_status character varying NOT NULL DEFAULT 'Pending'::character varying,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  elite_id text NOT NULL DEFAULT ('P'::text || lpad((nextval('elite_id_seq'::regclass))::text, 6, '0'::text)) UNIQUE,
  CONSTRAINT persons_pkey PRIMARY KEY (id)
);
CREATE TABLE public.addresses (
  id bigint NOT NULL DEFAULT nextval('addresses_id_seq'::regclass),
  address_line_1 character varying NOT NULL,
  address_line_2 character varying,
  suburb character varying,
  state character varying,
  postcode character varying,
  country character varying NOT NULL DEFAULT 'Australia'::character varying,
  latitude numeric,
  longitude numeric,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT addresses_pkey PRIMARY KEY (id)
);
CREATE TABLE public.person_addresses (
  person_id uuid NOT NULL,
  address_id bigint NOT NULL,
  address_type character varying NOT NULL DEFAULT 'Home'::character varying,
  is_primary boolean NOT NULL DEFAULT true,
  start_date date,
  end_date date,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT person_addresses_pkey PRIMARY KEY (person_id, address_id),
  CONSTRAINT person_addresses_person_id_fkey FOREIGN KEY (person_id) REFERENCES public.persons(id),
  CONSTRAINT person_addresses_address_id_fkey FOREIGN KEY (address_id) REFERENCES public.addresses(id)
);
CREATE TABLE public.contacts (
  id bigint NOT NULL DEFAULT nextval('contacts_id_seq'::regclass),
  contact_type character varying NOT NULL,
  contact_value character varying NOT NULL,
  is_verified boolean NOT NULL DEFAULT false,
  verified_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT contacts_pkey PRIMARY KEY (id)
);
CREATE TABLE public.person_contacts (
  person_id uuid NOT NULL,
  contact_id bigint NOT NULL,
  contact_role character varying DEFAULT 'Personal'::character varying,
  is_primary boolean NOT NULL DEFAULT false,
  receives_email boolean NOT NULL DEFAULT true,
  receives_sms boolean NOT NULL DEFAULT true,
  receives_notifications boolean NOT NULL DEFAULT true,
  start_date date,
  end_date date,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT person_contacts_pkey PRIMARY KEY (person_id, contact_id),
  CONSTRAINT person_contacts_person_id_fkey FOREIGN KEY (person_id) REFERENCES public.persons(id),
  CONSTRAINT person_contacts_contact_id_fkey FOREIGN KEY (contact_id) REFERENCES public.contacts(id)
);
CREATE TABLE public.person_roles (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  person_id uuid NOT NULL,
  role character varying NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT person_roles_pkey PRIMARY KEY (id),
  CONSTRAINT person_roles_person_id_fkey FOREIGN KEY (person_id) REFERENCES public.persons(id)
);
CREATE TABLE public.person_identifiers (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  person_id uuid NOT NULL,
  identifier_type character varying NOT NULL,
  identifier_value character varying NOT NULL,
  issuing_organisation character varying,
  verified boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT person_identifiers_pkey PRIMARY KEY (id),
  CONSTRAINT person_identifiers_person_id_fkey FOREIGN KEY (person_id) REFERENCES public.persons(id)
);
CREATE TABLE public.parent_child_relationship (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  parent_id uuid NOT NULL,
  child_id uuid NOT NULL,
  relationship_type character varying NOT NULL,
  is_primary_guardian boolean NOT NULL DEFAULT false,
  pickup_authority boolean NOT NULL DEFAULT false,
  medical_authority boolean NOT NULL DEFAULT false,
  financial_responsibility boolean NOT NULL DEFAULT false,
  receives_reports boolean NOT NULL DEFAULT true,
  receives_invoices boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT parent_child_relationship_pkey PRIMARY KEY (id),
  CONSTRAINT parent_child_relationship_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.persons(id),
  CONSTRAINT parent_child_relationship_child_id_fkey FOREIGN KEY (child_id) REFERENCES public.persons(id)
  CONSTRAINT parent_child_relationship_parent_not_child_chk CHECK (parent_id <> child_id)
);
CREATE TABLE public.emergency_contacts (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  person_id uuid NOT NULL,
  contact_person_id uuid,
  contact_name character varying,
  relationship character varying,
  phone character varying,
  email character varying,
  priority integer NOT NULL DEFAULT 1,
  notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT emergency_contacts_pkey PRIMARY KEY (id),
  CONSTRAINT emergency_contacts_person_id_fkey FOREIGN KEY (person_id) REFERENCES public.persons(id),
  CONSTRAINT emergency_contacts_contact_person_id_fkey FOREIGN KEY (contact_person_id) REFERENCES public.persons(id)
);
CREATE TABLE public.player_profiles (
  person_id uuid NOT NULL,
  preferred_position character varying,
  secondary_position character varying,
  dominant_foot character varying,
  previous_club character varying,
  playing_since date,
  height_cm integer,
  weight_kg numeric,
  notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT player_profiles_pkey PRIMARY KEY (person_id),
  CONSTRAINT player_profiles_person_id_fkey FOREIGN KEY (person_id) REFERENCES public.persons(id)
);
CREATE TABLE public.player_registrations (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  person_id uuid NOT NULL,
  season character varying NOT NULL,
  registration_date date NOT NULL DEFAULT CURRENT_DATE,
  registration_status character varying NOT NULL DEFAULT 'Pending'::character varying,
  fee_status character varying DEFAULT 'Unpaid'::character varying,
  registered_by uuid,
  notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT player_registrations_pkey PRIMARY KEY (id),
  CONSTRAINT player_registrations_person_id_fkey FOREIGN KEY (person_id) REFERENCES public.persons(id),
  CONSTRAINT player_registrations_registered_by_fkey FOREIGN KEY (registered_by) REFERENCES public.persons(id)
);
CREATE TABLE public.player_medical (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  person_id uuid NOT NULL,
  condition character varying,
  allergy character varying,
  medication character varying,
  requires_epipen boolean DEFAULT false,
  medical_notes text,
  effective_from date,
  effective_to date,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT player_medical_pkey PRIMARY KEY (id),
  CONSTRAINT player_medical_person_id_fkey FOREIGN KEY (person_id) REFERENCES public.persons(id)
);
CREATE TABLE public.player_consents (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  person_id uuid NOT NULL,
  consent_type character varying NOT NULL,
  granted boolean NOT NULL DEFAULT false,
  granted_by uuid,
  granted_at timestamp with time zone,
  expires_at timestamp with time zone,
  notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT player_consents_pkey PRIMARY KEY (id),
  CONSTRAINT player_consents_person_id_fkey FOREIGN KEY (person_id) REFERENCES public.persons(id),
  CONSTRAINT player_consents_granted_by_fkey FOREIGN KEY (granted_by) REFERENCES public.persons(id)
);
CREATE TABLE public.player_documents (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  person_id uuid NOT NULL,
  document_type character varying NOT NULL,
  document_name character varying,
  storage_path text,
  expiry_date date,
  verified boolean NOT NULL DEFAULT false,
  verified_by uuid,
  verified_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT player_documents_pkey PRIMARY KEY (id),
  CONSTRAINT player_documents_person_id_fkey FOREIGN KEY (person_id) REFERENCES public.persons(id),
  CONSTRAINT player_documents_verified_by_fkey FOREIGN KEY (verified_by) REFERENCES public.persons(id)
);
CREATE TABLE public.player_injuries (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  person_id uuid NOT NULL,
  injury_type character varying NOT NULL,
  description text,
  occurred_date date,
  expected_return_date date,
  actual_return_date date,
  status character varying DEFAULT 'Active'::character varying,
  notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT player_injuries_pkey PRIMARY KEY (id),
  CONSTRAINT player_injuries_person_id_fkey FOREIGN KEY (person_id) REFERENCES public.persons(id)
);
CREATE TABLE public.player_assessments (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  person_id uuid NOT NULL,
  assessor_id uuid NOT NULL,
  assessment_date date NOT NULL DEFAULT CURRENT_DATE,
  technical_score integer,
  tactical_score integer,
  physical_score integer,
  mental_score integer,
  comments text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT player_assessments_pkey PRIMARY KEY (id),
  CONSTRAINT player_assessments_person_id_fkey FOREIGN KEY (person_id) REFERENCES public.persons(id),
  CONSTRAINT player_assessments_assessor_id_fkey FOREIGN KEY (assessor_id) REFERENCES public.persons(id)
);
CREATE TABLE public.player_awards (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  person_id uuid NOT NULL,
  award_name character varying NOT NULL,
  season character varying,
  awarded_date date,
  notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT player_awards_pkey PRIMARY KEY (id),
  CONSTRAINT player_awards_person_id_fkey FOREIGN KEY (person_id) REFERENCES public.persons(id)
);
CREATE TABLE public.player_photos (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  person_id uuid NOT NULL,
  storage_path text NOT NULL,
  is_profile_photo boolean DEFAULT false,
  taken_date date,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT player_photos_pkey PRIMARY KEY (id),
  CONSTRAINT player_photos_person_id_fkey FOREIGN KEY (person_id) REFERENCES public.persons(id)
);
CREATE TABLE public.player_attendance (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  person_id uuid NOT NULL,
  session_type character varying NOT NULL,
  session_date date NOT NULL,
  status character varying NOT NULL,
  arrival_time timestamp with time zone,
  departure_time timestamp with time zone,
  reason text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT player_attendance_pkey PRIMARY KEY (id),
  CONSTRAINT player_attendance_person_id_fkey FOREIGN KEY (person_id) REFERENCES public.persons(id)
);
CREATE TABLE public.seasons (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name character varying NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  is_current boolean DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT seasons_pkey PRIMARY KEY (id)
);
CREATE TABLE public.teams (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  season_id uuid NOT NULL,
  name character varying NOT NULL,
  age_group character varying,
  gender character varying,
  competition character varying,
  team_type character varying DEFAULT 'Competitive'::character varying,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT teams_pkey PRIMARY KEY (id),
  CONSTRAINT teams_season_id_fkey FOREIGN KEY (season_id) REFERENCES public.seasons(id)
);
CREATE TABLE public.team_members (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  team_id uuid NOT NULL,
  person_id uuid NOT NULL,
  joined_date date,
  left_date date,
  jersey_number integer,
  position character varying,
  membership_status character varying DEFAULT 'Active'::character varying,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT team_members_pkey PRIMARY KEY (id),
  CONSTRAINT team_members_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.teams(id),
  CONSTRAINT team_members_person_id_fkey FOREIGN KEY (person_id) REFERENCES public.persons(id)
);
CREATE TABLE public.team_coaches (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  team_id uuid NOT NULL,
  person_id uuid NOT NULL,
  role character varying DEFAULT 'Head Coach'::character varying,
  start_date date,
  end_date date,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT team_coaches_pkey PRIMARY KEY (id),
  CONSTRAINT team_coaches_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.teams(id),
  CONSTRAINT team_coaches_person_id_fkey FOREIGN KEY (person_id) REFERENCES public.persons(id)
);
CREATE TABLE public.team_managers (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  team_id uuid NOT NULL,
  person_id uuid NOT NULL,
  role character varying DEFAULT 'Team Manager'::character varying,
  start_date date,
  end_date date,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT team_managers_pkey PRIMARY KEY (id),
  CONSTRAINT team_managers_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.teams(id),
  CONSTRAINT team_managers_person_id_fkey FOREIGN KEY (person_id) REFERENCES public.persons(id)
);
CREATE TABLE public.events (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title character varying NOT NULL,
  event_type character varying NOT NULL,
  start_time timestamp with time zone NOT NULL,
  end_time timestamp with time zone,
  location character varying,
  team_id uuid,
  created_by uuid,
  description text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT events_pkey PRIMARY KEY (id),
  CONSTRAINT events_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.teams(id),
  CONSTRAINT events_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.persons(id)
);
CREATE TABLE public.bookings (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL,
  person_id uuid NOT NULL,
  booking_status character varying DEFAULT 'Booked'::character varying,
  attendance_status character varying,
  checked_in_at timestamp with time zone,
  notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT bookings_pkey PRIMARY KEY (id),
  CONSTRAINT bookings_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(id),
  CONSTRAINT bookings_person_id_fkey FOREIGN KEY (person_id) REFERENCES public.persons(id)
);
CREATE TABLE public.training_sessions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL,
  coach_id uuid,
  training_theme character varying,
  training_plan text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT training_sessions_pkey PRIMARY KEY (id),
  CONSTRAINT training_sessions_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(id),
  CONSTRAINT training_sessions_coach_id_fkey FOREIGN KEY (coach_id) REFERENCES public.persons(id)
);
CREATE TABLE public.matches (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL,
  opponent character varying,
  competition character varying,
  home_away character varying,
  result character varying,
  score_for integer,
  score_against integer,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT matches_pkey PRIMARY KEY (id),
  CONSTRAINT matches_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(id)
);
CREATE TABLE public.match_players (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  match_id uuid NOT NULL,
  person_id uuid NOT NULL,
  starting_position character varying,
  was_starter boolean DEFAULT false,
  minutes_played integer,
  goals integer DEFAULT 0,
  assists integer DEFAULT 0,
  yellow_cards integer DEFAULT 0,
  red_cards integer DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT match_players_pkey PRIMARY KEY (id),
  CONSTRAINT match_players_match_id_fkey FOREIGN KEY (match_id) REFERENCES public.matches(id),
  CONSTRAINT match_players_person_id_fkey FOREIGN KEY (person_id) REFERENCES public.persons(id)
);
CREATE TABLE public.match_events (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  match_id uuid NOT NULL,
  person_id uuid,
  event_type character varying NOT NULL,
  minute integer,
  description text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT match_events_pkey PRIMARY KEY (id),
  CONSTRAINT match_events_match_id_fkey FOREIGN KEY (match_id) REFERENCES public.matches(id),
  CONSTRAINT match_events_person_id_fkey FOREIGN KEY (person_id) REFERENCES public.persons(id)
);
CREATE TABLE public.tournaments (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name character varying NOT NULL,
  location character varying,
  start_date date,
  end_date date,
  organiser character varying,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT tournaments_pkey PRIMARY KEY (id)
);
CREATE TABLE public.tournament_teams (
  tournament_id uuid NOT NULL,
  team_id uuid NOT NULL,
  CONSTRAINT tournament_teams_pkey PRIMARY KEY (tournament_id, team_id),
  CONSTRAINT tournament_teams_tournament_id_fkey FOREIGN KEY (tournament_id) REFERENCES public.tournaments(id),
  CONSTRAINT tournament_teams_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.teams(id)
);
CREATE TABLE public.facilities (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name character varying NOT NULL,
  facility_type character varying NOT NULL,
  location character varying,
  capacity integer,
  is_active boolean NOT NULL DEFAULT true,
  notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT facilities_pkey PRIMARY KEY (id)
);
CREATE TABLE public.pitches (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  facility_id uuid,
  name character varying NOT NULL,
  surface_type character varying,
  pitch_size character varying,
  lighting_available boolean DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT pitches_pkey PRIMARY KEY (id),
  CONSTRAINT pitches_facility_id_fkey FOREIGN KEY (facility_id) REFERENCES public.facilities(id)
);
CREATE TABLE public.facility_bookings (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  facility_id uuid NOT NULL,
  event_id uuid,
  booked_by uuid,
  start_time timestamp with time zone NOT NULL,
  end_time timestamp with time zone NOT NULL,
  booking_type character varying NOT NULL,
  status character varying NOT NULL DEFAULT 'Confirmed'::character varying,
  notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT facility_bookings_pkey PRIMARY KEY (id),
  CONSTRAINT facility_bookings_facility_id_fkey FOREIGN KEY (facility_id) REFERENCES public.facilities(id),
  CONSTRAINT facility_bookings_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(id),
  CONSTRAINT facility_bookings_booked_by_fkey FOREIGN KEY (booked_by) REFERENCES public.persons(id)
);
CREATE TABLE public.pitch_bookings (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  pitch_id uuid NOT NULL,
  event_id uuid,
  booked_by uuid,
  start_time timestamp with time zone NOT NULL,
  end_time timestamp with time zone NOT NULL,
  booking_type character varying NOT NULL,
  status character varying NOT NULL DEFAULT 'Confirmed'::character varying,
  notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT pitch_bookings_pkey PRIMARY KEY (id),
  CONSTRAINT pitch_bookings_pitch_id_fkey FOREIGN KEY (pitch_id) REFERENCES public.pitches(id),
  CONSTRAINT pitch_bookings_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(id),
  CONSTRAINT pitch_bookings_booked_by_fkey FOREIGN KEY (booked_by) REFERENCES public.persons(id)
);
CREATE TABLE public.gym_equipment (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  facility_id uuid,
  name character varying NOT NULL,
  equipment_type character varying,
  manufacturer character varying,
  model character varying,
  serial_number character varying,
  purchase_date date,
  condition character varying DEFAULT 'Good'::character varying,
  service_due date,
  is_active boolean NOT NULL DEFAULT true,
  notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT gym_equipment_pkey PRIMARY KEY (id),
  CONSTRAINT gym_equipment_facility_id_fkey FOREIGN KEY (facility_id) REFERENCES public.facilities(id)
);
CREATE TABLE public.gym_programs (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name character varying NOT NULL,
  description text,
  created_by uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT gym_programs_pkey PRIMARY KEY (id),
  CONSTRAINT gym_programs_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.persons(id)
);
CREATE TABLE public.gym_sessions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  person_id uuid NOT NULL,
  program_id uuid,
  event_id uuid,
  coach_id uuid,
  start_time timestamp with time zone NOT NULL,
  end_time timestamp with time zone,
  notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT gym_sessions_pkey PRIMARY KEY (id),
  CONSTRAINT gym_sessions_person_id_fkey FOREIGN KEY (person_id) REFERENCES public.persons(id),
  CONSTRAINT gym_sessions_program_id_fkey FOREIGN KEY (program_id) REFERENCES public.gym_programs(id),
  CONSTRAINT gym_sessions_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(id),
  CONSTRAINT gym_sessions_coach_id_fkey FOREIGN KEY (coach_id) REFERENCES public.persons(id)
);
CREATE TABLE public.gym_session_equipment (
  gym_session_id uuid NOT NULL,
  equipment_id uuid NOT NULL,
  usage_notes text,
  CONSTRAINT gym_session_equipment_pkey PRIMARY KEY (gym_session_id, equipment_id),
  CONSTRAINT gym_session_equipment_gym_session_id_fkey FOREIGN KEY (gym_session_id) REFERENCES public.gym_sessions(id),
  CONSTRAINT gym_session_equipment_equipment_id_fkey FOREIGN KEY (equipment_id) REFERENCES public.gym_equipment(id)
);
CREATE TABLE public.membership_types (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name character varying NOT NULL,
  description text,
  amount numeric,
  duration_months integer,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT membership_types_pkey PRIMARY KEY (id)
);
CREATE TABLE public.memberships (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  person_id uuid NOT NULL,
  membership_type_id uuid,
  start_date date NOT NULL,
  end_date date,
  status character varying NOT NULL DEFAULT 'Active'::character varying,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT memberships_pkey PRIMARY KEY (id),
  CONSTRAINT memberships_person_id_fkey FOREIGN KEY (person_id) REFERENCES public.persons(id),
  CONSTRAINT memberships_membership_type_id_fkey FOREIGN KEY (membership_type_id) REFERENCES public.membership_types(id)
);
CREATE TABLE public.invoices (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  person_id uuid NOT NULL,
  invoice_number character varying UNIQUE,
  description text,
  amount numeric NOT NULL,
  due_date date,
  status character varying NOT NULL DEFAULT 'Outstanding'::character varying,
  issued_at timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT invoices_pkey PRIMARY KEY (id),
  CONSTRAINT invoices_person_id_fkey FOREIGN KEY (person_id) REFERENCES public.persons(id)
);
CREATE TABLE public.payments (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  invoice_id uuid,
  person_id uuid NOT NULL,
  amount numeric NOT NULL,
  payment_method character varying,
  payment_reference character varying,
  paid_at timestamp with time zone,
  status character varying DEFAULT 'Completed'::character varying,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT payments_pkey PRIMARY KEY (id),
  CONSTRAINT payments_invoice_id_fkey FOREIGN KEY (invoice_id) REFERENCES public.invoices(id),
  CONSTRAINT payments_person_id_fkey FOREIGN KEY (person_id) REFERENCES public.persons(id)
);
CREATE TABLE public.discounts (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  person_id uuid,
  discount_type character varying,
  amount numeric,
  percentage numeric,
  reason text,
  valid_from date,
  valid_to date,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT discounts_pkey PRIMARY KEY (id),
  CONSTRAINT discounts_person_id_fkey FOREIGN KEY (person_id) REFERENCES public.persons(id)
);
CREATE TABLE public.refunds (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  payment_id uuid NOT NULL,
  amount numeric NOT NULL,
  reason text,
  refunded_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT refunds_pkey PRIMARY KEY (id),
  CONSTRAINT refunds_payment_id_fkey FOREIGN KEY (payment_id) REFERENCES public.payments(id)
);
CREATE TABLE public.communications (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  sender_id uuid,
  communication_type character varying NOT NULL,
  subject character varying,
  body text,
  sent_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT communications_pkey PRIMARY KEY (id),
  CONSTRAINT communications_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES public.persons(id)
);
CREATE TABLE public.communication_recipients (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  communication_id uuid NOT NULL,
  person_id uuid NOT NULL,
  contact_id bigint,
  delivery_status character varying,
  delivered_at timestamp with time zone,
  opened_at timestamp with time zone,
  CONSTRAINT communication_recipients_pkey PRIMARY KEY (id),
  CONSTRAINT communication_recipients_communication_id_fkey FOREIGN KEY (communication_id) REFERENCES public.communications(id),
  CONSTRAINT communication_recipients_person_id_fkey FOREIGN KEY (person_id) REFERENCES public.persons(id),
  CONSTRAINT communication_recipients_contact_id_fkey FOREIGN KEY (contact_id) REFERENCES public.contacts(id)
);
CREATE TABLE public.notification_preferences (
  person_id uuid NOT NULL,
  email_enabled boolean DEFAULT true,
  sms_enabled boolean DEFAULT true,
  marketing_enabled boolean DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT notification_preferences_pkey PRIMARY KEY (person_id),
  CONSTRAINT notification_preferences_person_id_fkey FOREIGN KEY (person_id) REFERENCES public.persons(id)
);
CREATE TABLE public.document_types (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name character varying NOT NULL,
  description text,
  expiry_required boolean DEFAULT false,
  CONSTRAINT document_types_pkey PRIMARY KEY (id)
);
CREATE TABLE public.documents (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  person_id uuid NOT NULL,
  document_type_id uuid,
  storage_path text,
  uploaded_by uuid,
  verified boolean DEFAULT false,
  expiry_date date,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT documents_pkey PRIMARY KEY (id),
  CONSTRAINT documents_person_id_fkey FOREIGN KEY (person_id) REFERENCES public.persons(id),
  CONSTRAINT documents_document_type_id_fkey FOREIGN KEY (document_type_id) REFERENCES public.document_types(id),
  CONSTRAINT documents_uploaded_by_fkey FOREIGN KEY (uploaded_by) REFERENCES public.persons(id)
);
CREATE TABLE public.consent_records (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  person_id uuid NOT NULL,
  consent_type character varying NOT NULL,
  granted boolean NOT NULL,
  granted_by uuid,
  granted_at timestamp with time zone,
  withdrawn_at timestamp with time zone,
  version character varying,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT consent_records_pkey PRIMARY KEY (id),
  CONSTRAINT consent_records_person_id_fkey FOREIGN KEY (person_id) REFERENCES public.persons(id),
  CONSTRAINT consent_records_granted_by_fkey FOREIGN KEY (granted_by) REFERENCES public.persons(id)
);
CREATE TABLE public.identity_verification_events (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  person_id uuid,
  verification_type character varying,
  performed_by uuid,
  outcome character varying,
  notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT identity_verification_events_pkey PRIMARY KEY (id),
  CONSTRAINT identity_verification_events_person_id_fkey FOREIGN KEY (person_id) REFERENCES public.persons(id),
  CONSTRAINT identity_verification_events_performed_by_fkey FOREIGN KEY (performed_by) REFERENCES public.persons(id)
);
CREATE TABLE public.audit_log (
  id bigint NOT NULL DEFAULT nextval('audit_log_id_seq'::regclass),
  table_name character varying NOT NULL,
  record_id uuid,
  action character varying NOT NULL,
  changed_by uuid,
  old_values jsonb,
  new_values jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT audit_log_pkey PRIMARY KEY (id),
  CONSTRAINT audit_log_changed_by_fkey FOREIGN KEY (changed_by) REFERENCES public.persons(id)
);
CREATE TABLE public.legacy_import_batches (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  source_system character varying NOT NULL,
  imported_at timestamp with time zone NOT NULL DEFAULT now(),
  imported_by uuid,
  notes text,
  CONSTRAINT legacy_import_batches_pkey PRIMARY KEY (id),
  CONSTRAINT legacy_import_batches_imported_by_fkey FOREIGN KEY (imported_by) REFERENCES public.persons(id)
);
CREATE TABLE public.legacy_person_records (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  import_batch_id uuid,
  source_system character varying,
  source_record_id character varying,
  raw_data jsonb,
  match_status character varying DEFAULT 'Unreviewed'::character varying,
  matched_person_id uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT legacy_person_records_pkey PRIMARY KEY (id),
  CONSTRAINT legacy_person_records_import_batch_id_fkey FOREIGN KEY (import_batch_id) REFERENCES public.legacy_import_batches(id),
  CONSTRAINT legacy_person_records_matched_person_id_fkey FOREIGN KEY (matched_person_id) REFERENCES public.persons(id)
);
CREATE TABLE public.legacy_relationship_records (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  import_batch_id uuid,
  source_system character varying,
  raw_data jsonb,
  match_status character varying DEFAULT 'Unreviewed'::character varying,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT legacy_relationship_records_pkey PRIMARY KEY (id),
  CONSTRAINT legacy_relationship_records_import_batch_id_fkey FOREIGN KEY (import_batch_id) REFERENCES public.legacy_import_batches(id)
);
CREATE TABLE public.legacy_identity_matches (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  legacy_record_id uuid NOT NULL,
  person_id uuid,
  confidence character varying,
  confirmed_by uuid,
  confirmed_at timestamp with time zone,
  notes text,
  CONSTRAINT legacy_identity_matches_pkey PRIMARY KEY (id),
  CONSTRAINT legacy_identity_matches_legacy_record_id_fkey FOREIGN KEY (legacy_record_id) REFERENCES public.legacy_person_records(id),
  CONSTRAINT legacy_identity_matches_person_id_fkey FOREIGN KEY (person_id) REFERENCES public.persons(id),
  CONSTRAINT legacy_identity_matches_confirmed_by_fkey FOREIGN KEY (confirmed_by) REFERENCES public.persons(id)
);