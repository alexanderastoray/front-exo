/**
 * useExpenseReports Hook
 * Fetches and manages expense reports data
 */

import { useState, useEffect } from 'react';
import { expenseReportsApi } from '../api/expense-reports.api';
import { ExpenseReport } from '../types/expense-report.types';

interface UseExpenseReportsReturn {
  reports: ExpenseReport[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useExpenseReports(): UseExpenseReportsReturn {
  const [reports, setReports] = useState<ExpenseReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await expenseReportsApi.getAll();
      
      // Fetch expenses for each report
      const reportsWithExpenses = await Promise.all(
        data.map(async (report) => {
          try {
            const expenses = await expenseReportsApi.getExpenses(report.id);
            return { ...report, expenses };
          } catch {
            return report;
          }
        })
      );
      
      setReports(reportsWithExpenses);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch reports'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return {
    reports,
    loading,
    error,
    refetch: fetchReports,
  };
}
