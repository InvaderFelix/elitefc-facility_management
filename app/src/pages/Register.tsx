import {
  useRef,
  useState,
  type FormEvent,
  type FocusEvent,
  type KeyboardEvent,
  type ChangeEvent,
} from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/pages/register.css";
import { Card } from "../components/Card";
import { TextInput } from "../components/TextInput";
import { Select } from "../components/Select";
import { Button } from "../components/Button";
import { DateInput } from "../components/DateInput";
import { ErrorMessage } from "../components/ErrorMessage";
import { PageHero } from "../components/PageHero";
import { Lightbox } from "../components/Lightbox";
import { getSupabase } from "../lib/supabase";
import { useAddressLookup } from "../hooks/useAddressLookup";
import { useFieldErrors } from "../hooks/useFieldErrors";
import type { AddressSuggestion } from "../lib/register/addressLookup";
import {
  NAME_ALLOWED,
  formatPhone,
  todayIso,
  validateConfirmPassword,
  validateDob,
  validateEmail,
  validateHouseNumber,
  validateName,
  validatePassword,
  validatePhone,
  validatePostcode,
  validateStreetName,
  validateSuburb,
} from "../lib/register/validation";
import { childHeading, PROGRAM_OPTIONS, TERMS_PARAGRAPHS } from "../data/register";

interface ChildDraft {
  id: number;
}

interface ChildFieldErrors {
  firstName?: string;
  surname?: string;
  dob?: string;
}

type ParentField =
  | "firstName"
  | "surname"
  | "email"
  | "phone"
  | "password"
  | "houseNumber"
  | "streetName"
  | "suburb"
  | "postcode";

