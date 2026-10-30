-- One contacts row per distinct email address; person_contacts shares it
-- across parents and children. Case/whitespace-insensitive.
CREATE UNIQUE INDEX IF NOT EXISTS contacts_email_unique
  ON public.contacts (lower(btrim(contact_value)))
  WHERE contact_type = 'Email';
