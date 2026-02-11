/**
 * Category Utilities
 * Helper functions for category handling
 */

import { ExpenseCategory } from '../types/expense-report.types';
import { CATEGORY_ICONS, CATEGORY_LABELS } from '../constants/categories';

export const getCategoryIcon = (category: ExpenseCategory): string => {
  return CATEGORY_ICONS[category] || 'receipt';
};

export const getCategoryLabel = (category: ExpenseCategory): string => {
  return CATEGORY_LABELS[category] || category;
};
