import { describe, it, expect } from 'vitest';
import {
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
} from './validation';

describe('formatPhone', () => {
  it.each<[string, string]>([
    ['', ''],
    ['04', '04'],
    ['0412', '0412'],
    ['04123', '0412 3'],
    ['0412345', '0412 345'],
    ['04123456', '0412 345 6'],
    ['0412345678', '0412 345 678'],
  ])('formats %j as %j', (input, expected) => {
    expect(formatPhone(input)).toBe(expected);
  });

  it('drops digits beyond the ten-digit mobile length', () => {
    expect(formatPhone('041234567890')).toBe('0412 345 678');
  });
});

describe('todayIso', () => {
  it('returns an ISO date (yyyy-mm-dd)', () => {
    expect(todayIso()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

describe('validateName', () => {
  it.each<[string, string | undefined]>([
    ['', 'This field is required'],
    ['   ', 'This field is required'],
    ['Jane', undefined],
  ])('validates %j', (input, expected) => {
    expect(validateName(input)).toBe(expected);
  });
});

describe('validateEmail', () => {
  it.each<[string, string | undefined]>([
    ['', 'Email is required'],
    ['   ', 'Email is required'],
    ['jane@example.com', undefined],
    ['  jane@example.com  ', undefined],
    ['jane@example', 'Please enter a valid email address'],
    ['no-at-sign.com', 'Please enter a valid email address'],
    ['two words@example.com', 'Please enter a valid email address'],
  ])('validates %j', (input, expected) => {
    expect(validateEmail(input)).toBe(expected);
  });
});

describe('validatePhone', () => {
  it.each<[string, string | undefined]>([
    ['', 'Phone number is required'],
    ['   ', 'Phone number is required'],
    ['0412345678', undefined],
    ['0412 345 678', undefined],
    ['041234567', 'Enter a valid mobile number (e.g. 04xx xxx xxx)'],
    ['0312345678', 'Enter a valid mobile number (e.g. 04xx xxx xxx)'],
    ['04123456789', 'Enter a valid mobile number (e.g. 04xx xxx xxx)'],
  ])('validates %j', (input, expected) => {
    expect(validatePhone(input)).toBe(expected);
  });
});

describe('validateDob', () => {
  it.each<[string, string | undefined]>([
    ['', 'Date of birth is required'],
    ['2020-05-01', undefined],
  ])('validates %j', (input, expected) => {
    expect(validateDob(input)).toBe(expected);
  });
});

describe('validatePassword', () => {
  it.each<[string, string | undefined]>([
    ['', 'Use a password of at least 8 characters.'],
    ['short', 'Use a password of at least 8 characters.'],
    ['12345678', undefined],
  ])('validates %j', (input, expected) => {
    expect(validatePassword(input)).toBe(expected);
  });
});

describe('validateConfirmPassword', () => {
  it.each<[string, string, string | undefined]>([
    ['secret12', 'secret12', undefined],
    ['', '', undefined],
    ['secret12', 'secret13', 'Passwords do not match.'],
  ])('validates %j against %j', (password, confirm, expected) => {
    expect(validateConfirmPassword(password, confirm)).toBe(expected);
  });
});

describe('validateHouseNumber', () => {
  it.each<[string, string | undefined]>([
    ['', 'Street number is required'],
    ['   ', 'Street number is required'],
    ['12', undefined],
    ['12A', undefined],
    ['12-14', undefined],
    ['12 - 14', undefined],
    ['12A-14B', undefined],
    ['abc', 'Enter a valid street number (e.g. 12 or 12A)'],
    ['12A3', 'Enter a valid street number (e.g. 12 or 12A)'],
  ])('validates %j', (input, expected) => {
    expect(validateHouseNumber(input)).toBe(expected);
  });
});

describe('validateStreetName', () => {
  it.each<[string, string | undefined]>([
    ['', 'Street name is required'],
    ['Smith', undefined],
    ['Smith Street', undefined],
    ['12 Smith', 'Enter a street name without a number'],
  ])('validates %j', (input, expected) => {
    expect(validateStreetName(input)).toBe(expected);
  });
});

describe('validateSuburb', () => {
  it.each<[string, string | undefined]>([
    ['', 'Suburb is required'],
    ['Maribyrnong', undefined],
    ['St Kilda', undefined],
    ["O'Halloran", undefined],
    ['Suburb1', 'Enter a valid suburb'],
  ])('validates %j', (input, expected) => {
    expect(validateSuburb(input)).toBe(expected);
  });
});

describe('validatePostcode', () => {
  it.each<[string, string | undefined]>([
    ['', 'Postcode is required'],
    ['3032', undefined],
    ['303', 'Enter a valid 4-digit postcode'],
    ['30322', 'Enter a valid 4-digit postcode'],
    ['ABCD', 'Enter a valid 4-digit postcode'],
  ])('validates %j', (input, expected) => {
    expect(validatePostcode(input)).toBe(expected);
  });
});
