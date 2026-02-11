/**
 * useExpense Hook
 * Fetch a single expense by ID
 */

import { useState, useEffect } from 'react';
import { expensesApi } from '../api/expenses.api';
import { Expense } from '../types/expense-report.types';

export function useExpense(expenseId: string | undefined) {
  const [expense, setExpense] = useState<Expense | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!expenseId) {
      setExpense(null);
      setLoading(false);
      return;
    }

    const fetchExpense = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await expensesApi.getById(expenseId);
        setExpense(data);
      } catch (err) {
        setError(err as Error);
        console.error('Error fetching expense:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchExpense();
  }, [expenseId]);

  return { expense, loading, error };
}
