# ADR-002: Address Lookup Using the Nominatim (OpenStreetMap) Public API

## Status

Accepted (demo / early development)

## Context

The `/register` page needs an address lookup that auto-fills the address
detail fields — unit number, street number, street name, suburb, and postcode —
as the user types.

Requirements considered:

- **Free** — the project has no paid API budget and no Supabase/Google env config yet.
- **Keyless** — `app/.env` only contains placeholder Supabase values; nothing else is wired.
- **Australian addresses** — the facility is in Maribyrnong, VIC.
- **Client-side fetch** — no existing backend proxy; a browser-to-API call keeps the demo self-contained.

## Decision

Use the **Nominatim public API** (`https://nominatim.openstreetmap.org/`) for
forward geocoding ("search"), restricted to Australia via
`&countrycodes=au&addressdetails=1&limit=5`.

## Alternatives considered

| Option            | Key needed? | Notes                                                          |
| ----------------- | ----------- | -------------------------------------------------------------- |
| Nominatim (OSM)   | No          | Free, generous for light/demo use, AU coverage. **Chosen.**    |
| Photon (Komoot)   | No          | Keyless OSM autocomplete API; viable fallback, similar limits. |
| Google Places     | Yes         | Requires billing account + key; most polished suggestions.     |
| Mapbox Geocoding  | Yes         | Requires access token; free tier applies.                      |
| LocationIQ / HERE | Yes         | Free tiers exist but all need signup/keys.                     |

## Consequences

### Usage limits (public Nominatim instance)

- **Max 1 request/second** per website/app. There is **no published total/daily quota**.
- The limit counts the **aggregate of all users** of an app, and ~1 req/s per IP is technically enforced.
- A soft ceiling of ~**2,500 requests/day** is commonly recommended by the community (not an official number).
- Bulk jobs running >1 day must throttle to **4 requests/minute**; bulk geocoding is otherwise discouraged.
- Sustained heavy use may lead to IP blocking.

### Mitigations implemented (see `app/src/pages/Register.tsx`)

- **Debounce**: requests fire only after 500ms of no typing (min 5 chars).
- **Rate throttle**: client enforces **min 2,000ms between requests** (`lastLookupAtRef`),
  capping the app at **≤0.5 requests/sec** — well under Nominatim's 1 req/s policy ceiling.
- **AbortController**: in-flight lookup is aborted when the query changes; stale responses discarded.
- **429 handling**: a rate-limited response shows a distinct message ("rate-limited right now…")
  instead of the generic lookup failure text.
- **Fallback**: the Street / Suburb / Postcode inputs remain editable, so lookup failure
  never blocks registration.

### Other requirements

- Provide a valid HTTP `Referer`/`User-Agent` identifying the app (browser sends Referer automatically).
- Display OSM attribution to comply with ODbL / usage policy.
- Data is ODbL-licensed: derivative datasets must share alike (small extractions are likely fair use).

## Links

- OSMF Nominatim Usage Policy (official): https://operations.osmfoundation.org/policies/nominatim/
- Nominatim project + API docs: https://nominatim.org/
- Community clarification on the per-app aggregate limit: https://community.openstreetmap.org/t/clarification-on-nominatim-usage-policy/102661
- OSM Help — "Nominatim rate limits" (2500/day soft cap reference): https://help.openstreetmap.org/questions/86982/nominatim-rate-limits
- Understanding / complying with the policy (community thread): https://community.openstreetmap.org/t/understanding-and-complying-with-nominatim-usage-policy/129212

## Future consideration

For production, route lookup through an Edge Function proxy:
- central throttling and a keyed provider (Mapbox / LocationIQ / self-hosted Nominatim),
- the ability to swap providers without a frontend release (a policy requirement),
- caching of repeated lookups.