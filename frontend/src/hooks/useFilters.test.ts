import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFilters } from './useFilters';
import { ReportStatus, ExpenseCategory, ExpenseStatus } from '../types/expense-report.types';

describe('useFilters', () => {
  const mockReports = [
    {
      id: '1',
      purpose: 'Business Trip',
      reportDate: '2026-02-10',
      totalAmount: 500,
      status: ReportStatus.SUBMITTED,
      paymentDate: null,
      userId: 'user-1',
      createdAt: '2026-02-10T10:00:00.000Z',
      updatedAt: '2026-02-10T10:00:00.000Z',
      expenses: [
        {
          id: 'exp-1',
          reportId: '1',
          category: ExpenseCategory.MEALS,
          expenseName: 'Lunch',
          description: 'Team lunch',
          amount: 100,
          expenseDate: '2026-02-10',
          status: ExpenseStatus.SUBMITTED,
          createdAt: '2026-02-10T10:00:00.000Z',
          updatedAt: '2026-02-10T10:00:00.000Z',
        },
      ],
    },
    {
      id: '2',
      purpose: 'Conference',
      reportDate: '2026-02-15',
      totalAmount: 750,
      status: ReportStatus.VALIDATED,
      paymentDate: null,
      userId: 'user-1',
      createdAt: '2026-02-15T10:00:00.000Z',
      updatedAt: '2026-02-15T10:00:00.000Z',
      expenses: [
        {
          id: 'exp-2',
          reportId: '2',
          category: ExpenseCategory.TRAVEL,
          expenseName: 'Flight',
          description: 'Flight to conference',
          amount: 500,
          expenseDate: '2026-02-15',
          status: ExpenseStatus.VALIDATED,
          createdAt: '2026-02-15T10:00:00.000Z',
          updatedAt: '2026-02-15T10:00:00.000Z',
        },
      ],
    },
    {
      id: '3',
      purpose: 'Office Supplies',
      reportDate: '2026-02-05',
      totalAmount: 200,
      status: ReportStatus.CREATED,
      paymentDate: null,
      userId: 'user-1',
      createdAt: '2026-02-05T10:00:00.000Z',
      updatedAt: '2026-02-05T10:00:00.000Z',
      expenses: [],
    },
  ];

  it('should initialize with default filters', () => {
    const { result } = renderHook(() => useFilters());

    expect(result.current.filters.status).toEqual([]);
    expect(result.current.filters.dateFrom).toBeNull();
    expect(result.current.filters.dateTo).toBeNull();
    expect(result.current.filters.amountMin).toBe(0);
    expect(result.current.filters.amountMax).toBe(1000);
    expect(result.current.filters.categories).toEqual([]);
    expect(result.current.filters.sortBy).toBe('date');
    expect(result.current.filters.sortOrder).toBe('desc');
    expect(result.current.activeFilterCount).toBe(0);
  });

  it('should update individual filter', () => {
    const { result } = renderHook(() => useFilters());

    act(() => {
      result.current.setFilter('status', [ReportStatus.SUBMITTED]);
    });

    expect(result.current.filters.status).toEqual([ReportStatus.SUBMITTED]);
    expect(result.current.activeFilterCount).toBe(1);
  });

  it('should clear all filters', () => {
    const { result } = renderHook(() => useFilters());

    act(() => {
      result.current.setFilter('status', [ReportStatus.SUBMITTED]);
      result.current.setFilter('categories', [ExpenseCategory.MEALS]);
    });

    expect(result.current.activeFilterCount).toBe(2);

    act(() => {
      result.current.clearFilters();
    });

    expect(result.current.filters.status).toEqual([]);
    expect(result.current.filters.categories).toEqual([]);
    expect(result.current.activeFilterCount).toBe(0);
  });

  it('should filter by status', () => {
    const { result } = renderHook(() => useFilters());

    act(() => {
      result.current.setFilter('status', [ReportStatus.SUBMITTED]);
    });

    const filtered = result.current.applyFilters(mockReports);

    expect(filtered).toHaveLength(1);
    expect(filtered[0].id).toBe('1');
  });

  it('should filter by date range', () => {
    const { result } = renderHook(() => useFilters());

    act(() => {
      result.current.setFilter('dateFrom', new Date('2026-02-10'));
      result.current.setFilter('dateTo', new Date('2026-02-15'));
    });

    const filtered = result.current.applyFilters(mockReports);

    expect(filtered).toHaveLength(2);
    // Default sort is by date descending, so '2' (2026-02-15) comes before '1' (2026-02-10)
    expect(filtered.map(r => r.id)).toEqual(['2', '1']);
  });

  it('should filter by amount range', () => {
    const { result } = renderHook(() => useFilters());

    act(() => {
      result.current.setFilter('amountMin', 300);
      result.current.setFilter('amountMax', 600);
    });

    const filtered = result.current.applyFilters(mockReports);

    expect(filtered).toHaveLength(1);
    expect(filtered[0].id).toBe('1');
  });

  it('should filter by categories', () => {
    const { result } = renderHook(() => useFilters());

    act(() => {
      result.current.setFilter('categories', [ExpenseCategory.MEALS]);
    });

    const filtered = result.current.applyFilters(mockReports);

    expect(filtered).toHaveLength(1);
    expect(filtered[0].id).toBe('1');
  });

  it('should sort by date ascending', () => {
    const { result } = renderHook(() => useFilters());

    act(() => {
      result.current.setFilter('sortBy', 'date');
      result.current.setFilter('sortOrder', 'asc');
    });

    const filtered = result.current.applyFilters(mockReports);

    expect(filtered.map(r => r.id)).toEqual(['3', '1', '2']);
  });

  it('should sort by date descending', () => {
    const { result } = renderHook(() => useFilters());

    act(() => {
      result.current.setFilter('sortBy', 'date');
      result.current.setFilter('sortOrder', 'desc');
    });

    const filtered = result.current.applyFilters(mockReports);

    expect(filtered.map(r => r.id)).toEqual(['2', '1', '3']);
  });

  it('should sort by amount ascending', () => {
    const { result } = renderHook(() => useFilters());

    act(() => {
      result.current.setFilter('sortBy', 'amount');
      result.current.setFilter('sortOrder', 'asc');
    });

    const filtered = result.current.applyFilters(mockReports);

    expect(filtered.map(r => r.id)).toEqual(['3', '1', '2']);
  });

  it('should sort by amount descending', () => {
    const { result } = renderHook(() => useFilters());

    act(() => {
      result.current.setFilter('sortBy', 'amount');
      result.current.setFilter('sortOrder', 'desc');
    });

    const filtered = result.current.applyFilters(mockReports);

    expect(filtered.map(r => r.id)).toEqual(['2', '1', '3']);
  });

  it('should apply multiple filters together', () => {
    const { result } = renderHook(() => useFilters());

    act(() => {
      result.current.setFilter('status', [ReportStatus.SUBMITTED, ReportStatus.VALIDATED]);
      result.current.setFilter('amountMin', 400);
    });

    const filtered = result.current.applyFilters(mockReports);

    expect(filtered).toHaveLength(2);
    expect(filtered.map(r => r.id)).toEqual(['2', '1']);
  });

  it('should calculate active filter count correctly', () => {
    const { result } = renderHook(() => useFilters());

    expect(result.current.activeFilterCount).toBe(0);

    act(() => {
      result.current.setFilter('status', [ReportStatus.SUBMITTED]);
    });

    expect(result.current.activeFilterCount).toBe(1);

    act(() => {
      result.current.setFilter('dateFrom', new Date('2026-02-10'));
    });

    expect(result.current.activeFilterCount).toBe(2);

    act(() => {
      result.current.setFilter('categories', [ExpenseCategory.MEALS]);
    });

    expect(result.current.activeFilterCount).toBe(3);
  });

  it('should handle reports without expenses', () => {
    const { result } = renderHook(() => useFilters());

    act(() => {
      result.current.setFilter('categories', [ExpenseCategory.MEALS]);
    });

    const filtered = result.current.applyFilters(mockReports);

    // Should only return reports with expenses matching the category
    expect(filtered).toHaveLength(1);
    expect(filtered[0].id).toBe('1');
  });
});
