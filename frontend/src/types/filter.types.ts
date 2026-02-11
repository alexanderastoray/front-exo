/**
 * Filter Types
 * For expense reports filtering and sorting
 */

import { ReportStatus, ExpenseCategory } from './expense-report.types';

export interface FilterState {
  status: ReportStatus[];
  dateFrom: Date | null;
  dateTo: Date | null;
  amountMin: number;
  amountMax: number;
  categories: ExpenseCategory[];
  sortBy: 'date' | 'amount';
  sortOrder: 'asc' | 'desc';
}

export type FilterKey = keyof FilterState;

export const DEFAULT_FILTERS: FilterState = {
  status: [],
  dateFrom: null,
  dateTo: null,
  amountMin: 0,
  amountMax: 1000,
  categories: [],
  sortBy: 'date',
  sortOrder: 'desc',
};
