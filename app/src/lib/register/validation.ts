/*
 * Field-level validation for the registration form. Shared by the blur, change
 * and submit paths so the rules live in exactly one place.
 */

export const NAME_ALLOWED = /^[\p{L}\s'.-]+$/u;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^04\d{8}$/;
const STREET_NUMBER_RE = /^\d+[A-Za-z]?(?:\s*-\s*\d+[A-Za-z]?)?$/;

export const todayIso = (): string => new Date().toISOString().slice(0, 10);

export const formatPhone = (digits: string): string => {
  if (digits.length <= 4) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 4)} ${digits.slice(4)}`;
  return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7, 10)}`;
};

export const validateName = (value: string): string | undefined =>
  value.trim() === "" ? "This field is required" : undefined;

export const validateEmail = (value: string): string | undefined =>
  value.trim() === ""
    ? "Email is required"
    : EMAIL_RE.test(value.trim())
      ? undefined
      : "Please enter a valid email address";

export const validatePhone = (value: string): string | undefined => {
  if (value.trim() === "") return "Phone number is required";
  return PHONE_RE.test(value.trim().replace(/\s/g, ""))
    ? undefined
    : "Enter a valid mobile number (e.g. 04xx xxx xxx)";
};

export const validateDob = (value: string): string | undefined =>
  value === "" ? "Date of birth is required" : undefined;

export const validatePassword = (value: string): string | undefined =>
  value.length < 8 ? "Use a password of at least 8 characters." : undefined;

export const validateConfirmPassword = (
  password: string,
  confirm: string,
): string | undefined => (confirm !== password ? "Passwords do not match." : undefined);

export const validateHouseNumber = (value: string): string | undefined => {
  const trimmed = value.trim();
  if (trimmed === "") return "Street number is required";
  return STREET_NUMBER_RE.test(trimmed)
    ? undefined
    : "Enter a valid street number (e.g. 12 or 12A)";
};

export const validateStreetName = (value: string): string | undefined => {
  const trimmed = value.trim();
  if (trimmed === "") return "Street name is required";
  return /\d/.test(trimmed) ? "Enter a street name without a number" : undefined;
};

export const validateSuburb = (value: string): string | undefined => {
  const trimmed = value.trim();
  if (trimmed === "") return "Suburb is required";
  return NAME_ALLOWED.test(trimmed) ? undefined : "Enter a valid suburb";
};

export const validatePostcode = (value: string): string | undefined => {
  const trimmed = value.trim();
  if (trimmed === "") return "Postcode is required";
  return /^\d{4}$/.test(trimmed) ? undefined : "Enter a valid 4-digit postcode";
};
