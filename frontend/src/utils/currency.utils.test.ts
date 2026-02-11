import { describe, it, expect } from 'vitest';
import { formatCurrency } from './currency.utils';

describe('currency.utils', () => {
  describe('formatCurrency', () => {
    it('should format positive amounts correctly', () => {
      expect(formatCurrency(100)).toBe('$100.00');
      expect(formatCurrency(1234.56)).toBe('$1,234.56');
      expect(formatCurrency(0.99)).toBe('$0.99');
    });

    it('should format zero correctly', () => {
      expect(formatCurrency(0)).toBe('$0.00');
    });

    it('should format negative amounts correctly', () => {
      expect(formatCurrency(-50)).toBe('-$50.00');
      expect(formatCurrency(-1234.56)).toBe('-$1,234.56');
    });

    it('should format large amounts with thousands separators', () => {
      expect(formatCurrency(1000000)).toBe('$1,000,000.00');
      expect(formatCurrency(999999.99)).toBe('$999,999.99');
    });

    it('should round to two decimal places', () => {
      expect(formatCurrency(10.999)).toBe('$11.00');
      expect(formatCurrency(10.001)).toBe('$10.00');
      expect(formatCurrency(10.555)).toBe('$10.56');
    });
  });
});
