Add "title" to persons table for Title/Salutations

--------------

alter table public.persons add column auth_user_id uuid unique references auth.users(id);

Nullable, most children won't have one, this links a persons.id to Supabase's auth.users.id. RLS policies and Edge Functions need to map a signed-in JWT back to "which person is this, and what can they see."

--------------

Check auth.users for email registration workflow  

OR

add table for registration events:

```
Parent fills registration form  
    ↓  
    registration_requests  <- (here!)
        ↓  
        Email sent  
            ↓  
            Parent clicks verification link  
                ↓  
                verified_at populated  
                    ↓  
                    Create real person record  
                        ↓  
                        Create player profile  
                            ↓  
                            Create parent-child relationship  
```

```
CREATE TABLE registration_requests (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

    email text NOT NULL,
    first_name text,
    last_name text,

    verification_token text NOT NULL,
    verification_sent_at timestamptz,
    verified_at timestamptz,

    status text NOT NULL DEFAULT 'Pending',

    created_at timestamptz DEFAULT now()
);
```
