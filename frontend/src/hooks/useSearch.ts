/**
 * useSearch Hook
 * Manages search functionality with debouncing
 */

import { useState } from 'react';
import { useDebounce } from './useDebounce';
import { ExpenseReport } from '../types/expense-report.types';

interface UseSearchReturn {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  debouncedSearchTerm: string;
  applySearch: (reports: ExpenseReport[]) => ExpenseReport[];
}

export function useSearch(): UseSearchReturn {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const applySearch = (reports: ExpenseReport[]): ExpenseReport[] => {
    if (!debouncedSearchTerm.trim()) {
      return reports;
    }

    const term = debouncedSearchTerm.toLowerCase();
    return reports.filter((report) => {
      // Search in purpose
      if (report.purpose.toLowerCase().includes(term)) {
        return true;
      }

      // Search in expenses
      if (report.expenses) {
        return report.expenses.some(
          (expense) =>
            expense.expenseName?.toLowerCase().includes(term) ||
            expense.description?.toLowerCase().includes(term)
        );
      }

      return false;
    });
  };

  return {
    searchTerm,
    setSearchTerm,
    debouncedSearchTerm,
    applySearch,
  };
}
