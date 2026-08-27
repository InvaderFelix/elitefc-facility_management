// EliteFC Schema
// Part 1 - Core Identity & People Management

Project EliteFC {
  database_type: "PostgreSQL"
  Note: "EliteFC football club management schema"
}


// =====================
// PERSONS
// =====================

Table persons {
  id uuid [pk, default: `gen_random_uuid()`]
  first_name varchar [not null]
  middle_name varchar
  last_name varchar [not null]
  preferred_name varchar
  date_of_birth date
  gender varchar
  identity_status varchar [not null, default: 'Pending']
  is_active boolean [not null, default: true]
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]
  elite_id text [not null, unique, default: "('P' || lpad(nextval('elite_id_seq')::text, 6, '0'))"]
}


// =====================
// ADDRESSES
// =====================

Table addresses {
  id bigint [pk, increment]
  address_line_1 varchar [not null]
  address_line_2 varchar
  suburb varchar
  state varchar
  postcode varchar
  country varchar [not null, default: 'Australia']
  latitude numeric
  longitude numeric
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]
}


Table person_addresses {
  person_id uuid [not null]
  address_id bigint [not null]
  address_type varchar [not null, default: 'Home']
  is_primary boolean [not null, default: true]
  start_date date
  end_date date
  created_at timestamptz [not null, default: `now()`]

  indexes {
    (person_id, address_id) [pk]
  }
}


// =====================
// CONTACTS
// =====================

Table contacts {
  id bigint [pk, increment]
  contact_type varchar [not null]
  contact_value varchar [not null]
  is_verified boolean [not null, default: false]
  verified_at timestamptz
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]
}


Table person_contacts {
  person_id uuid [not null]
  contact_id bigint [not null]
  contact_role varchar [default: 'Personal']
  is_primary boolean [not null, default: false]
  receives_email boolean [not null, default: true]
  receives_sms boolean [not null, default: true]
  receives_notifications boolean [not null, default: true]
  start_date date
  end_date date
  created_at timestamptz [not null, default: `now()`]

  indexes {
    (person_id, contact_id) [pk]
  }
}


// =====================
// PERSON ROLES
// =====================

Table person_roles {
  id uuid [pk, default: `gen_random_uuid()`]
  person_id uuid [not null]
  role varchar [not null]
  created_at timestamptz [not null, default: `now()`]
}


// =====================
// PERSON IDENTIFIERS
// =====================

Table person_identifiers {
  id uuid [pk, default: `gen_random_uuid()`]
  person_id uuid [not null]
  identifier_type varchar [not null]
  identifier_value varchar [not null]
  issuing_organisation varchar
  verified boolean [not null, default: false]
  created_at timestamptz [not null, default: `now()`]
}


// =====================
// FAMILY RELATIONSHIPS
// =====================

Table parent_child_relationship {
  id uuid [pk, default: `gen_random_uuid()`]
  parent_id uuid [not null]
  child_id uuid [not null]
  relationship_type varchar [not null]

  is_primary_guardian boolean [not null, default: false]
  pickup_authority boolean [not null, default: false]
  medical_authority boolean [not null, default: false]
  financial_responsibility boolean [not null, default: false]

  receives_reports boolean [not null, default: true]
  receives_invoices boolean [not null, default: true]

  created_at timestamptz [not null, default: `now()`]

  Note: "Constraint: parent_id <> child_id"
}


// =====================
// EMERGENCY CONTACTS
// =====================

Table emergency_contacts {
  id uuid [pk, default: `gen_random_uuid()`]

  person_id uuid [not null]
  contact_person_id uuid

  contact_name varchar
  relationship varchar
  phone varchar
  email varchar

  priority int [not null, default: 1]
  notes text

  created_at timestamptz [not null, default: `now()`]
}


// =====================
// RELATIONSHIPS
// =====================

Ref: person_addresses.person_id > persons.id
Ref: person_addresses.address_id > addresses.id

Ref: person_contacts.person_id > persons.id
Ref: person_contacts.contact_id > contacts.id

Ref: person_roles.person_id > persons.id

Ref: person_identifiers.person_id > persons.id

