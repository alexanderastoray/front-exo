/**
 * useExpenseReportDetails Hook
 * Fetch expense report details and its expenses
 */

import { useState, useEffect } from 'react';
import { expenseReportsApi } from '../api/expense-reports.api';
import { ExpenseReport, Expense } from '../types/expense-report.types';

export function useExpenseReportDetails(reportId: string) {
  const [report, setReport] = useState<ExpenseReport | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchReportDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch report details and expenses in parallel
        const [reportData, expensesData] = await Promise.all([
          expenseReportsApi.getById(reportId),
          expenseReportsApi.getExpenses(reportId),
        ]);

        setReport(reportData);
        setExpenses(expensesData);
      } catch (err) {
        setError(err as Error);
        console.error('Error fetching report details:', err);
      } finally {
        setLoading(false);
      }
    };

    if (reportId) {
      fetchReportDetails();
    } else {
      setLoading(false);
    }
  }, [reportId]);

  return { report, expenses, loading, error };
}
