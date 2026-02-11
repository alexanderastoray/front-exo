import { describe, it, expect } from 'vitest';
import { formatDate, formatDateInput, parseDateInput } from './date.utils';

describe('date.utils', () => {
  describe('formatDate', () => {
    it('should format Date objects correctly', () => {
      const date = new Date('2026-02-10T15:30:00.000Z');
      const formatted = formatDate(date);
      expect(formatted).toMatch(/Feb 10, 2026/);
    });

    it('should format ISO date strings correctly', () => {
      const formatted = formatDate('2026-02-10T15:30:00.000Z');
      expect(formatted).toMatch(/Feb 10, 2026/);
    });

    it('should handle different date formats', () => {
      const formatted = formatDate('2026-12-25');
      expect(formatted).toMatch(/Dec 25, 2026/);
    });
  });

  describe('formatDateInput', () => {
    it('should format Date objects to YYYY-MM-DD', () => {
      const date = new Date('2026-02-10T15:30:00.000Z');
      expect(formatDateInput(date)).toBe('2026-02-10');
    });

    it('should return empty string for null', () => {
      expect(formatDateInput(null)).toBe('');
    });

    it('should handle dates at different times of day', () => {
      const date = new Date('2026-12-25T23:59:59.999Z');
      const formatted = formatDateInput(date);
      expect(formatted).toMatch(/2026-12-2[56]/); // Could be 25 or 26 depending on timezone
    });
  });

  describe('parseDateInput', () => {
    it('should parse YYYY-MM-DD strings to Date objects', () => {
      const date = parseDateInput('2026-02-10');
      expect(date).toBeInstanceOf(Date);
      expect(date?.getFullYear()).toBe(2026);
      expect(date?.getMonth()).toBe(1); // February is month 1 (0-indexed)
      expect(date?.getDate()).toBe(10);
    });

    it('should return null for empty string', () => {
      expect(parseDateInput('')).toBeNull();
    });

    it('should handle ISO date strings', () => {
      const date = parseDateInput('2026-12-25T00:00:00.000Z');
      expect(date).toBeInstanceOf(Date);
      expect(date?.getFullYear()).toBe(2026);
    });
  });
});
