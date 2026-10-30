# Registration Flow

Registration is the vertical slice from the public registration form to PostgreSQL:

```
Register.tsx (form)
    ↓  POST JSON
Edge Function: register-account
    ↓  validateRegistration() (zod)
    ↓  auth.admin.createUser()
Supabase Auth (auth.users)
    ↓  register_account(jsonb) RPC
PostgreSQL transaction
    ├── persons, person_roles
    ├── contacts, person_contacts
    ├── addresses, person_addresses
    └── per child:
        ├── persons, person_roles
        ├── parent_child_relationship
        ├── player_profiles
        └── player_registrations
```

The Edge Function creates the Supabase Auth user and calls a Postgres function so that
all domain inserts succeed or fail together. If the RPC fails, the Edge Function
deletes the newly created auth user as a compensating action.

## Contract types

The frontend payload is built inline in `app/src/pages/Register.tsx`; there is no
shared TypeScript type for it yet.

```ts
// Sent by the browser
type RegisterRequest = {
  firstName: string;
  lastName: string;
  parentEmail: string;
  parentPhone: string;       // formatted, e.g. "0412 345 678"
  password: string;
  unitNumber: string;        // "" when empty
  houseNumber: string;
  streetName: string;
  suburb: string;
  postcode: string;
  children: RegisterChild[];
  terms: boolean;
};

type RegisterChild = {
  firstName: string;
  lastName: string;
  dateOfBirth: string;       // "yyyy-mm-dd"
};
```

```ts
// Normalised by supabase/functions/shared/validation.ts
type ValidatedRegistration = {
  parent: { firstName: string; lastName: string };
  email: string;             // trimmed and lowercased
  phone: string;             // whitespace removed
  password: string;
  address: {
    unitNumber: string;      // "" when absent
    houseNumber: string;
    streetName: string;
    suburb: string;
    postcode: string;
  };
  children: {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
  }[];
};
```

ValidatedChild in the tables below refers to one element of
ValidatedRegistration.children. It is a descriptive name, not an exported type.

```ts
// Edge Function → Postgres RPC
type RegisterAccountArgs = {
  p_payload: {
    authUserId: string;      // from auth.admin.createUser
    parent: { firstName: string; lastName: string };
    email: string;
    phone: string;
    address: ValidatedRegistration["address"];
    children: ValidatedRegistration["children"];
  };
};

type RegisterAccountResult = {
  parentId: string;          // uuid
  childIds: string[];        // uuid[], same order as children[]
};
```

```ts
// Success response
type RegisterSuccess = {
  success: true;
  data: {
    parentId: string;
    childIds: string[];
    message: string;         // "Registration submitted successfully"
  };
};

// Error response (400 validation, 409 duplicate, 500 internal)
type RegisterError = {
  success: false;
  error: {
    message: string;
    code?: "VALIDATION_ERROR" | "DUPLICATE_EMAIL";
  };
};
```

## Stage 1: Webpage → Edge Function

| Webpage field (JSON) | Frontend type | Edge validation rule | Normalised value / type |
| --- | --- | --- | --- |
| firstName | string | trim, non-empty | parent.firstName: string |
| lastName | string | trim, non-empty | parent.lastName: string |
| parentEmail | string | trim, lowercase, valid email | email: string |
| parentPhone | string ("0412 345 678") | trim, strip spaces, `/^04\d{8}$/` | phone: string ("0412345678") |
| password | string | minimum 8 characters | password: string |
| unitNumber | string ("" if blank) | trim, optional | address.unitNumber: string |
| houseNumber | string | trim, non-empty | address.houseNumber: string |
| streetName | string | trim, non-empty | address.streetName: string |
| suburb | string | trim, non-empty | address.suburb: string |
| postcode | string | trim, `/^\d{4}$/` | address.postcode: string |
| children | RegisterChild[] | array, minimum 1 | children: ValidatedChild[] |
| children[].firstName | string | trim, non-empty | ValidatedChild.firstName: string |
| children[].lastName | string | trim, non-empty | ValidatedChild.lastName: string |
| children[].dateOfBirth | string ("yyyy-mm-dd") | format and valid date | ValidatedChild.dateOfBirth: string |
| terms | boolean | must be true | consumed by validation, omitted from output |

unitNumber is always a string on the wire; an empty string is normalised to ""
and later stored as NULL.

authUserId is not sent by the browser. It is created by the Edge Function and added
to the RPC payload.

## Stage 2: Edge Function → Supabase

### Supabase Auth (auth.admin.createUser)

| Edge value | Table.column | DB type | Stored as |
| --- | --- | --- | --- |
| `data.email` | auth.users.email | character varying | Lowercased email (unique) |
| `data.password` | auth.users.encrypted_password | character varying | Hashed by GoTrue (bcrypt); plaintext is never stored |
| `email_confirm: true` | auth.users.email_confirmed_at | timestamp with time zone | Current timestamp |
| `data.parent.firstName`, `data.parent.lastName` | auth.users.raw_user_meta_data | jsonb | `{ "first_name": "..." }`, `{ "last_name": "..." }` |
| `authUser.user.id` | auth.users.id | uuid | Generated auth user ID |

### Parent and address

