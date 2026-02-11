/**
 * Expenses API Client
 * API calls for expenses
 */

import { apiClient } from './client';
import { Expense } from '../types/expense-report.types';

export const expensesApi = {
  /**
   * Get a single expense by ID
   */
  getById: async (id: string): Promise<Expense> => {
    const response = await apiClient.get<{ data: Expense }>(`/expenses/${id}`);
    return response.data.data;
  },

  /**
   * Create a new expense
   */
  create: async (data: {
    reportId: string;
    category: string;
    expenseName?: string;
    description?: string;
    amount: number;
    expenseDate: string;
  }): Promise<Expense> => {
    const response = await apiClient.post<{ data: Expense }>('/expenses', data);
    return response.data.data;
  },

  /**
   * Update an expense
   */
  update: async (
    id: string,
    data: {
      category?: string;
      expenseName?: string;
      description?: string;
      amount?: number;
      expenseDate?: string;
    }
  ): Promise<Expense> => {
    const response = await apiClient.patch<{ data: Expense }>(`/expenses/${id}`, data);
    return response.data.data;
  },

  /**
   * Delete an expense
   */
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/expenses/${id}`);
  },
};
