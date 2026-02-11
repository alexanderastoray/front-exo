/**
 * useExpenseDetails Hook
 * Fetches and manages expense details data
 */

import { useState, useEffect } from 'react';
import { expensesApi } from '../api/expenses.api';
import { Expense } from '../types/expense-report.types';

export function useExpenseDetails(expenseId: string) {
  const [expense, setExpense] = useState<Expense | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchExpenseDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await expensesApi.getById(expenseId);
        setExpense(data);
      } catch (err) {
        setError(new Error('Failed to fetch expense details'));
        console.error('Error fetching expense details:', err);
      } finally {
        setLoading(false);
      }
    };

    if (expenseId) {
      fetchExpenseDetails();
    } else {
      setLoading(false);
    }
  }, [expenseId]);

  return { expense, loading, error };
}