| Edge value | Table.column | DB type | Stored as |
| --- | --- | --- | --- |
| `authUserId` | persons.auth_user_id | uuid | Link to auth.users.id |
| `data.parent.firstName` | persons.first_name | character varying | Trimmed value |
| `data.parent.lastName` | persons.last_name | character varying | Trimmed value |
| "Pending" | persons.identity_status | character varying | Pending |
| generated / defaults | persons.id, elite_id, is_active, created_at, updated_at | uuid, text, boolean, timestamp with time zone, timestamp with time zone | Database defaults |
| `parentId` | person_roles.person_id | uuid | New parent ID |
| "Parent" | person_roles.role | character varying | Parent |
| "Email", "Phone" | contacts.contact_type | character varying | Email, Phone |
| `data.email`, `data.phone` | contacts.contact_value | character varying | Lowercased email, Digits only |
| generated | contacts.id | bigint | Sequence (once per contact) |
| `parentId` | person_contacts.person_id | uuid | Parent ID |
| `emailContact.id`, `phoneContact.id` | person_contacts.contact_id | bigint | Email contact ID, Phone contact ID |
| true (email), false (phone) | person_contacts.is_primary | boolean | true (email), false (phone) |
| "Personal" | person_contacts.contact_role | character varying | Personal |
| `houseNumber + " " + streetName` | addresses.address_line_1 | character varying | e.g. "12 Smith Street" |
| `unitNumber` or null | addresses.address_line_2 | character varying | NULL when empty |
| `data.address.suburb` | addresses.suburb | character varying | Trimmed value |
| `data.address.postcode` | addresses.postcode | character varying | Four-digit string |
| "Australia" | addresses.country | character varying | Australia |
| not set | addresses.state | character varying | NULL |
| generated | addresses.id | bigint | Sequence |
| `parentId` | person_addresses.person_id | uuid | Parent ID |
| `address.id` | person_addresses.address_id | bigint | Address ID |
| "Home" | person_addresses.address_type | character varying | Home |
| true | person_addresses.is_primary | boolean | true |

### Each child (repeated for every children[] entry)

| Edge value | Table.column | DB type | Stored as |
| --- | --- | --- | --- |
| `child.firstName` | persons.first_name | character varying | Trimmed value |
| `child.lastName` | persons.last_name | character varying | Trimmed value |
| `child.dateOfBirth` | persons.date_of_birth | date | Cast from "yyyy-mm-dd" |
| "Pending" | persons.identity_status | character varying | Pending |
| generated | persons.id | uuid | New child ID |
| `childId` | person_roles.person_id | uuid | Child ID |
| "Player" | person_roles.role | character varying | Player |
| `parentId` | parent_child_relationship.parent_id | uuid | Parent ID |
| `childId` | parent_child_relationship.child_id | uuid | Child ID |
| "Parent" | parent_child_relationship.relationship_type | character varying | Parent |
| true (four values) | parent_child_relationship.is_primary_guardian, pickup_authority, medical_authority, financial_responsibility | boolean | true |
| generated | parent_child_relationship.id | uuid | New relationship ID |
| `childId` | player_profiles.person_id | uuid | Child ID |
| `childId` | player_registrations.person_id | uuid | Child ID |
| `seasonName` | player_registrations.season | character varying | Current season name, fallback "2026" |
| "Pending" | player_registrations.registration_status | character varying | Pending |
| "Unpaid" | player_registrations.fee_status | character varying | Unpaid |
| default | player_registrations.registration_date | date | CURRENT_DATE |
| not set | player_registrations.registered_by | uuid | NULL |

### Read-only and unused columns

| Edge value | Table.column | DB type | Notes |
| --- | --- | --- | --- |
| `SELECT name WHERE is_current = true` | seasons.name | character varying | Read only; no season is created |
| not set | persons.age_group | text | Column exists from migration 0002; unused |
| not set | persons.program | text | Column exists from migration 0002; unused |
| `childIds` | not stored | uuid[] internally, serialised as a JSON string array | Returned to the Edge Function and then the client |

## Derived values

Age group and program eligibility are deliberately **not** part of the registration
contract. They must be derived from each child's dateOfBirth wherever the portal
needs them (for example, a shared portal helper using the current or upcoming season
date). Registration stores only the date of birth.

## Failure behaviour

1. validateRegistration rejects malformed payloads before any write with 400 VALIDATION_ERROR.
2. A duplicate email returns 409 DUPLICATE_EMAIL from the contacts check or from
   auth.admin.createUser.
3. The auth user is created before the RPC. If the RPC fails, the Edge Function calls
   auth.admin.deleteUser so an account cannot exist without its person record.
4. The RPC runs in a single Postgres transaction: any failed insert rolls back the
   parent, address, contacts, and every child. Only the auth user sits outside that
   transaction.

## Code references

| Concern | File |
| --- | --- |
| Form and request payload | `app/src/pages/Register.tsx` |
| Edge Function and auth user creation | `supabase/functions/register-account/index.ts` |
| Request validation and normalisation | `supabase/functions/shared/validation.ts` |
| Transactional database provisioning | `supabase/migrations/0003_register_account.sql` |
| Auth/user columns | `supabase/migrations/0002_add_person_fields.sql` |
| Base table schema | `docs/database/001_initial_schema.sql` |
