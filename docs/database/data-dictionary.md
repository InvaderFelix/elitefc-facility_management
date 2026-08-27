# Schema Inventory

```
Identity & People
1  persons
2  addresses
3  person_addresses
4  contacts
5  person_contacts
6  person_roles
7  person_identifiers
8  parent_child_relationship
9  emergency_contacts

Player Management
10 player_profiles
11 player_registrations
12 player_medical
13 player_consents
14 player_documents
15 player_injuries
16 player_assessments
17 player_awards
18 player_photos
19 player_attendance

Academy Structure
20 seasons
21 teams
22 team_members
23 team_coaches
24 team_managers

Events & Activities
25 events
26 bookings
27 training_sessions
28 matches
29 match_players
30 match_events

Competitions
31 tournaments
32 tournament_teams

Facilities
33 facilities
34 pitches
35 facility_bookings
36 pitch_bookings

Gym
37 gym_equipment
38 gym_programs
39 gym_sessions
40 gym_session_equipment

Memberships
41 membership_types
42 memberships

Finance
43 invoices
```

# person_

### persons  
 This table is the identity anchor within this database. This design choice is to avoid `players, parents, coaches`, etc. duplicating `names, date_of_birth, addresses`, etc.

### person_addresses  
 Table is historically aware (`start_date, end_date`, etc.) and allows for "What was the primary address when this registration was submitted?"

### person_contacts  
 Assumes that a family shares a contact email, one or more parents have multiple phone numbers, and that those numbers can change. Communication preferences also may differ by contact method.

### parent_child_relationship  
 Do not replace this with a simple `parent_id` column on the child table. It represents a permission model that includes "Who can collect child?" and "Who can approve medical decisions?" etc.  
 (Note that `parent_id ≠ child_id` since a person cannot be their own parent.)

### Assumptions about `persons` and `roles`:
```
persons (can be one or more)
   ├── player
   ├── coach
   ├── manager
   └── parent
```

# player_

### player_medical, player_consents, player_documents  
 These tables contain potentially sensitive information. Medical information must only be accessible to authorised users. Keep in mind that this security level should map onto Row Level Security (RLS) policies upon audit.

### player_registrations
 This key table creates the distinction between `Person exists → Person participates in academy → Person registered for season 2026` and allows a player to: leave and return, track historical seasons, and receive reports by season.  
 - **Note:** See `team_members` entry for relationship between tables.

### player_profiles  
 This includes `PRIMARY KEY (person_id)` meaning one person can have only one player profile. Keep in mind that this database does **not** enforce "only `people` with a `player` role can have a player profile" which is worth documenting.

### player_assessments
 Allows progression analysis including technical improvement over time, tactical development, physical trends, and coach evaluations.

### player_photos, player_documents
 Files are stored externally. Database tables contain metadata and storage paths only.  
```
Supabase Storage  
└── Buckets  
    ├── player-photos  
    └── player-documents  
```

### team_members
 Table includes `joined_date` and `left_date` to record team membership history. This is never to be replaced with `players.team_id` as that will destroy historical data. Players can routinely belong to multiple teams (e.g. U11s and U12s) within the same season.  
 - **Note:** This table alongside `player_registrations` does not answer business logic questions such as "Can a player be a team member without being registered for that season?" because of the unusual nature of soccer academy player sharing, and age dispensations. Developers should enforce this logic elsewhere.

### events:  
 This event abstraction is designed around having a unified calendar. Future event types can be added without redesigning everything:
 ```
 events
    ├── training_sessions
    ├── matches
    ├── trials
    ├── presentations
    ├── camps
    ├── meetings
    └── etc.
 ```

### matches, match_players
 This separates match statistics, which supports different squad sizes, starters and substitutes, granular player statistics, and historical records.

### match_events  
 Acts as a match timeline, where the design is flexible since `event_type` is not hard-coded. May include values such as 'Goal', 'Own Goal', 'Assists', 'Yellow Card', 'Red Card', 'Penalty', 'VAR Decision', and more depending on requirements.

# tournament_

### tournaments  
 Tournament design is many-to-many, since the shape of the data involves scenarios such as:
```
Summer Cup              with        U11s Tigers
    ├── U12s Tigers                     ├── Winter Cup
    ├── U11s Tigers                     ├── Summer Cup
    └── U11s Lions                      └── World Cup
```

# facilities_ and gym_
```
facility
    ├── pitches
    │      └── pitch_bookings
    ├── facility_bookings
    │
    ├── gym_equipment
    │       └── gym_session_equipment
    └── gym_programs
            ├── gym_sessions
            │
            ├── player
            ├── coach
            ├── event
            │
            └── equipment

```
### documents  
 Distinct from `player_documents` which is intended to carry player-specific documents. This is an important distinction and is intended as a generic table.

### invoices  
 Invoice numbers are optional, since they allocated only when an invoice is formally issued. Otherwise these records may carry NULL values for `invoice_number` until such time.

### consent_records
 Records the history of consent throughout a player's membership period, required for legal or regulatory compliance. (i.e. 2023 'Granted', 2024 'Withdrawn', 2025 'Granted', etc.)

# Developer note for possible indexes:  
`player_registrations(person_id, season)`  
`player_injuries(person_id, status)`  
`player_documents(person_id, expiry_date)`  
As common queries may include: "show this player's registration history", "show active injuries", "find documents expiring soon".