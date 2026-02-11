/**
 * Expense Report Types
 * Matching backend entities
 */

export enum ReportStatus {
  CREATED = 'CREATED',
  SUBMITTED = 'SUBMITTED',
  VALIDATED = 'VALIDATED',
  REJECTED = 'REJECTED',
  PAID = 'PAID',
}

export enum ExpenseCategory {
  TRAVEL = 'TRAVEL',
  MEALS = 'MEALS',
  ACCOMMODATION = 'ACCOMMODATION',
  TRANSPORT = 'TRANSPORT',
  OFFICE_SUPPLIES = 'OFFICE_SUPPLIES',
  COMMUNICATION = 'COMMUNICATION',
  OTHER = 'OTHER',
}

export enum ExpenseStatus {
  CREATED = 'CREATED',
  SUBMITTED = 'SUBMITTED',
  VALIDATED = 'VALIDATED',
  REJECTED = 'REJECTED',
  PAID = 'PAID',
}

export interface Expense {
  id: string;
  reportId: string;
  category: ExpenseCategory;
  expenseName: string | null;
  description: string | null;
  amount: number;
  expenseDate: string;
  status: ExpenseStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ExpenseReport {
  id: string;
  purpose: string;
  reportDate: string;
  totalAmount: number;
  status: ReportStatus;
  paymentDate: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
  expenses?: Expense[];
}

export interface ExpenseReportWithCategories extends ExpenseReport {
  categories: ExpenseCategory[];
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
