import { z } from "npm:zod@4";
import { badRequest } from "./errors.ts";

const AGE_GROUPS = ["petite", "miniroos", "junior", "academy"] as const;
const PROGRAMS = ["miniroos", "junior", "academy", "gk", "e360"] as const;

const registrationSchema = z.object({
  parentName: z.string().trim().min(1),
  parentEmail: z.string().trim().toLowerCase().email(),
  parentPhone: z.string().trim().min(3),
  street: z.string().trim().min(1),
  suburb: z.string().trim().min(1),
  postcode: z.string().trim().regex(/^\d{4}$/, {
    message: "Postcode must be a 4-digit number",
  }),
  playerName: z.string().trim().min(1),
  ageGroup: z.enum(AGE_GROUPS),
  program: z.enum(PROGRAMS),
  terms: z
    .boolean()
    .optional()
    .refine((value) => value === true, {
      message: "You must agree to the terms and conditions",
    }),
});

export type RegistrationPayload = z.infer<typeof registrationSchema>;

function splitName(fullName: string): { first: string; last: string } {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length < 2) {
    throw badRequest("Full name must include first and last name");
  }
  return { first: parts[0], last: parts.slice(1).join(" ") };
}

export function validateRegistration(body: unknown): {
  parent: { firstName: string; lastName: string };
  email: string;
  phone: string;
  address: { street: string; suburb: string; postcode: string };
  child: { firstName: string; lastName: string };
  ageGroup: string;
  program: string;
} {
  const parsed = registrationSchema.safeParse(body);

  if (!parsed.success) {
    const message = parsed.error.issues
      .map((issue) => {
        const field = issue.path.join(".");
        return field ? `${field}: ${issue.message}` : issue.message;
      })
      .join("; ");
    throw badRequest(message, "VALIDATION_ERROR");
  }

  const data = parsed.data;
  const parent = splitName(data.parentName);
  const child = splitName(data.playerName);

  return {
    parent,
    email: data.parentEmail,
    phone: data.parentPhone,
    address: {
      street: data.street,
      suburb: data.suburb,
      postcode: data.postcode,
    },
    child,
    ageGroup: data.ageGroup,
    program: data.program,
  };
}