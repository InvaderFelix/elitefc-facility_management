/*
 * Address autocomplete against OpenStreetMap's Nominatim. Pure mapping +
 * request logic lives here; the debounce/abort/rate-limit behaviour is wrapped
 * by the `useAddressLookup` hook.
 */

export interface AddressSuggestion {
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

const STREET_NUMBER_SEGMENT = /^\d+[A-Za-z]?(?:\s*-\s*\d+[A-Za-z]?)?$/;
const LEADING_ADDRESS_NUMBER =
  /^\s*(?:(\d+[A-Za-z]?)\s*\/\s*)?(\d+[A-Za-z]?(?:\s*-\s*\d+[A-Za-z]?)?)/;

const NOMINATIM_ENDPOINT = "https://nominatim.openstreetmap.org/search";

const tidyNumber = (value: string): string => value.replace(/\s+/g, "");

const extractLeadingSegmentNumber = (source: string | undefined): string => {
  if (!source) return "";

  for (const segment of source.split(",").slice(0, 2)) {
    const candidate = segment.trim();
    if (STREET_NUMBER_SEGMENT.test(candidate)) return tidyNumber(candidate);
  }

  return "";
};

const extractTypedNumber = (
  source: string | undefined,
): { unitNumber?: string; houseNumber?: string } => {
  const match = LEADING_ADDRESS_NUMBER.exec(source ?? "");
  if (!match) return {};

  const [, unit, house] = match;
  return {
    unitNumber: unit ? tidyNumber(unit) : undefined,
    houseNumber: tidyNumber(house),
  };
};

export const toAddressSuggestion = (
  place: NominatimPlace,
  query?: string,
): AddressSuggestion => {
  const a = place.address ?? {};
  const typed = extractTypedNumber(query);
  const houseNumber =
    a.house_number ||
    extractLeadingSegmentNumber(place.display_name) ||
    typed.houseNumber ||
    "";
  const unitNumber = a.unit || typed.unitNumber || "";
  const streetName = a.road ?? a.pedestrian ?? a.footway ?? "";
  const suburb =
    a.suburb ?? a.locality ?? a.town ?? a.city ?? a.village ?? a.municipality ?? "";

  return {
    displayName: place.display_name ?? "",
    unitNumber: unitNumber || undefined,
    houseNumber: houseNumber || undefined,
    streetName: streetName || undefined,
    suburb: suburb || undefined,
    postcode: a.postcode || undefined,
  };
};

/*
 * Throws Error("rate-limited") on HTTP 429 so the caller can show the
 * rate-limit message rather than the generic failure.
 */
export async function fetchAddressSuggestions(
  query: string,
  signal: AbortSignal,
): Promise<AddressSuggestion[]> {
  const response = await fetch(
    `${NOMINATIM_ENDPOINT}?format=json&addressdetails=1&countrycodes=au&limit=5&q=${encodeURIComponent(query)}`,
    { signal, headers: { Accept: "application/json" } },
  );

  if (response.status === 429) {
    throw new Error("rate-limited");
  }

  if (!response.ok) {
    throw new Error(`Address lookup failed (${response.status})`);
  }

  const data = (await response.json()) as NominatimPlace[];
  return data.map((place) => toAddressSuggestion(place, query));
}
