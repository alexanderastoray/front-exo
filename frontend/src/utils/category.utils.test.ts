import { describe, it, expect } from 'vitest';
import { getCategoryIcon, getCategoryLabel } from './category.utils';
import { ExpenseCategory } from '../types/expense-report.types';

describe('category.utils', () => {
  describe('getCategoryIcon', () => {
    it('should return correct icon for MEALS category', () => {
      expect(getCategoryIcon(ExpenseCategory.MEALS)).toBe('restaurant');
    });

    it('should return correct icon for TRAVEL category', () => {
      expect(getCategoryIcon(ExpenseCategory.TRAVEL)).toBe('flight');
    });

    it('should return correct icon for OFFICE_SUPPLIES category', () => {
      expect(getCategoryIcon(ExpenseCategory.OFFICE_SUPPLIES)).toBe('shopping_cart');
    });

    it('should return correct icon for TRANSPORT category', () => {
      expect(getCategoryIcon(ExpenseCategory.TRANSPORT)).toBe('local_parking');
    });

    it('should return correct icon for ACCOMMODATION category', () => {
      expect(getCategoryIcon(ExpenseCategory.ACCOMMODATION)).toBe('hotel');
    });

    it('should return correct icon for COMMUNICATION category', () => {
      expect(getCategoryIcon(ExpenseCategory.COMMUNICATION)).toBe('phone');
    });

    it('should return correct icon for OTHER category', () => {
      expect(getCategoryIcon(ExpenseCategory.OTHER)).toBe('groups');
    });

    it('should return default icon for unknown category', () => {
      expect(getCategoryIcon('UNKNOWN' as ExpenseCategory)).toBe('receipt');
    });
  });

  describe('getCategoryLabel', () => {
    it('should return correct label for MEALS category', () => {
      expect(getCategoryLabel(ExpenseCategory.MEALS)).toBe('Meals');
    });

    it('should return correct label for TRAVEL category', () => {
      expect(getCategoryLabel(ExpenseCategory.TRAVEL)).toBe('Travel');
    });

    it('should return correct label for OFFICE_SUPPLIES category', () => {
      expect(getCategoryLabel(ExpenseCategory.OFFICE_SUPPLIES)).toBe('Supplies');
    });

    it('should return correct label for TRANSPORT category', () => {
      expect(getCategoryLabel(ExpenseCategory.TRANSPORT)).toBe('Parking');
    });

    it('should return correct label for ACCOMMODATION category', () => {
      expect(getCategoryLabel(ExpenseCategory.ACCOMMODATION)).toBe('Hotel');
    });

    it('should return correct label for COMMUNICATION category', () => {
      expect(getCategoryLabel(ExpenseCategory.COMMUNICATION)).toBe('Phone');
    });

    it('should return correct label for OTHER category', () => {
      expect(getCategoryLabel(ExpenseCategory.OTHER)).toBe('Team Event');
    });

    it('should return category name for unknown category', () => {
      const unknownCategory = 'UNKNOWN' as ExpenseCategory;
      expect(getCategoryLabel(unknownCategory)).toBe(unknownCategory);
    });
  });
});
