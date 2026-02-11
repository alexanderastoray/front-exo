import { describe, it, expect, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useSearch } from './useSearch';
import { ReportStatus, ExpenseCategory, ExpenseStatus } from '../types/expense-report.types';

// Mock useDebounce to avoid timing issues in tests
vi.mock('./useDebounce', () => ({
  useDebounce: (value: string) => value,
}));

describe('useSearch', () => {
  const mockReports = [
    {
      id: '1',
      purpose: 'Business Trip to Paris',
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
          expenseName: 'Team Lunch',
          description: 'Lunch with clients',
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
      purpose: 'Conference in Berlin',
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
          expenseName: 'Flight Tickets',
          description: 'Round trip to Berlin',
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

  it('should initialize with empty search term', () => {
    const { result } = renderHook(() => useSearch());

    expect(result.current.searchTerm).toBe('');
    expect(result.current.debouncedSearchTerm).toBe('');
  });

  it('should update search term', () => {
    const { result } = renderHook(() => useSearch());

    act(() => {
      result.current.setSearchTerm('paris');
    });

    expect(result.current.searchTerm).toBe('paris');
  });

  it('should return all reports when search term is empty', () => {
    const { result } = renderHook(() => useSearch());

    const filtered = result.current.applySearch(mockReports);

    expect(filtered).toHaveLength(3);
  });

  it('should search by report purpose', () => {
    const { result } = renderHook(() => useSearch());

    act(() => {
      result.current.setSearchTerm('paris');
    });

    const filtered = result.current.applySearch(mockReports);

    expect(filtered).toHaveLength(1);
    expect(filtered[0].id).toBe('1');
  });

  it('should search by expense name', () => {
    const { result } = renderHook(() => useSearch());

    act(() => {
      result.current.setSearchTerm('flight');
    });

    const filtered = result.current.applySearch(mockReports);

    expect(filtered).toHaveLength(1);
    expect(filtered[0].id).toBe('2');
  });

  it('should search by expense description', () => {
    const { result } = renderHook(() => useSearch());

    act(() => {
      result.current.setSearchTerm('clients');
    });

    const filtered = result.current.applySearch(mockReports);

    expect(filtered).toHaveLength(1);
    expect(filtered[0].id).toBe('1');
  });

  it('should be case insensitive', () => {
    const { result } = renderHook(() => useSearch());

    act(() => {
      result.current.setSearchTerm('PARIS');
    });

    const filtered = result.current.applySearch(mockReports);

    expect(filtered).toHaveLength(1);
    expect(filtered[0].id).toBe('1');
  });

  it('should handle partial matches', () => {
    const { result } = renderHook(() => useSearch());

    act(() => {
      result.current.setSearchTerm('conf');
    });

    const filtered = result.current.applySearch(mockReports);

    expect(filtered).toHaveLength(1);
    expect(filtered[0].id).toBe('2');
  });

  it('should return empty array when no matches found', () => {
    const { result } = renderHook(() => useSearch());

    act(() => {
      result.current.setSearchTerm('nonexistent');
    });

    const filtered = result.current.applySearch(mockReports);

    expect(filtered).toHaveLength(0);
  });

  it('should handle reports without expenses', () => {
    const { result } = renderHook(() => useSearch());

    act(() => {
      result.current.setSearchTerm('office');
    });

    const filtered = result.current.applySearch(mockReports);

    expect(filtered).toHaveLength(1);
    expect(filtered[0].id).toBe('3');
  });

  it('should trim whitespace from search term', () => {
    const { result } = renderHook(() => useSearch());

    act(() => {
      result.current.setSearchTerm('   ');
    });

    const filtered = result.current.applySearch(mockReports);

    // Should return all reports when search term is only whitespace
    expect(filtered).toHaveLength(3);
  });

  it('should search across multiple fields', () => {
    const { result } = renderHook(() => useSearch());

    act(() => {
      result.current.setSearchTerm('berlin');
    });

    const filtered = result.current.applySearch(mockReports);

    // Should find report by purpose and expense description
    expect(filtered).toHaveLength(1);
    expect(filtered[0].id).toBe('2');
  });
});
