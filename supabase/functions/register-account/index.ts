import { createClient, type SupabaseClient } from "npm:@supabase/supabase-js@2";
import { corsResponse, jsonError, jsonSuccess } from "../shared/responses.ts";
import { conflict, internal, badRequest, tooManyRequests } from "../shared/errors.ts";
import { validateRegistration } from "../shared/validation.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const RATE_LIMITS = {
  ip: { max: 10, windowSec: 600 },
  email: { max: 3, windowSec: 3600 },
} as const;

const RATE_LIMIT_MESSAGE =
  "Too many registration attempts. Please try again later.";

/*
 * Rightmost entry of x-forwarded-for — the leftmost entries are
 * client-spoofable. Undefined when the header is absent, in which case the
 * IP bucket is skipped entirely (an "unknown" key would let one attacker
 * lock out every visitor).
 */
function clientIp(req: Request): string | undefined {
  const forwarded = req.headers.get("x-forwarded-for");
  if (!forwarded) return undefined;
  const rightmost = forwarded.split(",").pop()?.trim();
  return rightmost || undefined;
}

/*
 * Take one token from a rate-limit bucket. Fails open: a limiter outage
 * must not block registrations, so errors are logged and the request is
 * allowed through.
 */
async function takeRateLimit(
  admin: SupabaseClient,
  action: string,
  key: string,
  limit: { max: number; windowSec: number },
): Promise<boolean> {
  try {
    const { data, error } = await admin.rpc("rate_limit_take", {
      p_action: action,
      p_key: key,
      p_limit: limit.max,
      p_window_seconds: limit.windowSec,
    });
    if (error) {
      console.error("rate limit check failed:", error);
      return true;
    }
    return data === true;
  } catch (err) {
    console.error("rate limit check failed:", err);
    return true;
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return corsResponse();

  let admin: SupabaseClient | null = null;
  let authUserId: string | undefined;

  try {
    if (req.method !== "POST") {
      throw badRequest("Method not allowed");
    }

    const body = await req.json();
    const data = validateRegistration(body);

    admin = createClient(SUPABASE_URL, SERVICE_KEY);

    // Rate limit: IP bucket first, then email (docs/architecture/rate-limiter.md)
    const ip = clientIp(req);
    if (
      ip &&
      !(await takeRateLimit(admin, "register-ip", `ip:${ip}`, RATE_LIMITS.ip))
    ) {
      throw tooManyRequests(RATE_LIMIT_MESSAGE, "RATE_LIMITED");
    }
    if (
      !(await takeRateLimit(
        admin,
        "register-email",
        `email:${data.email}`,
        RATE_LIMITS.email,
      ))
    ) {
      throw tooManyRequests(RATE_LIMIT_MESSAGE, "RATE_LIMITED");
    }

    // Check duplicate email
    const { data: existing } = await admin
      .from("contacts")
      .select("id")
      .eq("contact_type", "Email")
      .eq("contact_value", data.email)
      .limit(1);

    if (existing && existing.length > 0) {
      const { data: links } = await admin
        .from("person_contacts")
        .select("person_id")
        .eq("contact_id", existing[0].id)
        .limit(1);

      if (links && links.length > 0) {
        throw conflict(
          "An account with this email already exists",
          "DUPLICATE_EMAIL",
        );
      }
    }

    // 1. Create Supabase Auth user and link it to the parent person
    const { data: authUser, error: authErr } =
      await admin.auth.admin.createUser({
        email: data.email,
        password: data.password,
        email_confirm: true,
        user_metadata: {
          first_name: data.parent.firstName,
          last_name: data.parent.lastName,
        },
      });

    if (authErr) {
      if (
        authErr.code === "email_exists" ||
        authErr.message.toLowerCase().includes("already")
      ) {
        throw conflict(
          "An account with this email already exists",
          "DUPLICATE_EMAIL",
        );
      }
      throw internal("Failed to create auth account");
    }

    authUserId = authUser.user.id;

    // 2. Provision the parent, address and every child in one transaction
    const { data: registration, error: rpcErr } = await admin.rpc(
      "register_account",
      {
        p_payload: {
          authUserId,
          parent: data.parent,
          email: data.email,
          phone: data.phone,
          address: data.address,
          children: data.children,
        },
      },
    );

    if (rpcErr) {
      if (rpcErr.code === "23505") {
        throw conflict(
          "An account with this email already exists",
          "DUPLICATE_EMAIL",
        );
      }
      throw internal("Failed to create registration");
    }

    const result = registration as {
      parentId: string;
      childIds: string[];
    };

    return jsonSuccess({
      parentId: result.parentId,
      childIds: result.childIds,
      message: "Registration submitted successfully",
    });
  } catch (error) {
    if (admin && authUserId) {
      const { error: cleanupError } =
        await admin.auth.admin.deleteUser(authUserId);
      if (cleanupError) {
        console.error("Failed to roll back auth user:", cleanupError);
      }
    }
    return jsonError(error);
  }
});