Ref: parent_child_relationship.parent_id > persons.id
Ref: parent_child_relationship.child_id > persons.id

Ref: emergency_contacts.person_id > persons.id
Ref: emergency_contacts.contact_person_id > persons.id

// =====================
// PLAYER PROFILES
// =====================

Table player_profiles {
  person_id uuid [pk]

  preferred_position varchar
  secondary_position varchar
  dominant_foot varchar
  previous_club varchar

  playing_since date
  height_cm int
  weight_kg numeric

  notes text

  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]
}


// =====================
// PLAYER REGISTRATIONS
// =====================

Table player_registrations {
  id uuid [pk, default: `gen_random_uuid()`]

  person_id uuid [not null]
  season varchar [not null]

  registration_date date [not null, default: `CURRENT_DATE`]
  registration_status varchar [not null, default: 'Pending']
  fee_status varchar [default: 'Unpaid']

  registered_by uuid
  notes text

  created_at timestamptz [not null, default: `now()`]
}


// =====================
// PLAYER MEDICAL
// =====================

Table player_medical {
  id uuid [pk, default: `gen_random_uuid()`]

  person_id uuid [not null]

  condition varchar
  allergy varchar
  medication varchar

  requires_epipen boolean [default: false]

  medical_notes text

  effective_from date
  effective_to date

  created_at timestamptz [not null, default: `now()`]
}


// =====================
// PLAYER CONSENTS
// =====================

Table player_consents {
  id uuid [pk, default: `gen_random_uuid()`]

  person_id uuid [not null]

  consent_type varchar [not null]

  granted boolean [not null, default: false]

  granted_by uuid
  granted_at timestamptz
  expires_at timestamptz

  notes text

  created_at timestamptz [not null, default: `now()`]
}


// =====================
// PLAYER DOCUMENTS
// =====================

Table player_documents {
  id uuid [pk, default: `gen_random_uuid()`]

  person_id uuid [not null]

  document_type varchar [not null]
  document_name varchar

  storage_path text

  expiry_date date

  verified boolean [not null, default: false]

  verified_by uuid
  verified_at timestamptz

  created_at timestamptz [not null, default: `now()`]
}


// =====================
// PLAYER INJURIES
// =====================

Table player_injuries {
  id uuid [pk, default: `gen_random_uuid()`]

  person_id uuid [not null]

  injury_type varchar [not null]

  description text

  occurred_date date
  expected_return_date date
  actual_return_date date

  status varchar [default: 'Active']

  notes text

  created_at timestamptz [not null, default: `now()`]
}


// =====================
// PLAYER ASSESSMENTS
// =====================

Table player_assessments {
  id uuid [pk, default: `gen_random_uuid()`]

  person_id uuid [not null]
  assessor_id uuid [not null]

  assessment_date date [not null, default: `CURRENT_DATE`]

  technical_score int
  tactical_score int
  physical_score int
  mental_score int

  comments text

  created_at timestamptz [not null, default: `now()`]
}


// =====================
// PLAYER AWARDS
// =====================

Table player_awards {
  id uuid [pk, default: `gen_random_uuid()`]

  person_id uuid [not null]

  award_name varchar [not null]

  season varchar
  awarded_date date

  notes text

  created_at timestamptz [not null, default: `now()`]
}


// =====================
// PLAYER PHOTOS
// =====================

Table player_photos {
  id uuid [pk, default: `gen_random_uuid()`]

  person_id uuid [not null]

  storage_path text [not null]

  is_profile_photo boolean [default: false]

  taken_date date

  created_at timestamptz [not null, default: `now()`]
}


// =====================
// PLAYER ATTENDANCE
// =====================

Table player_attendance {
  id uuid [pk, default: `gen_random_uuid()`]

  person_id uuid [not null]

  session_type varchar [not null]

  session_date date [not null]

  status varchar [not null]

  arrival_time timestamptz
  departure_time timestamptz

  reason text

  created_at timestamptz [not null, default: `now()`]
}


// =====================
// RELATIONSHIPS
// =====================

Ref: player_profiles.person_id > persons.id

Ref: player_registrations.person_id > persons.id
Ref: player_registrations.registered_by > persons.id

Ref: player_medical.person_id > persons.id

