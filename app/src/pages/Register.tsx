import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type FocusEvent,
  type KeyboardEvent,
  type ChangeEvent,
} from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import "../App.css";
import { Card } from "../components/Card";
import { TextInput } from "../components/TextInput";
import { Select } from "../components/Select";
import { Button } from "../components/Button";
import { DateInput } from "../components/DateInput";

interface ChildDraft {
  id: number;
}

interface ChildFieldErrors {
  firstName?: string;
  surname?: string;
  dob?: string;
}

interface AddressSuggestion {
  displayName: string;
  unitNumber?: string;
  houseNumber?: string;
  streetName?: string;
  suburb?: string;
  postcode?: string;
}

interface NominatimPlace {
  display_name?: string;
  address?: Record<string, string>;
}

const toAddressSuggestion = (place: NominatimPlace): AddressSuggestion => {
  const a = place.address ?? {};
  const unitNumber = a.unit ?? "";
  const houseNumber = a.house_number ?? "";
  const streetName = a.road ?? a.pedestrian ?? a.footway ?? "";
  const suburb = a.suburb ?? a.locality ?? a.town ?? a.city ?? a.village ?? a.municipality ?? "";

  return {
    displayName: place.display_name ?? "",
    unitNumber: unitNumber || undefined,
    houseNumber: houseNumber || undefined,
    streetName: streetName || undefined,
    suburb: suburb || undefined,
    postcode: a.postcode || undefined,
  };
};

const formatPhone = (digits: string): string => {
  if (digits.length <= 4) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 4)} ${digits.slice(4)}`;
  return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7, 10)}`;
};

const CHILD_ORDINAL_LABELS = [
  "Second",
  "Third",
  "Fourth",
  "Fifth",
  "Sixth",
  "Seventh",
  "Eighth",
  "Ninth",
  "Tenth",
];

const childHeading = (index: number): string => {
  if (index === 0) return "First Child";
  const ordinal = CHILD_ORDINAL_LABELS[index - 1];
  return ordinal ? `${ordinal} Child` : `${index + 1}th Child`;
};

const TERMS_PARAGRAPHS = [
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?",
  "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae.",
];

