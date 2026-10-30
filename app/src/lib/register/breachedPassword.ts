/*
 * Breached-password screening via Have I Been Pwned's Pwned Passwords range
 * API. The password never leaves the browser: it is SHA-1 hashed locally and
 * only the first five hex characters are sent (k-anonymity), then the
 * returned hash suffixes are matched on this side.
 */

const RANGE_ENDPOINT = "https://api.pwnedpasswords.com/range";

/* SHA-1 of the password as uppercase hex — the format HIBP uses. */
export async function sha1Hex(value: string): Promise<string> {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-1", bytes);

  return [...new Uint8Array(digest)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase();
}

/*
 * Count how many times `suffix` appears in a range response. Each line is
 * "HASHSUFFIX:COUNT"; padded rows (requested via Add-Padding) carry a count
 * of 0 and must be ignored.
 */
export function parseRangeResponse(body: string, suffix: string): number {
  const target = suffix.toUpperCase();

  for (const line of body.split("\n")) {
    const separator = line.indexOf(":");
    if (separator === -1) continue;
    if (line.slice(0, separator).trim().toUpperCase() !== target) continue;

    const count = Number.parseInt(line.slice(separator + 1).trim(), 10);
    return Number.isNaN(count) ? 0 : count;
  }

  return 0;
}

/* Number of breaches the password appears in (0 = not found). */
export async function pwnedCount(
  password: string,
  signal?: AbortSignal,
): Promise<number> {
  const hash = await sha1Hex(password);

  const response = await fetch(`${RANGE_ENDPOINT}/${hash.slice(0, 5)}`, {
    signal,
    headers: { Accept: "text/plain" },
  });

  if (!response.ok) {
    throw new Error(`Pwned Passwords lookup failed (${response.status})`);
  }

  return parseRangeResponse(await response.text(), hash.slice(5));
}

/*
 * Fail-open wrapper: a network problem should never block registration, so
 * only a definite match counts as breached.
 */
export async function isPasswordBreached(
  password: string,
  signal?: AbortSignal,
): Promise<boolean> {
  try {
    return (await pwnedCount(password, signal)) > 0;
  } catch (error) {
    console.warn("Breached-password check skipped:", error);
    return false;
  }
}