Ref: player_consents.person_id > persons.id
Ref: player_consents.granted_by > persons.id

Ref: player_documents.person_id > persons.id
Ref: player_documents.verified_by > persons.id

Ref: player_injuries.person_id > persons.id

Ref: player_assessments.person_id > persons.id
Ref: player_assessments.assessor_id > persons.id

Ref: player_awards.person_id > persons.id

Ref: player_photos.person_id > persons.id

Ref: player_attendance.person_id > persons.id

// =====================
// SEASONS
// =====================

Table seasons {
  id uuid [pk, default: `gen_random_uuid()`]

  name varchar [not null]

  start_date date [not null]
  end_date date [not null]

  is_current boolean [default: false]

  created_at timestamptz [not null, default: `now()`]
}


// =====================
// TEAMS
// =====================

Table teams {
  id uuid [pk, default: `gen_random_uuid()`]

  season_id uuid [not null]

  name varchar [not null]

  age_group varchar
  gender varchar
  competition varchar

  team_type varchar [default: 'Competitive']

  is_active boolean [default: true]

  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]
}


// =====================
// TEAM MEMBERS
// =====================

Table team_members {
  id uuid [pk, default: `gen_random_uuid()`]

  team_id uuid [not null]
  person_id uuid [not null]

  joined_date date
  left_date date

  jersey_number int

  position varchar

  membership_status varchar [default: 'Active']

  created_at timestamptz [not null, default: `now()`]
}


// =====================
// TEAM COACHES
// =====================

Table team_coaches {
  id uuid [pk, default: `gen_random_uuid()`]

  team_id uuid [not null]
  person_id uuid [not null]

  role varchar [default: 'Head Coach']

  start_date date
  end_date date

  created_at timestamptz [not null, default: `now()`]
}


// =====================
// TEAM MANAGERS
// =====================

Table team_managers {
  id uuid [pk, default: `gen_random_uuid()`]

  team_id uuid [not null]
  person_id uuid [not null]

  role varchar [default: 'Team Manager']

  start_date date
  end_date date

  created_at timestamptz [not null, default: `now()`]
}


// =====================
// EVENTS
// =====================

Table events {
  id uuid [pk, default: `gen_random_uuid()`]

  title varchar [not null]

  event_type varchar [not null]

  start_time timestamptz [not null]
  end_time timestamptz

  location varchar

  team_id uuid

  created_by uuid

  description text

  created_at timestamptz [not null, default: `now()`]
}


// =====================
// BOOKINGS
// =====================

Table bookings {
  id uuid [pk, default: `gen_random_uuid()`]

  event_id uuid [not null]

  person_id uuid [not null]

  booking_status varchar [default: 'Booked']

  attendance_status varchar

  checked_in_at timestamptz

  notes text

  created_at timestamptz [not null, default: `now()`]
}


// =====================
// TRAINING SESSIONS
// =====================

Table training_sessions {
  id uuid [pk, default: `gen_random_uuid()`]

  event_id uuid [not null]

  coach_id uuid

  training_theme varchar

  training_plan text

  created_at timestamptz [not null, default: `now()`]
}


// =====================
// MATCHES
// =====================

Table matches {
  id uuid [pk, default: `gen_random_uuid()`]

  event_id uuid [not null]

  opponent varchar

  competition varchar

  home_away varchar

  result varchar

  score_for int

  score_against int

  created_at timestamptz [not null, default: `now()`]
}


// =====================
// MATCH PLAYERS
// =====================

Table match_players {
  id uuid [pk, default: `gen_random_uuid()`]

  match_id uuid [not null]

  person_id uuid [not null]

  starting_position varchar

  was_starter boolean [default: false]

  minutes_played int

  goals int [default: 0]

  assists int [default: 0]

  yellow_cards int [default: 0]

  red_cards int [default: 0]

  created_at timestamptz [not null, default: `now()`]
}


// =====================
// MATCH EVENTS
// =====================

Table match_events {
  id uuid [pk, default: `gen_random_uuid()`]

  match_id uuid [not null]

  person_id uuid

  event_type varchar [not null]

  minute int

  description text

  created_at timestamptz [not null, default: `now()`]
}


