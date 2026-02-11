/**
 * useFilters Hook
 * Manages filtering and sorting of expense reports
 */

import { useState, useMemo } from 'react';
import { FilterState, FilterKey, DEFAULT_FILTERS } from '../types/filter.types';
import { ExpenseReport } from '../types/expense-report.types';

interface UseFiltersReturn {
  filters: FilterState;
  setFilter: <K extends FilterKey>(key: K, value: FilterState[K]) => void;
  clearFilters: () => void;
  applyFilters: (reports: ExpenseReport[]) => ExpenseReport[];
  activeFilterCount: number;
}

export function useFilters(): UseFiltersReturn {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  const setFilter = <K extends FilterKey>(key: K, value: FilterState[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      status: [],
      dateFrom: null,
      dateTo: null,
      amountMin: 0,
      amountMax: 1000,
      categories: [],
      sortBy: 'date',
      sortOrder: 'desc',
    });
  };

  const applyFilters = (reports: ExpenseReport[]): ExpenseReport[] => {
    let filtered = [...reports];

    // Filter by status
    if (filters.status.length > 0) {
      filtered = filtered.filter((r) => filters.status.includes(r.status));
    }

    // Filter by date range
    if (filters.dateFrom) {
      filtered = filtered.filter(
        (r) => new Date(r.reportDate) >= filters.dateFrom!
      );
    }
    if (filters.dateTo) {
      filtered = filtered.filter(
        (r) => new Date(r.reportDate) <= filters.dateTo!
      );
    }

    // Filter by amount range
    filtered = filtered.filter(
      (r) =>
        r.totalAmount >= filters.amountMin &&
        r.totalAmount <= filters.amountMax
    );

    // Filter by categories
    if (filters.categories.length > 0) {
      filtered = filtered.filter((r) =>
        r.expenses?.some((e) => filters.categories.includes(e.category))
      );
    }

    // Sort
    filtered.sort((a, b) => {
      const aValue =
        filters.sortBy === 'date'
          ? new Date(a.reportDate).getTime()
          : a.totalAmount;
      const bValue =
        filters.sortBy === 'date'
          ? new Date(b.reportDate).getTime()
          : b.totalAmount;

      return filters.sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    });

    return filtered;
  };

  const activeFilterCount = useMemo(() => {
    return [
      filters.status.length > 0,
      filters.dateFrom !== null,
      filters.dateTo !== null,
      filters.amountMin > 0 || filters.amountMax < 1000,
      filters.categories.length > 0,
    ].filter(Boolean).length;
  }, [filters]);

  return {
    filters,
    setFilter,
    clearFilters,
    applyFilters,
    activeFilterCount,
  };
}
