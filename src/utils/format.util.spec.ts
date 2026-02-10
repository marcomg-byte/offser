import { describe, it, expect } from 'vitest';
import { capitalizeWord, capitalizeString, formatDate } from './format.util.js';

describe('format.util', () => {
  describe('capitalizeWord', () => {
    it('should capitalize a single word correctly', () => {
      expect(capitalizeWord('hello')).toBe('Hello');
      expect(capitalizeWord('world')).toBe('World');
      expect(capitalizeWord('test')).toBe('Test');
    });

    it('should capitalize and lowercase rest for uppercase words', () => {
      expect(capitalizeWord('HELLO')).toBe('Hello');
      expect(capitalizeWord('WORLD')).toBe('World');
      expect(capitalizeWord('JAVASCRIPT')).toBe('Javascript');
    });

    it('should normalize mixed case words', () => {
      expect(capitalizeWord('hElLo')).toBe('Hello');
      expect(capitalizeWord('wOrLd')).toBe('World');
      expect(capitalizeWord('jAvAsCrIpT')).toBe('Javascript');
    });

    it('should handle single character', () => {
      expect(capitalizeWord('a')).toBe('A');
      expect(capitalizeWord('Z')).toBe('Z');
    });

    it('should handle empty string', () => {
      expect(capitalizeWord('')).toBe('');
    });

    it('should preserve numbers and special characters', () => {
      expect(capitalizeWord('123abc')).toBe('123abc');
      expect(capitalizeWord('!@#hello')).toBe('!@#hello');
      expect(capitalizeWord('hello!@#')).toBe('Hello!@#');
    });

    it('should handle words starting with special characters', () => {
      expect(capitalizeWord('#hashtag')).toBe('#hashtag');
      expect(capitalizeWord('@mention')).toBe('@mention');
      expect(capitalizeWord('$dollar')).toBe('$dollar');
    });
  });

  describe('capitalizeString', () => {
    it('should capitalize first letter of each word', () => {
      expect(capitalizeString('hello world')).toBe('Hello World');
      expect(
        capitalizeString('these are not the droids you are looking for'),
      ).toBe('These Are Not The Droids You Are Looking For');
      expect(capitalizeString('internal server error')).toBe(
        'Internal Server Error',
      );
    });

    it('should handle all uppercase strings', () => {
      expect(capitalizeString('HELLO WORLD')).toBe('Hello World');
      expect(capitalizeString('INTERNAL SERVER ERROR')).toBe(
        'Internal Server Error',
      );
      expect(capitalizeString('THE BROWN FOX')).toBe('The Brown Fox');
    });

    it('should normalize mixed case strings', () => {
      expect(capitalizeString('hElLo wOrLd')).toBe('Hello World');
      expect(capitalizeString('iNtErNaL sErVeR eRrOr')).toBe(
        'Internal Server Error',
      );
      expect(capitalizeString('uPpEr cAsE mIxEd')).toBe('Upper Case Mixed');
    });

    it('should handle single words', () => {
      expect(capitalizeString('hello')).toBe('Hello');
      expect(capitalizeString('world')).toBe('World');
      expect(capitalizeString('sith')).toBe('Sith');
    });

    it('should handle empty strings', () => {
      expect(capitalizeString('')).toBe('');
    });

    it('should preserve multiple consecutive spaces', () => {
      expect(capitalizeString('hello   world')).toBe('Hello   World');
      expect(capitalizeString('this  is   a    test')).toBe(
        'This  Is   A    Test',
      );
    });

    it('should handle leading spaces', () => {
      expect(capitalizeString('  hello world')).toBe('  Hello World');
      expect(capitalizeString('    this is a test')).toBe('    This Is A Test');
    });

    it('should handle trailing spaces', () => {
      expect(capitalizeString('hello world  ')).toBe('Hello World  ');
      expect(capitalizeString('this is a test    ')).toBe('This Is A Test    ');
    });

    it('should handle special characters in words', () => {
      expect(capitalizeString('hello@world')).toBe('Hello@world');
      expect(capitalizeString('this_is_a_test')).toBe('This_is_a_test');
      expect(capitalizeString('death_star')).toBe('Death_star');
    });

    it('should handle numbers in strings', () => {
      expect(capitalizeString('version 2.0')).toBe('Version 2.0');
      expect(capitalizeString('error code 404')).toBe('Error Code 404');
      expect(capitalizeString('the year is 2024')).toBe('The Year Is 2024');
    });
  });

  describe('formatDate', () => {
    it('should format date in MM-DD-YYYY HH:mm:ss format', () => {
      const date = new Date('2024-02-05T09:07:03Z');
      const result = formatDate(date);

      expect(result).toMatch(/^\d{2}-\d{2}-\d{4} \d{2}:\d{2}:\d{2}$/);
    });

    it('should pad single-digit months with leading zero', () => {
      const date = new Date('2024-01-15T12:00:00Z');
      const result = formatDate(date);

      expect(result).toMatch(/^01-/);
    });

    it('should pad single-digit days with leading zero', () => {
      const date = new Date('2024-12-05T12:00:00Z');
      const result = formatDate(date);

      expect(result).toMatch(/-05-/);
    });

    it('should pad single-digit hours with leading zero', () => {
      const date = new Date(2024, 0, 1, 9, 30, 45);
      const result = formatDate(date);

      expect(result).toContain(' 09:');
    });

    it('should pad single-digit minutes with leading zero', () => {
      const date = new Date(2024, 0, 1, 12, 5, 30);
      const result = formatDate(date);

      expect(result).toContain(':05:');
    });

    it('should pad single-digit seconds with leading zero', () => {
      const date = new Date(2024, 0, 1, 12, 30, 7);
      const result = formatDate(date);

      expect(result).toContain(':07');
    });

    it('should handle midnight (00:00:00)', () => {
      const date = new Date(2024, 0, 1, 0, 0, 0);
      const result = formatDate(date);

      expect(result).toContain(' 00:00:00');
    });

    it('should handle noon (12:00:00)', () => {
      const date = new Date(2024, 0, 1, 12, 0, 0);
      const result = formatDate(date);

      expect(result).toContain(' 12:00:00');
    });

    it('should handle end of day (23:59:59)', () => {
      const date = new Date(2024, 0, 1, 23, 59, 59);
      const result = formatDate(date);

      expect(result).toContain(' 23:59:59');
    });

    it('should handle December (month 12)', () => {
      const date = new Date(2024, 11, 25, 12, 0, 0);
      const result = formatDate(date);

      expect(result).toMatch(/^12-/);
    });

    it('should handle end of month dates', () => {
      const date = new Date(2024, 0, 31, 12, 0, 0);
      const result = formatDate(date);

      expect(result).toMatch(/-31-/);
    });

    it('should handle leap year date', () => {
      const date = new Date(2024, 1, 29, 12, 0, 0);
      const result = formatDate(date);

      expect(result).toMatch(/^02-29-2024/);
    });

    it('should format complete date correctly', () => {
      const date = new Date(2024, 1, 5, 9, 7, 3); // Feb 5, 2024, 09:07:03
      const result = formatDate(date);

      expect(result).toBe('02-05-2024 09:07:03');
    });

    it('should handle year boundaries', () => {
      const newYear = new Date(2024, 0, 1, 0, 0, 1);
      const result = formatDate(newYear);

      expect(result).toBe('01-01-2024 00:00:01');
    });
  });
});