// =====================
// TOURNAMENTS
// =====================

Table tournaments {
  id uuid [pk, default: `gen_random_uuid()`]

  name varchar [not null]

  location varchar

  start_date date
  end_date date

  organiser varchar

  created_at timestamptz [not null, default: `now()`]
}


// =====================
// TOURNAMENT TEAMS
// =====================

Table tournament_teams {
  tournament_id uuid [not null]

  team_id uuid [not null]

  indexes {
    (tournament_id, team_id) [pk]
  }
}


// =====================
// RELATIONSHIPS
// =====================

Ref: teams.season_id > seasons.id

Ref: team_members.team_id > teams.id
Ref: team_members.person_id > persons.id

Ref: team_coaches.team_id > teams.id
Ref: team_coaches.person_id > persons.id

Ref: team_managers.team_id > teams.id
Ref: team_managers.person_id > persons.id

Ref: events.team_id > teams.id
Ref: events.created_by > persons.id

Ref: bookings.event_id > events.id
Ref: bookings.person_id > persons.id

Ref: training_sessions.event_id > events.id
Ref: training_sessions.coach_id > persons.id

Ref: matches.event_id > events.id

Ref: match_players.match_id > matches.id
Ref: match_players.person_id > persons.id

Ref: match_events.match_id > matches.id
Ref: match_events.person_id > persons.id

Ref: tournament_teams.tournament_id > tournaments.id
Ref: tournament_teams.team_id > teams.id

// =====================
// FACILITIES
// =====================

Table facilities {
  id uuid [pk, default: `gen_random_uuid()`]

  name varchar [not null]

  facility_type varchar [not null]

  location varchar

  capacity int

  is_active boolean [not null, default: true]

  notes text

  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]
}


// =====================
// PITCHES
// =====================

Table pitches {
  id uuid [pk, default: `gen_random_uuid()`]

  facility_id uuid

  name varchar [not null]

  surface_type varchar

  pitch_size varchar

  lighting_available boolean [default: false]

  is_active boolean [not null, default: true]

  notes text

  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]
}


// =====================
// FACILITY BOOKINGS
// =====================

Table facility_bookings {
  id uuid [pk, default: `gen_random_uuid()`]

  facility_id uuid [not null]

  event_id uuid

  booked_by uuid

  start_time timestamptz [not null]

  end_time timestamptz [not null]

  booking_type varchar [not null]

  status varchar [not null, default: 'Confirmed']

  notes text

  created_at timestamptz [not null, default: `now()`]
}


// =====================
// PITCH BOOKINGS
// =====================

Table pitch_bookings {
  id uuid [pk, default: `gen_random_uuid()`]

  pitch_id uuid [not null]

  event_id uuid

  booked_by uuid

  start_time timestamptz [not null]

  end_time timestamptz [not null]

  booking_type varchar [not null]

  status varchar [not null, default: 'Confirmed']

  notes text

  created_at timestamptz [not null, default: `now()`]
}


// =====================
// GYM EQUIPMENT
// =====================

Table gym_equipment {
  id uuid [pk, default: `gen_random_uuid()`]

  facility_id uuid

  name varchar [not null]

  equipment_type varchar

  manufacturer varchar

  model varchar

  serial_number varchar

  purchase_date date

  condition varchar [default: 'Good']

  service_due date

  is_active boolean [not null, default: true]

  notes text

  created_at timestamptz [not null, default: `now()`]

  updated_at timestamptz [not null, default: `now()`]
}


// =====================
// GYM PROGRAMS
// =====================

Table gym_programs {
  id uuid [pk, default: `gen_random_uuid()`]

  name varchar [not null]

  description text

  created_by uuid

  created_at timestamptz [not null, default: `now()`]
}


// =====================
// GYM SESSIONS
// =====================

Table gym_sessions {
  id uuid [pk, default: `gen_random_uuid()`]

  person_id uuid [not null]

  program_id uuid

  event_id uuid

  coach_id uuid

  start_time timestamptz [not null]

  end_time timestamptz

  notes text

  created_at timestamptz [not null, default: `now()`]
}


// =====================
// GYM SESSION EQUIPMENT
// =====================

