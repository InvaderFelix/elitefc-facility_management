```
Platform
    ├── Identity & People
    ├── Player Management
    │
    ├── Academy Structure
    ├── Events & Activities
    ├── Competitions
    │
    ├── Facilities
    ├── Fitness & Gym
    ├── Membership
    │
    ├── Finance
    ├── Communications
    ├── Document Management
    └── Governance & Compliance
```

# Identity & People

The foundation layer representing humans interacting with the academy. The central design principle is that a person can have one or many roles such as player, coach, parent, administrator. They are the core entity, and are extended using a simple model:
```
persons                 e.g. John Smith
    ├── roles                   ├── Player
    ├── contacts                ├── Parent
    ├── addresses               ├── Emergency Contact
    └── identifiers             └── Team Manager
```
| Table | Purpose |
| --- | --- |
| persons | Master record for every human |
| person_roles | Defines roles (Player, Coach, Parent, Team Manager etc.) |
| addresses | Physical addresses |
| person_addresses | Historical relationship between people and addresses |
| contacts | Email, phone and other contact methods |
| person_contacts | Links contact methods to people |
| person_identifiers | External identifiers (passport, membership number etc.) |
| parent_child_relationship | Family relationships and authority permissions |
| emergency_contacts | Emergency contact information |

# Player Management

Everything specific to a person participating as a football player, and entirely dependent on the Identity & People tables.
```
Person created
        ↓
    Player profile created
            ↓
        Registered for season
                ↓
            Assigned to team
                    ↓
                Training & match history accumulated
```    
| Table | Purpose |
| --- | --- |
| player_profiles | Football specifics and physical attributes |
| player_registrations | Season participation |
| player_medical | Medical history |
| player_injuries | Injury recording and tracking |
| player_assessments | Coaching evaluations |
| player_awards | Achievements |
| player_photos | Player photos |
| player_attendance | Attendance history |
| player_documents | Player-specific documents |
| player_consents | Legacy consent model |

# Academy Structure

Represents the organisational hierarchy of the academy; seasons containing teams, which have team members, coaches, and team managers. This is the operational end of squad management.
```
Season (2026)                              Players
    |                                      Coaches
    └── Teams                       ┌────  Managers
            └── U10 Boys    ── Members     
                U12 Girls   ── Members ──  ...
                U14 Academy ── Members  
                                    └────  Players
                                           Coaches
                                           Managers
```
| Table | Purpose |
| --- | --- |
| seasons | Football seasons |
| teams | Teams operating within seasons |
| team_members | Player-team relationships |
| team_coaches | Coach assignments |
| team_managers | Administrative team roles |

# Events & Activities

Anything scheduled in timeslots across facilities, this feeds the academy calendar engine.

```
Event
    ├─ Training Session
    ├─ Match
    ├─ Trial Day
    ├─ Holiday Clinics
    └─ etc.
```
| Table | Purpose |
| --- | --- |
| events | Generic calendar item |
| bookings | People attending events |
| training_sessions | Training-specific details |
| matches | Match-specific details |
| match_players | Player participation |
| match_events | Match timeline events |

# Competitions

External competitive activities, such as interstate tournaments.

(Future possibilities may include `league_competitions`, `fixtures`, `ladder_positions`, `results`)
```
Tournament
    └─ Summer Cup
        └─ Teams
            ├─ U12 Academy
            └─ U13 Development Team
```
| Table | Purpose |
| --- | --- |
| tournaments | Tournament definitions |
| tournament_teams | Teams participating |

# Facilities

Physical assets and scheduling of assets. This enables resource conflict checking.
```
Facility
    └─ Academy Complex
        ├─ Pitch 1
        ├─ Pitch 2
        ├─ Gym
        └─ Meeting Room
```
| Table | Purpose |
| --- | --- |
| facilities | Venues |
| pitches | Bookable playing areas |
| facility_bookings | Venue reservations |
| pitch_bookings | Pitch-level reservations |

# Fitness & Gym

Specific to non-sport training, such as strength, conditioning, and physical development.
```
Program
    └─ "Speed Development"
        └─ Player
            └─ Sessions
                └─ Equipment Used
```
| Table | Purpose |
| --- | --- |
| gym_equipment | Equipment inventory |
| gym_programs | Training programs |
| gym_sessions | Individual sessions |
| gym_session_equipment | Equipment usage |

# Membership

Defines who belongs to the academy and under what commercial arrangement.
```
Membership Type
    └─ Elite Academy ($250/month)
        └─ Membership
            |
            └─ Tom Smith
                └─ Jan-Dec 2026
```
| Table | Purpose |
| --- | --- |
| membership_types | Available packages |
| memberships | Person memberships |

# Finance
```
Invoice
    ↓
    Payment
        ↓
        Refund (optional)
```
| Table | Purpose |
| --- | --- |
| invoices | Amounts owed |
| payments | Money received |
| refunds | Money returned |
| discounts | Adjustments |

# Communications

Facility messaging and templates
```
Communication
    ↓
    "Training cancelled"
        ↓                               ┌─ SMS delivered
        Recipients                      ├─ Email opened
            |                           |
            └─ Parents of U12 team ── Delivery
```
| Table | Purpose |
| --- | --- |
| communications | Messages sent |
| communication_recipients | Delivery tracking |
| notification_preferences | User choices |

# Document Management

Storage and storage of verification of documents, e.g. Birth Certificate, Working With Children Check (WWCC), Medical Form, Insurance Documents, etc.

| Table | Purpose |
| --- | --- |
| document_types | Document categories |
| documents | Uploaded documents |

# Governance & Compliance

Protect data integrity and demonstrates accountability.

| Table | Purpose |
| --- | --- |
| consent_records | Historical consent decisions (e.g. Photo Consent, date consented, date withdrawn) |
| identity_verification_events | Verification history (e.g. Passport checked, manual review completed, etc.) |
| audit_log | Tracks database changes (e.g. Player medical record change: 'Asthma = No' to 'Asthma = Yes') |
| legacy_import_batches | Import tracking |
| legacy_person_records | Imported people |
| legacy_relationship_records | Imported relationships |
| legacy_identity_matches | Record matching |

# Appendix
An approximated model of the dependency flow looks like:
```
                ┌─── Governance
Identity & People
    ├─────────────── Membership
Player Management                                   ── Finance
        |                                           ── Communications
    Academy Structure                               ── Documents
            |                                       (supporting services
        Events & Activities                          across all domains)         
                ├─────────────── Facilities
            Competitions
                    |
                Fitness & Gym
```