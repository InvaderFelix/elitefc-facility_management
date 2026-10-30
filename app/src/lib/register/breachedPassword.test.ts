import { describe, it, expect, vi, beforeEach } from 'vitest';
import { webcrypto } from 'node:crypto';
import {
  isPasswordBreached,
  parseRangeResponse,
  pwnedCount,
  sha1Hex,
} from './breachedPassword';

/* jsdom's crypto does not always expose SubtleCrypto; use Node's. */
vi.stubGlobal('crypto', webcrypto);

describe('parseRangeResponse', () => {
  const body = [
    '0018A45C4D1DEF81644B54AB7F969B88D65:1',
    '00D4F6E8FA6EECAD2A3AA415EEC418D38EC:2',
    'ABCDEF0123456789ABCDEF0123456789ABC:42',
  ].join('\r\n');

  it('returns the count for a matching suffix', () => {
    expect(parseRangeResponse(body, 'ABCDEF0123456789ABCDEF0123456789ABC')).toBe(42);
  });

  it('matches case-insensitively', () => {
    expect(parseRangeResponse(body, 'abcdef0123456789abcdef0123456789abc')).toBe(42);
  });

  it('returns 0 when the suffix is absent', () => {
    expect(parseRangeResponse(body, '0000000000000000000000000000000000')).toBe(0);
  });

  it('ignores malformed lines', () => {
    expect(parseRangeResponse('not-a-line\n\nABC:not-a-number', 'ABC')).toBe(0);
  });
});

describe('sha1Hex', () => {
  it('hashes to uppercase hex', async () => {
    expect(await sha1Hex('password')).toBe('5BAA61E4C9B93F3F0682250B6CF8331B7EE68FD8');
  });
});

describe('pwnedCount', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('queries only the five-character hash prefix', async () => {
    const hash = await sha1Hex('password');
    const fetchMock = vi.fn(async () => new Response(`${hash.slice(5)}:7`));
    vi.stubGlobal('fetch', fetchMock);

    await pwnedCount('password');

    expect(fetchMock).toHaveBeenCalledOnce();
    expect(fetchMock.mock.calls[0][0]).toBe(
      `https://api.pwnedpasswords.com/range/${hash.slice(0, 5)}`,
    );
  });

  it('parses the matching count from the range response', async () => {
    const hash = await sha1Hex('password');
    vi.stubGlobal('fetch', vi.fn(async () => new Response(`${hash.slice(5)}:7`)));

    expect(await pwnedCount('password')).toBe(7);
  });

  it('throws when the lookup fails', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response('', { status: 503 })));

    await expect(pwnedCount('password')).rejects.toThrow('503');
  });
});

describe('isPasswordBreached', () => {
  it('is true when the password appears in the corpus', async () => {
    const hash = await sha1Hex('password');
    vi.stubGlobal('fetch', vi.fn(async () => new Response(`${hash.slice(5)}:1`)));

    expect(await isPasswordBreached('password')).toBe(true);
  });

  it('is false for an unknown password', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response('DEADBEEF:5')));

    expect(await isPasswordBreached('password')).toBe(false);
  });

  it('fails open when the network is unavailable', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.stubGlobal('fetch', vi.fn(async () => Promise.reject(new Error('offline'))));

    expect(await isPasswordBreached('password')).toBe(false);
  });
});