Table gym_session_equipment {
  gym_session_id uuid [not null]

  equipment_id uuid [not null]

  usage_notes text

  indexes {
    (gym_session_id, equipment_id) [pk]
  }
}


// =====================
// MEMBERSHIP TYPES
// =====================

Table membership_types {
  id uuid [pk, default: `gen_random_uuid()`]

  name varchar [not null]

  description text

  amount numeric

  duration_months int

  is_active boolean [not null, default: true]

  created_at timestamptz [not null, default: `now()`]
}


// =====================
// MEMBERSHIPS
// =====================

Table memberships {
  id uuid [pk, default: `gen_random_uuid()`]

  person_id uuid [not null]

  membership_type_id uuid

  start_date date [not null]

  end_date date

  status varchar [not null, default: 'Active']

  created_at timestamptz [not null, default: `now()`]
}


// =====================
// INVOICES
// =====================

Table invoices {
  id uuid [pk, default: `gen_random_uuid()`]

  person_id uuid [not null]

  invoice_number varchar [unique]

  description text

  amount numeric [not null]

  due_date date

  status varchar [not null, default: 'Outstanding']

  issued_at timestamptz [not null, default: `now()`]

  created_at timestamptz [not null, default: `now()`]
}


// =====================
// PAYMENTS
// =====================

Table payments {
  id uuid [pk, default: `gen_random_uuid()`]

  invoice_id uuid

  person_id uuid [not null]

  amount numeric [not null]

  payment_method varchar

  payment_reference varchar

  paid_at timestamptz

  status varchar [default: 'Completed']

  created_at timestamptz [not null, default: `now()`]
}


// =====================
// DISCOUNTS
// =====================

Table discounts {
  id uuid [pk, default: `gen_random_uuid()`]

  person_id uuid

  discount_type varchar

  amount numeric

  percentage numeric

  reason text

  valid_from date

  valid_to date

  created_at timestamptz [not null, default: `now()`]
}


// =====================
// REFUNDS
// =====================

Table refunds {
  id uuid [pk, default: `gen_random_uuid()`]

  payment_id uuid [not null]

  amount numeric [not null]

  reason text

  refunded_at timestamptz

  created_at timestamptz [not null, default: `now()`]
}


// =====================
// RELATIONSHIPS
// =====================

Ref: pitches.facility_id > facilities.id

Ref: facility_bookings.facility_id > facilities.id
Ref: facility_bookings.event_id > events.id
Ref: facility_bookings.booked_by > persons.id

Ref: pitch_bookings.pitch_id > pitches.id
Ref: pitch_bookings.event_id > events.id
Ref: pitch_bookings.booked_by > persons.id

Ref: gym_equipment.facility_id > facilities.id

Ref: gym_programs.created_by > persons.id

Ref: gym_sessions.person_id > persons.id
Ref: gym_sessions.program_id > gym_programs.id
Ref: gym_sessions.event_id > events.id
Ref: gym_sessions.coach_id > persons.id

Ref: gym_session_equipment.gym_session_id > gym_sessions.id
Ref: gym_session_equipment.equipment_id > gym_equipment.id

Ref: memberships.person_id > persons.id
Ref: memberships.membership_type_id > membership_types.id

Ref: invoices.person_id > persons.id

Ref: payments.invoice_id > invoices.id
Ref: payments.person_id > persons.id

Ref: discounts.person_id > persons.id

Ref: refunds.payment_id > payments.id

// =====================
// COMMUNICATIONS
// =====================

Table communications {
  id uuid [pk, default: `gen_random_uuid()`]

  sender_id uuid

  communication_type varchar [not null]

  subject varchar

  body text

  sent_at timestamptz

  created_at timestamptz [not null, default: `now()`]
}


Table communication_recipients {
  id uuid [pk, default: `gen_random_uuid()`]

  communication_id uuid [not null]

  person_id uuid [not null]

  contact_id bigint

  delivery_status varchar

  delivered_at timestamptz

  opened_at timestamptz
}


Table notification_preferences {
  person_id uuid [pk]

  email_enabled boolean [default: true]

  sms_enabled boolean [default: true]

  marketing_enabled boolean [default: false]

  created_at timestamptz [not null, default: `now()`]

  updated_at timestamptz [not null, default: `now()`]
}