export function Register() {
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [firstNameError, setFirstNameError] = useState<string | undefined>();
  const [surnameError, setSurnameError] = useState<string | undefined>();
  const [emailError, setEmailError] = useState<string | undefined>();
  const [phoneError, setPhoneError] = useState<string | undefined>();
  const [children, setChildren] = useState<ChildDraft[]>([{ id: 1 }]);
  const [childErrors, setChildErrors] = useState<Record<number, ChildFieldErrors>>({});
  const [termsOpen, setTermsOpen] = useState(false);
  const [addressQuery, setAddressQuery] = useState("");
  const [addressSuggestions, setAddressSuggestions] = useState<AddressSuggestion[]>([]);
  const [showAddressSuggestions, setShowAddressSuggestions] = useState(false);
  const [addressLookupLoading, setAddressLookupLoading] = useState(false);
  const [addressLookupError, setAddressLookupError] = useState<string | undefined>();

  const nextChildId = useRef(2);
  const unitNumberRef = useRef<HTMLInputElement>(null);
  const houseNumberRef = useRef<HTMLInputElement>(null);
  const streetNameRef = useRef<HTMLInputElement>(null);
  const suburbRef = useRef<HTMLInputElement>(null);
  const postcodeRef = useRef<HTMLInputElement>(null);
  const lookupTimeoutRef = useRef<number | undefined>(undefined);
  const lookupControllerRef = useRef<AbortController | null>(null);
  const lastLookupAtRef = useRef<number | undefined>(undefined);

  const NAME_ALLOWED = /^[\p{L}\s'.-]+$/u;
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const PHONE_RE = /^04\d{8}$/;
  const TODAY = new Date().toISOString().slice(0, 10);

  const validateName = (value: string): string | undefined =>
    value.trim() === "" ? "This field is required" : undefined;

  const validateEmail = (value: string): string | undefined =>
    value.trim() === ""
      ? "Email is required"
      : EMAIL_RE.test(value.trim())
        ? undefined
        : "Please enter a valid email address";

  const validatePhone = (value: string): string | undefined => {
    if (value.trim() === "") return "Phone number is required";
    return PHONE_RE.test(value.trim().replace(/\s/g, ""))
      ? undefined
      : "Enter a valid mobile number (e.g. 04xx xxx xxx)";
  };

  const validateDob = (value: string): string | undefined =>
    value === "" ? "Date of birth is required" : undefined;

  const handleNameBlur = (
    event: FocusEvent<HTMLInputElement>,
    setError: (error: string | undefined) => void,
  ) => {
    const target = event.target;
    const value = target.value.trim();
    if (value === "") return;
    target.value = value.charAt(0).toUpperCase() + value.slice(1);
    setError(validateName(target.value));
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
    setEmailError(validateEmail(event.target.value));
  };

  const handlePhoneBlur = (event: FocusEvent<HTMLInputElement>) => {
    setPhoneError(validatePhone(event.target.value));
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

  const handleAddressLookupChange = (event: ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setAddressQuery(query);

    if (lookupTimeoutRef.current !== undefined) {
      window.clearTimeout(lookupTimeoutRef.current);
    }
    lookupControllerRef.current?.abort();

    if (query.trim().length < 5) {
      setAddressSuggestions([]);
      setShowAddressSuggestions(false);
      setAddressLookupLoading(false);
      return;
    }

    setAddressLookupLoading(true);

    const controller = new AbortController();
    lookupControllerRef.current = controller;

    lookupTimeoutRef.current = window.setTimeout(async () => {
      const retryAfter = Math.max(
        2000,
        (lastLookupAtRef.current ?? 0) + 2000 - Date.now(),
      );

      lookupTimeoutRef.current = window.setTimeout(async () => {
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&countrycodes=au&limit=5&q=${encodeURIComponent(query.trim())}`,
            { signal: controller.signal, headers: { Accept: "application/json" } },
          );
          lastLookupAtRef.current = Date.now();
          if (response.status === 429) {
            throw new Error("rate-limited");
          }
          if (!response.ok) {
            throw new Error(`Address lookup failed (${response.status})`);
          }
          const data = (await response.json()) as NominatimPlace[];
          setAddressSuggestions(data.map(toAddressSuggestion));
          setShowAddressSuggestions(true);
          setAddressLookupError(undefined);
        } catch (error) {
          if (error instanceof DOMException && error.name === "AbortError") return;
          setAddressSuggestions([]);
          setShowAddressSuggestions(false);
          setAddressLookupError(
            error instanceof Error && error.message === "rate-limited"
              ? "Address lookup is currently rate-limited. Please wait a moment and try again, or enter your address manually."
              : "Address lookup failed. Please type your address manually.",
          );
        } finally {
          if (!controller.signal.aborted) setAddressLookupLoading(false);
        }
      }, retryAfter);
    }, 500);
  };

  useEffect(() => {
    return () => {
      if (lookupTimeoutRef.current !== undefined) {
        window.clearTimeout(lookupTimeoutRef.current);
      }
      lookupControllerRef.current?.abort();
    };
  }, []);

  const applyAddressSuggestion = (suggestion: AddressSuggestion) => {
    if (unitNumberRef.current) unitNumberRef.current.value = suggestion.unitNumber ?? "";
    if (houseNumberRef.current) houseNumberRef.current.value = suggestion.houseNumber ?? "";
    if (streetNameRef.current) streetNameRef.current.value = suggestion.streetName ?? "";
    if (suburbRef.current) suburbRef.current.value = suggestion.suburb ?? "";
    if (postcodeRef.current) postcodeRef.current.value = suggestion.postcode ?? "";
    setAddressQuery("");
    setShowAddressSuggestions(false);
    setAddressSuggestions([]);
    setAddressLookupError(undefined);
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

  useEffect(() => {
    if (!termsOpen) return;

    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") closeTerms();
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [termsOpen]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const errors = {
      firstName: validateName(String(data.get("firstName") ?? "")),
      surname: validateName(String(data.get("surname") ?? "")),
      email: validateEmail(String(data.get("parentEmail") ?? "")),
      phone: validatePhone(String(data.get("parentPhone") ?? "")),
    };

    const childErrorMap: Record<number, ChildFieldErrors> = {};
    for (const child of children) {
      childErrorMap[child.id] = {
        firstName: validateName(String(data.get(`child-${child.id}-firstName`) ?? "")),
        surname: validateName(String(data.get(`child-${child.id}-surname`) ?? "")),
        dob: validateDob(String(data.get(`child-${child.id}-dob`) ?? "")),
      };
    }

    setFirstNameError(errors.firstName);
    setSurnameError(errors.surname);
    setEmailError(errors.email);
    setPhoneError(errors.phone);
    setChildErrors(childErrorMap);

    const fieldOrder: Array<[string, string | undefined]> = [
      ["firstName", errors.firstName],
      ["surname", errors.surname],
      ["parentEmail", errors.email],
      ["parentPhone", errors.phone],
    ];
    for (const child of children) {
      const childErr = childErrorMap[child.id];
      fieldOrder.push([`child-${child.id}-firstName`, childErr.firstName]);
      fieldOrder.push([`child-${child.id}-surname`, childErr.surname]);
      fieldOrder.push([`child-${child.id}-dob`, childErr.dob]);
    }

    const firstInvalid = fieldOrder.find(([, error]) => error !== undefined);
    if (firstInvalid) {
      const element = event.currentTarget.elements.namedItem(firstInvalid[0]);
      if (element instanceof HTMLInputElement) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        element.focus();
      }
      return;
    }

    setSubmitting(true);

    setTimeout(() => {
      setSubmitting(false);
      setDone(true);
    }, 1000);
  };

  return (
    <main className="content">
      <section className="hero">
        <div className="eyebrow">JOIN THE ACADEMY</div>

        <h1>
          Create an Account
          <span>One Login Access</span>
        </h1>

        <p className="hero-description">
          Register once to book pitches, gym sessions, leagues and parties, and
          to manage your Academy training schedule.
        </p>
      </section>

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
                  error={firstNameError}
                  onBlur={(event) => handleNameBlur(event, setFirstNameError)}
                  onKeyDown={handleNameKeyDown}
                  onChange={handleNameChange}
                />

                <TextInput
                  label="Surname"
                  name="surname"
                  type="text"
                  placeholder="Surname"
                  required
                  error={surnameError}
                  onBlur={(event) => handleNameBlur(event, setSurnameError)}
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
                error={emailError}
                onBlur={handleEmailBlur}
              />

              <TextInput
                label="Phone Number"
                name="parentPhone"
                type="tel"
                placeholder="04xx xxx xxx"
                required
                error={phoneError}
                onBlur={handlePhoneBlur}
                onKeyDown={handlePhoneKeyDown}
                onChange={handlePhoneChange}
              />

              <fieldset className="register-address">
                <legend>Address</legend>

                <TextInput
                  label="Address Lookup"
                  name="addressLookup"
                  type="text"
                  placeholder="Start typing your address"
                  required
                  value={addressQuery}
                  onChange={handleAddressLookupChange}
                  onBlur={() => {
                    window.setTimeout(() => setShowAddressSuggestions(false), 150);
                  }}
                  hint={
                  addressLookupLoading ? (
                    <span className="lookup-loading">
                      <span className="lookup-spinner" aria-hidden="true" />
                      Searching...
                    </span>
                  ) : undefined
                }
                  error={addressLookupError}
                />

                {showAddressSuggestions && addressSuggestions.length > 0 && (
                  <ul className="lookup-suggestions">
                    {addressSuggestions.map((suggestion, index) => (
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
                  />
                </div>

                <TextInput
                  label="Street Name"
                  name="streetName"
                  type="text"
                  placeholder="e.g. Smith Street"
                  required
                  ref={streetNameRef}
                />

                <div className="register-address__row">
                  <TextInput
                    label="Suburb"
                    name="suburb"
                    type="text"
                    placeholder="Suburb"
                    required
                    ref={suburbRef}
                  />

                  <TextInput
                    label="Postcode"
                    name="postcode"
                    type="text"
                    placeholder="3000"
                    required
                    ref={postcodeRef}
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
                        options={[
                          { value: "miniroos", label: "MiniRoos" },
                          { value: "junior", label: "Juniors" },
                          { value: "academy", label: "Academy" },
                          { value: "gk", label: "Goalkeeper" },
                          { value: "e360", label: "E360" },
                        ]}
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
                    <button
                      type="button"
                      className="terms-link"
                      onClick={openTerms}
                    >
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

              {done && (
                <p className="register-success">
                  Account created (demo). You&apos;ll be able to log in once
                  authentication is wired up. Redirecting to login...
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

      {termsOpen &&
        createPortal(
          <div
            className="terms-lightbox terms-lightbox--open"
            role="dialog"
            aria-modal="true"
            aria-label="Terms and conditions"
            onClick={closeTerms}
          >
            <div
              className="terms-lightbox__panel"
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                className="coach-lightbox__close"
                aria-label="Close"
                onClick={closeTerms}
              >
                ✕
              </button>

              <div className="terms-lightbox__content">
                <h2 className="terms-lightbox__title">Terms &amp; Conditions</h2>
                <div className="terms-lightbox__text">
                  {TERMS_PARAGRAPHS.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </main>
  );
}