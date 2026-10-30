import { z } from "npm:zod@4";
import { badRequest } from "./errors.ts";

const childSchema = z.object({
  firstName: z.string().trim().min(1),
  lastName: z.string().trim().min(1),
  dateOfBirth: z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/, {
      message: "Date of birth must be in yyyy-mm-dd format",
    })
    .refine((value) => !Number.isNaN(Date.parse(value)), {
      message: "Date of birth must be a valid date",
    }),
});

const registrationSchema = z.object({
  firstName: z.string().trim().min(1),
  lastName: z.string().trim().min(1),
  parentEmail: z.string().trim().toLowerCase().email(),
  parentPhone: z
    .string()
    .trim()
    .transform((value) => value.replace(/\s/g, ""))
    .pipe(
      z.string().regex(/^04\d{8}$/, {
        message: "Phone must be a 10-digit mobile number (e.g. 04xx xxx xxx)",
      }),
    ),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters",
  }),
  unitNumber: z.string().trim().optional(),
  houseNumber: z.string().trim().min(1),
  streetName: z.string().trim().min(1),
  suburb: z.string().trim().min(1),
  postcode: z.string().trim().regex(/^\d{4}$/, {
    message: "Postcode must be a 4-digit number",
  }),
  children: z.array(childSchema).min(1, {
    message: "At least one child is required",
  }),
  terms: z
    .boolean()
    .optional()
    .refine((value) => value === true, {
      message: "You must agree to the terms and conditions",
    }),
});

export type RegistrationPayload = z.infer<typeof registrationSchema>;

export function validateRegistration(body: unknown): {
  parent: { firstName: string; lastName: string };
  email: string;
  phone: string;
  password: string;
  address: {
    unitNumber: string;
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

  return {
    parent: {
      firstName: data.firstName,
      lastName: data.lastName,
    },
    email: data.parentEmail,
    phone: data.parentPhone,
    password: data.password,
    address: {
      unitNumber: data.unitNumber ?? "",
      houseNumber: data.houseNumber,
      streetName: data.streetName,
      suburb: data.suburb,
      postcode: data.postcode,
    },
    children: data.children.map((child) => ({
      firstName: child.firstName,
      lastName: child.lastName,
      dateOfBirth: child.dateOfBirth,
    })),
  };
}