// =====================
// DOCUMENT MANAGEMENT
// =====================

Table document_types {
  id uuid [pk, default: `gen_random_uuid()`]

  name varchar [not null]

  description text

  expiry_required boolean [default: false]
}


Table documents {
  id uuid [pk, default: `gen_random_uuid()`]

  person_id uuid [not null]

  document_type_id uuid

  storage_path text

  uploaded_by uuid

  verified boolean [default: false]

  expiry_date date

  created_at timestamptz [not null, default: `now()`]
}


// =====================
// CONSENT MANAGEMENT
// =====================

Table consent_records {
  id uuid [pk, default: `gen_random_uuid()`]

  person_id uuid [not null]

  consent_type varchar [not null]

  granted boolean [not null]

  granted_by uuid

  granted_at timestamptz

  withdrawn_at timestamptz

  version varchar

  created_at timestamptz [not null, default: `now()`]
}


// =====================
// IDENTITY VERIFICATION
// =====================

Table identity_verification_events {
  id uuid [pk, default: `gen_random_uuid()`]

  person_id uuid

  verification_type varchar

  performed_by uuid

  outcome varchar

  notes text

  created_at timestamptz [not null, default: `now()`]
}


// =====================
// AUDIT LOGGING
// =====================

Table audit_log {
  id bigint [pk, increment]

  table_name varchar [not null]

  record_id uuid

  action varchar [not null]

  changed_by uuid

  old_values jsonb

  new_values jsonb

  created_at timestamptz [not null, default: `now()`]
}


// =====================
// LEGACY IMPORT BATCHES
// =====================

Table legacy_import_batches {
  id uuid [pk, default: `gen_random_uuid()`]

  source_system varchar [not null]

  imported_at timestamptz [not null, default: `now()`]

  imported_by uuid

  notes text
}


// =====================
// LEGACY PERSON RECORDS
// =====================

Table legacy_person_records {
  id uuid [pk, default: `gen_random_uuid()`]

  import_batch_id uuid

  source_system varchar

  source_record_id varchar

  raw_data jsonb

  match_status varchar [default: 'Unreviewed']

  matched_person_id uuid

  created_at timestamptz [not null, default: `now()`]
}


// =====================
// LEGACY RELATIONSHIP RECORDS
// =====================

Table legacy_relationship_records {
  id uuid [pk, default: `gen_random_uuid()`]

  import_batch_id uuid

  source_system varchar

  raw_data jsonb

  match_status varchar [default: 'Unreviewed']

  created_at timestamptz [not null, default: `now()`]
}


// =====================
// LEGACY IDENTITY MATCHES
// =====================

Table legacy_identity_matches {
  id uuid [pk, default: `gen_random_uuid()`]

  legacy_record_id uuid [not null]

  person_id uuid

  confidence varchar

  confirmed_by uuid

  confirmed_at timestamptz

  notes text
}


// =====================
// RELATIONSHIPS
// =====================

Ref: communications.sender_id > persons.id

Ref: communication_recipients.communication_id > communications.id
Ref: communication_recipients.person_id > persons.id
Ref: communication_recipients.contact_id > contacts.id

Ref: notification_preferences.person_id > persons.id

Ref: documents.person_id > persons.id
Ref: documents.document_type_id > document_types.id
Ref: documents.uploaded_by > persons.id

Ref: consent_records.person_id > persons.id
Ref: consent_records.granted_by > persons.id

Ref: identity_verification_events.person_id > persons.id
Ref: identity_verification_events.performed_by > persons.id

Ref: audit_log.changed_by > persons.id

Ref: legacy_import_batches.imported_by > persons.id

Ref: legacy_person_records.import_batch_id > legacy_import_batches.id
Ref: legacy_person_records.matched_person_id > persons.id

Ref: legacy_relationship_records.import_batch_id > legacy_import_batches.id

Ref: legacy_identity_matches.legacy_record_id > legacy_person_records.id
Ref: legacy_identity_matches.person_id > persons.id
Ref: legacy_identity_matches.confirmed_by > persons.id