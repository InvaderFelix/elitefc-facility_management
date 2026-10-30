import {
  assertEquals,
  assertStringIncludes,
  assertThrows,
} from "jsr:@std/assert@1";
import { AppError } from "./errors.ts";
import { validateRegistration } from "./validation.ts";

type Body = Parameters<typeof validateRegistration>[0];

const validBody = (overrides: Record<string, unknown> = {}): Body => ({
  firstName: "Jane",
  lastName: "Doe",
  parentEmail: "Jane@Example.COM",
  parentPhone: "0412 345 678",
  password: "secret123",
  unitNumber: "5",
  houseNumber: "12",
  streetName: "Smith Street",
  suburb: "Fitzroy",
  postcode: "3065",
  children: [
    {
      firstName: "Sam",
      lastName: "Doe",
      dateOfBirth: "2015-05-01",
    },
  ],
  terms: true,
  ...overrides,
});

Deno.test("validateRegistration returns a normalised payload", () => {
  assertEquals(validateRegistration(validBody()), {
    parent: { firstName: "Jane", lastName: "Doe" },
    email: "jane@example.com",
    phone: "0412345678",
    password: "secret123",
    address: {
      unitNumber: "5",
      houseNumber: "12",
      streetName: "Smith Street",
      suburb: "Fitzroy",
      postcode: "3065",
    },
    children: [
      {
        firstName: "Sam",
        lastName: "Doe",
        dateOfBirth: "2015-05-01",
      },
    ],
  });
});

Deno.test("validateRegistration lowercases and trims the email", () => {
  const result = validateRegistration(
    validBody({ parentEmail: "  Jane@Example.COM  " }),
  );
  assertEquals(result.email, "jane@example.com");
});

Deno.test("validateRegistration keeps every child in the payload", () => {
  const result = validateRegistration(
    validBody({
      children: [
        {
          firstName: "Sam",
          lastName: "Doe",
          dateOfBirth: "2015-05-01",
        },
        {
          firstName: "Alex",
          lastName: "Doe",
          dateOfBirth: "2018-09-12",
        },
      ],
    }),
  );

  assertEquals(result.children.length, 2);
  assertEquals(result.children[1], {
    firstName: "Alex",
    lastName: "Doe",
    dateOfBirth: "2018-09-12",
  });
});

Deno.test("validateRegistration reports the offending field for schema failures", () => {
  const err = assertThrows(
    () => validateRegistration(validBody({ parentEmail: "not-an-email" })),
    AppError,
  );
  assertEquals(err.statusCode, 400);
  assertEquals(err.code, "VALIDATION_ERROR");
  assertStringIncludes(err.message, "parentEmail");
});

Deno.test("validateRegistration enforces a 4-digit postcode", () => {
  const err = assertThrows(
    () => validateRegistration(validBody({ postcode: "30" })),
    AppError,
  );
  assertStringIncludes(err.message, "Postcode must be a 4-digit number");
});

Deno.test("validateRegistration enforces a minimum 8-character password", () => {
  const err = assertThrows(
    () => validateRegistration(validBody({ password: "short" })),
    AppError,
  );
  assertStringIncludes(err.message, "password");
});

Deno.test("validateRegistration enforces a 10-digit mobile number", () => {
  assertStringIncludes(
    assertThrows(
      () => validateRegistration(validBody({ parentPhone: "041234567" })),
      AppError,
    ).message,
    "Phone must be a 10-digit mobile number",
  );
});

Deno.test("validateRegistration requires a valid date of birth", () => {
  assertStringIncludes(
    assertThrows(
      () =>
        validateRegistration(
          validBody({
            children: [
              {
                firstName: "Sam",
                lastName: "Doe",
                dateOfBirth: "01/05/2015",
              },
            ],
          }),
        ),
      AppError,
    ).message,
    "dateOfBirth",
  );
});

Deno.test("validateRegistration requires at least one child", () => {
  assertStringIncludes(
    assertThrows(() => validateRegistration(validBody({ children: [] })), AppError).message,
    "children",
  );
});

Deno.test("validateRegistration requires terms acceptance", () => {
  assertThrows(() => validateRegistration(validBody({ terms: false })), AppError);
  assertThrows(() => validateRegistration(validBody({ terms: undefined })), AppError);
});