export function Register() {
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const { errors, setFieldError, setAll } = useFieldErrors<ParentField>();
  const [children, setChildren] = useState<ChildDraft[]>([{ id: 1 }]);
  const [childErrors, setChildErrors] = useState<Record<number, ChildFieldErrors>>({});
  const [termsOpen, setTermsOpen] = useState(false);
  const navigate = useNavigate();
  const lookup = useAddressLookup();

  const nextChildId = useRef(2);
  const unitNumberRef = useRef<HTMLInputElement>(null);
  const houseNumberRef = useRef<HTMLInputElement>(null);
  const streetNameRef = useRef<HTMLInputElement>(null);
  const suburbRef = useRef<HTMLInputElement>(null);
  const postcodeRef = useRef<HTMLInputElement>(null);

  const TODAY = todayIso();

  const revalidate =
    (field: ParentField, validate: (value: string) => string | undefined) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      if (errors[field]) setFieldError(field, validate(event.target.value));
    };

  const handleNameBlur = (event: FocusEvent<HTMLInputElement>, field: ParentField) => {
    const target = event.target;
    const value = target.value.trim();
    if (value === "") return;
    target.value = value.charAt(0).toUpperCase() + value.slice(1);
    setFieldError(field, validateName(target.value));
  };

  const handleChildNameBlur = (
    event: FocusEvent<HTMLInputElement>,
    childId: number,
    field: "firstName" | "surname",
  ) => {
    const target = event.target;
    const value = target.value.trim();
    if (value === "") return;
    target.value = value.charAt(0).toUpperCase() + value.slice(1);
    setChildErrors((prev) => ({
      ...prev,
      [childId]: { ...prev[childId], [field]: validateName(target.value) },
    }));
  };

  const handleChildDobBlur = (event: FocusEvent<HTMLInputElement>, childId: number) => {
    setChildErrors((prev) => ({
      ...prev,
      [childId]: { ...prev[childId], dob: validateDob(event.target.value) },
    }));
  };

  const handleEmailBlur = (event: FocusEvent<HTMLInputElement>) => {
    setFieldError("email", validateEmail(event.target.value));
  };

  const handlePhoneBlur = (event: FocusEvent<HTMLInputElement>) => {
    setFieldError("phone", validatePhone(event.target.value));
  };

  const handleNameKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    if (event.key.length === 1 && !NAME_ALLOWED.test(event.key)) {
      event.preventDefault();
    }
  };

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    const sanitized = event.target.value.replace(/[^\p{L}\s'.-]/gu, "");
    if (sanitized !== event.target.value) {
      event.target.value = sanitized;
    }
  };

  const handlePhoneKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    if (event.key.length === 1 && !/\d/.test(event.key)) {
      event.preventDefault();
    }
  };

  const handlePhoneChange = (event: ChangeEvent<HTMLInputElement>) => {
    const digits = event.target.value.replace(/\D+/g, "").slice(0, 10);
    const formatted = formatPhone(digits);
    if (formatted !== event.target.value) {
      event.target.value = formatted;
    }
  };

  const applyAddressSuggestion = (suggestion: AddressSuggestion) => {
    if (unitNumberRef.current) unitNumberRef.current.value = suggestion.unitNumber ?? "";
    if (houseNumberRef.current) houseNumberRef.current.value = suggestion.houseNumber ?? "";
    if (streetNameRef.current) streetNameRef.current.value = suggestion.streetName ?? "";
    if (suburbRef.current) suburbRef.current.value = suggestion.suburb ?? "";
    if (postcodeRef.current) postcodeRef.current.value = suggestion.postcode ?? "";
    unitNumberRef.current?.focus();
    setFieldError("houseNumber", undefined);
    setFieldError("streetName", undefined);
    setFieldError("suburb", undefined);
    setFieldError("postcode", undefined);
    lookup.clear();
  };

  const addChild = () => {
    setChildren((prev) => [...prev, { id: nextChildId.current++ }]);
  };

  const removeChild = (childId: number) => {
    setChildren((prev) => {
      if (prev.length <= 1) return prev;
      return prev.filter((child) => child.id !== childId);
    });
    setChildErrors((prev) => {
      const next = { ...prev };
      delete next[childId];
      return next;
    });
  };

  const openTerms = () => setTermsOpen(true);
  const closeTerms = () => setTermsOpen(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const password = String(data.get("password") ?? "");
    const confirmPassword = String(data.get("confirmPassword") ?? "");

    const passwordErr = validatePassword(password);
    const confirmErr = validateConfirmPassword(password, confirmPassword);

    const next: Partial<Record<ParentField, string>> = {
      firstName: validateName(String(data.get("firstName") ?? "")),
      surname: validateName(String(data.get("surname") ?? "")),
      email: validateEmail(String(data.get("parentEmail") ?? "")),
      phone: validatePhone(String(data.get("parentPhone") ?? "")),
      password: passwordErr || confirmErr || undefined,
      houseNumber: validateHouseNumber(String(data.get("houseNumber") ?? "")),
      streetName: validateStreetName(String(data.get("streetName") ?? "")),
      suburb: validateSuburb(String(data.get("suburb") ?? "")),
      postcode: validatePostcode(String(data.get("postcode") ?? "")),
    };

    const childErrorMap: Record<number, ChildFieldErrors> = {};
    for (const child of children) {
      childErrorMap[child.id] = {
        firstName: validateName(String(data.get(`child-${child.id}-firstName`) ?? "")),
        surname: validateName(String(data.get(`child-${child.id}-surname`) ?? "")),
        dob: validateDob(String(data.get(`child-${child.id}-dob`) ?? "")),
      };
    }

    setAll(next);
    setChildErrors(childErrorMap);
    setError("");

    const fieldOrder: Array<[string, string | undefined]> = [
      ["firstName", next.firstName],
      ["surname", next.surname],
      ["parentEmail", next.email],
      ["parentPhone", next.phone],
      ["password", passwordErr],
      ["confirmPassword", confirmErr],
      ["houseNumber", next.houseNumber],
      ["streetName", next.streetName],
      ["suburb", next.suburb],
      ["postcode", next.postcode],
    ];
    for (const child of children) {
      const childErr = childErrorMap[child.id];
      fieldOrder.push([`child-${child.id}-firstName`, childErr.firstName]);
      fieldOrder.push([`child-${child.id}-surname`, childErr.surname]);
      fieldOrder.push([`child-${child.id}-dob`, childErr.dob]);
    }

    const firstInvalid = fieldOrder.find(([, fieldError]) => fieldError !== undefined);
    if (firstInvalid) {
      const element = event.currentTarget.elements.namedItem(firstInvalid[0]);
      if (element instanceof HTMLInputElement) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        element.focus();
      }
      return;
    }

    const supabase = getSupabase();
    if (!supabase) {
      setError("Registration is not configured yet.");
      return;
    }

    setSubmitting(true);

    try {
      // Extract child data from the first child
      const firstChild = children[0];
      const childFirstName = String(data.get(`child-${firstChild.id}-firstName`) ?? "");
      const childLastName = String(data.get(`child-${firstChild.id}-surname`) ?? "");
      const childProgram = String(data.get(`child-${firstChild.id}-program`) ?? "");

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/register-account`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstName: String(data.get("firstName") ?? ""),
            lastName: String(data.get("surname") ?? ""),
            parentEmail: String(data.get("parentEmail") ?? ""),
            parentPhone: String(data.get("parentPhone") ?? ""),
            street: String(data.get("streetName") ?? ""),
            suburb: String(data.get("suburb") ?? ""),
            postcode: String(data.get("postcode") ?? ""),
            childFirstName,
            childLastName,
            ageGroup: childProgram,
            program: childProgram,
            terms: Boolean(data.get("terms") ?? false),
          }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        setError(result.error?.message || "Could not create account.");
        return;
      }

      setDone(true);
      setTimeout(() => navigate("/"), 1500);
    } catch {
      setError("Could not create account. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="content">
      <PageHero
        eyebrow="JOIN THE ACADEMY"
        title="Create an Account"
        accent="One Login Access"
        description="Register once to book pitches, gym sessions, leagues and parties, and to manage your Academy training schedule."
      />

      <section className="register-layout">
        <Card eyebrow="Registration" title="Parent / Guardian Details">
          <div className="card__body">
            <form onSubmit={handleSubmit} noValidate>
              <div className="register-address__row">
                <TextInput
                  label="First Name"
                  name="firstName"
                  type="text"
                  placeholder="First name"
                  required
                  error={errors.firstName}
                  onBlur={(event) => handleNameBlur(event, "firstName")}
                  onKeyDown={handleNameKeyDown}
                  onChange={handleNameChange}
                />

                <TextInput
                  label="Surname"
                  name="surname"
                  type="text"
                  placeholder="Surname"
                  required
                  error={errors.surname}
                  onBlur={(event) => handleNameBlur(event, "surname")}
                  onKeyDown={handleNameKeyDown}
                  onChange={handleNameChange}
                />
              </div>

              <TextInput
                label="Email Address"
                name="parentEmail"
                type="email"
                placeholder="you@example.com"
                required
                error={errors.email}
                onBlur={handleEmailBlur}
              />

              <TextInput
                label="Phone Number"
                name="parentPhone"
                type="tel"
                placeholder="04xx xxx xxx"
                required
                error={errors.phone}
                onBlur={handlePhoneBlur}
                onKeyDown={handlePhoneKeyDown}
                onChange={handlePhoneChange}
              />

              <TextInput
                label="Password"
                name="password"
                type="password"
                placeholder="At least 8 characters"
                autoComplete="new-password"
                required
                error={errors.password}
              />

              <TextInput
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                placeholder="Re-enter password"
                autoComplete="new-password"
                required
                error={errors.password}
              />

              <fieldset className="register-address">
                <legend>Address</legend>

                <TextInput
                  label="Address Lookup"
                  name="addressLookup"
                  type="text"
                  placeholder="Start typing your address"
                  value={lookup.query}
                  onChange={(event) => lookup.search(event.target.value)}
                  onBlur={() => {
                    window.setTimeout(lookup.dismiss, 150);
                  }}
                  hint={
                    lookup.loading ? (
                      <span className="lookup-loading">
                        <span className="lookup-spinner" aria-hidden="true" />
                        Searching...
                      </span>
                    ) : undefined
                  }
                  error={lookup.error}
                />

                {lookup.showSuggestions && lookup.suggestions.length > 0 && (
                  <ul className="lookup-suggestions">
                    {lookup.suggestions.map((suggestion, index) => (
                      <li key={`${suggestion.displayName}-${index}`}>
                        <button
                          type="button"
                          onMouseDown={(event) => {
                            event.preventDefault();
                            applyAddressSuggestion(suggestion);
                          }}
                        >
                          {suggestion.displayName}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="register-address__row">
                  <TextInput
                    label="Unit / Flat"
                    name="unitNumber"
                    type="text"
                    placeholder="e.g. 5"
                    ref={unitNumberRef}
                  />

                  <TextInput
                    label="Street Number"
                    name="houseNumber"
                    type="text"
                    placeholder="e.g. 12"
                    required
                    ref={houseNumberRef}
                    error={errors.houseNumber}
                    onChange={revalidate("houseNumber", validateHouseNumber)}
                  />
                </div>

                <TextInput
                  label="Street Name"
                  name="streetName"
                  type="text"
                  placeholder="e.g. Smith Street"
                  required
                  ref={streetNameRef}
                  error={errors.streetName}
                  onChange={revalidate("streetName", validateStreetName)}
                />

                <div className="register-address__row">
                  <TextInput
                    label="Suburb"
                    name="suburb"
                    type="text"
                    placeholder="Suburb"
                    required
                    ref={suburbRef}
                    error={errors.suburb}
                    onChange={revalidate("suburb", validateSuburb)}
                  />

                  <TextInput
                    label="Postcode"
                    name="postcode"
                    type="text"
                    placeholder="3000"
                    required
                    ref={postcodeRef}
                    error={errors.postcode}
                    onChange={revalidate("postcode", validatePostcode)}
                  />
                </div>
              </fieldset>

              <div className="divider" />

              {children.map((child, index) => (
                <Card key={child.id} title={childHeading(index)}>
                  <div className="card__body">
                    <div className="register-address__row">
                      <TextInput
                        label="First Name"
                        name={`child-${child.id}-firstName`}
                        type="text"
                        placeholder="Child's first name"
                        required
                        error={childErrors[child.id]?.firstName}
                        onBlur={(event) => handleChildNameBlur(event, child.id, "firstName")}
                        onKeyDown={handleNameKeyDown}
                        onChange={handleNameChange}
                      />

                      <TextInput
                        label="Surname"
                        name={`child-${child.id}-surname`}
                        type="text"
                        placeholder="Child's surname"
                        required
                        error={childErrors[child.id]?.surname}
                        onBlur={(event) => handleChildNameBlur(event, child.id, "surname")}
                        onKeyDown={handleNameKeyDown}
                        onChange={handleNameChange}
                      />
                    </div>

                    <div className="register-address__row">
                      <DateInput
                        label="Date of Birth"
                        name={`child-${child.id}-dob`}
                        required
                        maxDate={TODAY}
                        error={childErrors[child.id]?.dob}
                        onBlur={(event) => handleChildDobBlur(event, child.id)}
                      />

                      <Select
                        label="Program"
                        name={`child-${child.id}-program`}
                        placeholder="Select program"
                        required
                        options={PROGRAM_OPTIONS}
                      />
                    </div>

                    {children.length > 1 && (
                      <div className="remove-child-row">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeChild(child.id)}
                        >
                          Remove Child
                        </Button>
                      </div>
                    )}
                  </div>
                </Card>
              ))}

              <div className="add-child-row">
                <Button variant="secondary" fullWidth onClick={addChild}>
                  + Add Another Child
                </Button>
              </div>

              <div className="form-options form-options--spaced">
                <label className="remember">
                  <input type="checkbox" id="terms" required />
                  <span>
                    I agree to the{" "}
                    <button type="button" className="terms-link" onClick={openTerms}>
                      terms &amp; conditions
                    </button>
                  </span>
                </label>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                disabled={submitting || done}
              >
                {submitting ? "CREATING ACCOUNT..." : "Create Account"}
              </Button>

              <ErrorMessage>{error}</ErrorMessage>

              {done && (
                <p className="register-success">
                  Account created. Redirecting to login...
                </p>
              )}
            </form>
          </div>
        </Card>

        <div className="divider" />

        <div className="join">
          Already have an account? &nbsp;
          <Link to="/">Log in</Link>
        </div>
      </section>

      {termsOpen && (
        <Lightbox
          variant="terms-lightbox"
          open
          onClose={closeTerms}
          ariaLabel="Terms and conditions"
        >
          <div className="terms-lightbox__content">
            <h2 className="terms-lightbox__title">Terms &amp; Conditions</h2>
            <div className="terms-lightbox__text">
              {TERMS_PARAGRAPHS.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
        </Lightbox>
      )}
    </main>
  );
}
