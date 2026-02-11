/**
 * Expense Reports API Client
 * API calls for expense reports
 */

import { apiClient } from './client';
import { ExpenseReport, PaginatedResponse } from '../types/expense-report.types';

export const expenseReportsApi = {
  /**
   * Get all expense reports
   */
  getAll: async (): Promise<ExpenseReport[]> => {
    const response = await apiClient.get<PaginatedResponse<ExpenseReport>>('/expense-reports');
    return response.data.data;
  },

  /**
   * Get a single expense report by ID
   */
  getById: async (id: string): Promise<ExpenseReport> => {
    const response = await apiClient.get<{ data: ExpenseReport }>(`/expense-reports/${id}`);
    return response.data.data;
  },

  /**
   * Get expenses for a specific report
   */
  getExpenses: async (reportId: string) => {
    const response = await apiClient.get(`/expense-reports/${reportId}/expenses`);
    return response.data.data;
  },

  /**
   * Submit a report
   */
  submit: async (id: string): Promise<ExpenseReport> => {
    const response = await apiClient.patch<{ data: ExpenseReport }>(`/expense-reports/${id}/submit`);
    return response.data.data;
  },

  /**
   * Delete a report
   */
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/expense-reports/${id}`);
  },
};
