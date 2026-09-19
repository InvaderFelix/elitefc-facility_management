import { createClient } from "npm:@supabase/supabase-js@2";
import { corsResponse, jsonError, jsonSuccess } from "../shared/responses.ts";
import { conflict, internal, badRequest } from "../shared/errors.ts";
import { validateRegistration } from "../shared/validation.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return corsResponse();

  try {
    if (req.method !== "POST") {
      throw badRequest("Method not allowed");
    }

    const body = await req.json();
    const data = validateRegistration(body);

    const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

    // Check duplicate email
    const { data: existing } = await supabase
      .from("contacts")
      .select("id")
      .eq("contact_type", "Email")
      .eq("contact_value", data.email)
      .limit(1);

    if (existing && existing.length > 0) {
      throw conflict("An account with this email already exists", "DUPLICATE_EMAIL");
    }

    // 1. Create parent person
    const { data: parentPerson, error: parentErr } = await supabase
      .from("persons")
      .insert({
        first_name: data.parent.firstName,
        last_name: data.parent.lastName,
        identity_status: "Pending",
      })
      .select("id")
      .single();

    if (parentErr) throw internal("Failed to create parent record");
    const parentId = parentPerson.id;

    // 2. Parent role
    const { error: roleErr } = await supabase
      .from("person_roles")
      .insert({ person_id: parentId, role: "Parent" });

    if (roleErr) throw internal("Failed to assign parent role");

    // 3. Email contact
    const { data: emailContact, error: emailErr } = await supabase
      .from("contacts")
      .insert({ contact_type: "Email", contact_value: data.email })
      .select("id")
      .single();

    if (emailErr) throw internal("Failed to create email contact");

    const { error: pcErr1 } = await supabase
      .from("person_contacts")
      .insert({
        person_id: parentId,
        contact_id: emailContact.id,
        is_primary: true,
        contact_role: "Personal",
      });

    if (pcErr1) throw internal("Failed to link email to parent");

    // 4. Phone contact
    const { data: phoneContact, error: phoneErr } = await supabase
      .from("contacts")
      .insert({ contact_type: "Phone", contact_value: data.phone })
      .select("id")
      .single();

    if (phoneErr) throw internal("Failed to create phone contact");

    const { error: pcErr2 } = await supabase
      .from("person_contacts")
      .insert({
        person_id: parentId,
        contact_id: phoneContact.id,
        is_primary: false,
        contact_role: "Personal",
      });

    if (pcErr2) throw internal("Failed to link phone to parent");

    // 5. Address
    const { data: address, error: addrErr } = await supabase
      .from("addresses")
      .insert({
        address_line_1: data.address.street,
        suburb: data.address.suburb,
        postcode: data.address.postcode,
        country: "Australia",
      })
      .select("id")
      .single();

    if (addrErr) throw internal("Failed to create address");

    const { error: paErr } = await supabase
      .from("person_addresses")
      .insert({
        person_id: parentId,
        address_id: address.id,
        address_type: "Home",
        is_primary: true,
      });

    if (paErr) throw internal("Failed to link address to parent");

    // 6. Child person
    const { data: childPerson, error: childErr } = await supabase
      .from("persons")
      .insert({
        first_name: data.child.firstName,
        last_name: data.child.lastName,
        identity_status: "Pending",
      })
      .select("id")
      .single();

    if (childErr) throw internal("Failed to create player record");
    const childId = childPerson.id;

    // 7. Child role
    const { error: childRoleErr } = await supabase
      .from("person_roles")
      .insert({ person_id: childId, role: "Player" });

    if (childRoleErr) throw internal("Failed to assign player role");

    // 8. Parent-child relationship
    const { error: relErr } = await supabase
      .from("parent_child_relationship")
      .insert({
        parent_id: parentId,
        child_id: childId,
        relationship_type: "Parent",
        is_primary_guardian: true,
        pickup_authority: true,
        medical_authority: true,
        financial_responsibility: true,
      });

    if (relErr) throw internal("Failed to create parent-child relationship");

    // 9. Player profile
    const { error: profErr } = await supabase
      .from("player_profiles")
      .insert({ person_id: childId });

    if (profErr) throw internal("Failed to create player profile");

    // 10. Player registration for current season
    const { data: season } = await supabase
      .from("seasons")
      .select("name")
      .eq("is_current", true)
      .limit(1)
      .single();

    const seasonName = season?.name ?? "2026";

    const { error: regErr } = await supabase
      .from("player_registrations")
      .insert({
        person_id: childId,
        season: seasonName,
        registration_status: "Pending",
        fee_status: "Unpaid",
      });

    if (regErr) throw internal("Failed to create player registration");

    return jsonSuccess({
      parentId,
      childId,
      message: "Registration submitted successfully",
    });
  } catch (error) {
    return jsonError(error);
  }
});
