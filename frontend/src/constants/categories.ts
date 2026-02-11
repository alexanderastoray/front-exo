/**
 * Category Constants
 * Mapping between categories and their display properties
 */

import { ExpenseCategory } from '../types/expense-report.types';

export const CATEGORY_ICONS: Record<ExpenseCategory, string> = {
  [ExpenseCategory.MEALS]: 'restaurant',
  [ExpenseCategory.TRAVEL]: 'flight',
  [ExpenseCategory.OFFICE_SUPPLIES]: 'shopping_cart',
  [ExpenseCategory.TRANSPORT]: 'local_parking',
  [ExpenseCategory.ACCOMMODATION]: 'hotel',
  [ExpenseCategory.COMMUNICATION]: 'phone',
  [ExpenseCategory.OTHER]: 'groups',
};

export const CATEGORY_LABELS: Record<ExpenseCategory, string> = {
  [ExpenseCategory.MEALS]: 'Meals',
  [ExpenseCategory.TRAVEL]: 'Travel',
  [ExpenseCategory.OFFICE_SUPPLIES]: 'Supplies',
  [ExpenseCategory.TRANSPORT]: 'Parking',
  [ExpenseCategory.ACCOMMODATION]: 'Hotel',
  [ExpenseCategory.COMMUNICATION]: 'Phone',
  [ExpenseCategory.OTHER]: 'Team Event',
};

export const FILTER_CATEGORIES = [
  { value: ExpenseCategory.MEALS, label: CATEGORY_LABELS[ExpenseCategory.MEALS], icon: CATEGORY_ICONS[ExpenseCategory.MEALS] },
  { value: ExpenseCategory.TRAVEL, label: CATEGORY_LABELS[ExpenseCategory.TRAVEL], icon: CATEGORY_ICONS[ExpenseCategory.TRAVEL] },
  { value: ExpenseCategory.OFFICE_SUPPLIES, label: CATEGORY_LABELS[ExpenseCategory.OFFICE_SUPPLIES], icon: CATEGORY_ICONS[ExpenseCategory.OFFICE_SUPPLIES] },
  { value: ExpenseCategory.OTHER, label: CATEGORY_LABELS[ExpenseCategory.OTHER], icon: CATEGORY_ICONS[ExpenseCategory.OTHER] },
  { value: ExpenseCategory.TRANSPORT, label: CATEGORY_LABELS[ExpenseCategory.TRANSPORT], icon: CATEGORY_ICONS[ExpenseCategory.TRANSPORT] },
];
