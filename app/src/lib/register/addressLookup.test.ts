import { describe, it, expect, vi, afterEach } from 'vitest';
import { fetchAddressSuggestions, toAddressSuggestion } from './addressLookup';

afterEach(() => {
  vi.unstubAllGlobals();
});

const place = (display_name?: string, address?: Record<string, string>) => ({
  display_name,
  address,
});

describe('toAddressSuggestion — house number precedence', () => {
  it('prefers the structured house_number', () => {
    const result = toAddressSuggestion(
      place('99 Foo St, Fitzroy', { house_number: '5', road: 'Bar Rd', suburb: 'Fitzroy', postcode: '3065' }),
      '12 Baz Ave',
    );
    expect(result).toMatchObject({
      houseNumber: '5',
      streetName: 'Bar Rd',
      suburb: 'Fitzroy',
      postcode: '3065',
    });
  });

  it('falls back to a leading number in the display name', () => {
    expect(toAddressSuggestion(place('12, Smith Street, Fitzroy')).houseNumber).toBe('12');
  });

  it('falls back to the number typed in the query', () => {
    expect(
      toAddressSuggestion(place('Smith Street, Fitzroy'), '34 Long Road').houseNumber,
    ).toBe('34');
  });

  it('prefers the display-name number over the typed query number', () => {
    expect(
      toAddressSuggestion(place('12, Smith Street'), '34 Long Road').houseNumber,
    ).toBe('12');
  });
});

describe('toAddressSuggestion — unit number', () => {
  it('reads a unit from the typed query and strips the house number with it', () => {
    const result = toAddressSuggestion(place('Smith Street'), '3/45 Smith Street');
    expect(result).toMatchObject({ unitNumber: '3', houseNumber: '45' });
  });

  it('prefers the structured unit over the typed one', () => {
    const result = toAddressSuggestion(place('Smith Street', { unit: '2' }), '3/45 Smith Street');
    expect(result.unitNumber).toBe('2');
  });

  it('normalises spaces inside a hyphenated typed number', () => {
    expect(toAddressSuggestion(place('Smith Street'), '12 - 14 Smith Street').houseNumber).toBe(
      '12-14',
    );
  });
});

describe('toAddressSuggestion — street and suburb precedence', () => {
  it('prefers road, then pedestrian, then footway', () => {
    expect(toAddressSuggestion(place('x', { road: 'R', pedestrian: 'P', footway: 'F' })).streetName).toBe('R');
    expect(toAddressSuggestion(place('x', { pedestrian: 'P', footway: 'F' })).streetName).toBe('P');
    expect(toAddressSuggestion(place('x', { footway: 'F' })).streetName).toBe('F');
  });

  it('prefers suburb, then locality, then town', () => {
    expect(toAddressSuggestion(place('x', { suburb: 'S', locality: 'L', town: 'T' })).suburb).toBe('S');
    expect(toAddressSuggestion(place('x', { locality: 'L', town: 'T' })).suburb).toBe('L');
    expect(toAddressSuggestion(place('x', { town: 'T' })).suburb).toBe('T');
  });

  it('falls through to city, village and municipality', () => {
    expect(toAddressSuggestion(place('x', { city: 'C', village: 'V' })).suburb).toBe('C');
    expect(toAddressSuggestion(place('x', { village: 'V' })).suburb).toBe('V');
    expect(toAddressSuggestion(place('x', { municipality: 'M' })).suburb).toBe('M');
  });
});

describe('toAddressSuggestion — empty input', () => {
  it('returns an empty display name and undefined optional fields', () => {
    expect(toAddressSuggestion({})).toEqual({
      displayName: '',
      unitNumber: undefined,
      houseNumber: undefined,
      streetName: undefined,
      suburb: undefined,
      postcode: undefined,
    });
  });
});

describe('fetchAddressSuggestions', () => {
  const signal = new AbortController().signal;

  it('maps a successful Nominatim response to suggestions', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => [
        { display_name: '1 A Street, Fitzroy', address: { house_number: '1', road: 'A Street' } },
      ],
    });
    vi.stubGlobal('fetch', mockFetch);

    const results = await fetchAddressSuggestions('1 A Street', signal);

    expect(results).toEqual([
      {
        displayName: '1 A Street, Fitzroy',
        unitNumber: undefined,
        houseNumber: '1',
        streetName: 'A Street',
        suburb: undefined,
        postcode: undefined,
      },
    ]);
  });

  it('queries the Nominatim endpoint with the expected parameters', async () => {
    const mockFetch = vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => [] });
    vi.stubGlobal('fetch', mockFetch);

    await fetchAddressSuggestions('12 Foo Bar', signal);

    const [url, init] = mockFetch.mock.calls[0] as [string, RequestInit];
    expect(url).toContain('https://nominatim.openstreetmap.org/search');
    expect(url).toContain('format=json');
    expect(url).toContain('addressdetails=1');
    expect(url).toContain('countrycodes=au');
    expect(url).toContain('limit=5');
    expect(url).toContain(`q=${encodeURIComponent('12 Foo Bar')}`);
    expect(init.signal).toBe(signal);
    expect(init.headers).toEqual({ Accept: 'application/json' });
  });

  it('reports a 429 as "rate-limited"', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 429, json: async () => [] }));

    await expect(fetchAddressSuggestions('x', signal)).rejects.toThrow('rate-limited');
  });

  it('reports any other non-ok response with its status', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500, json: async () => [] }));

    await expect(fetchAddressSuggestions('x', signal)).rejects.toThrow('Address lookup failed (500)');
  });
});
