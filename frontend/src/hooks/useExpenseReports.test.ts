import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useExpenseReports } from './useExpenseReports';
import * as expenseReportsApi from '../api/expense-reports.api';
import { ReportStatus, ExpenseCategory, ExpenseStatus } from '../types/expense-report.types';

// Mock the expense reports API
vi.mock('../api/expense-reports.api');

describe('useExpenseReports', () => {
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
    },
    {
      id: '2',
      purpose: 'Conference',
      reportDate: '2026-02-11',
      totalAmount: 750,
      status: ReportStatus.VALIDATED,
      paymentDate: null,
      userId: 'user-1',
      createdAt: '2026-02-11T10:00:00.000Z',
      updatedAt: '2026-02-11T10:00:00.000Z',
    },
  ];

  const mockExpenses = [
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
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch reports on mount', async () => {
    vi.mocked(expenseReportsApi.expenseReportsApi.getAll).mockResolvedValue(mockReports);
    vi.mocked(expenseReportsApi.expenseReportsApi.getExpenses).mockResolvedValue(mockExpenses);

    const { result } = renderHook(() => useExpenseReports());

    expect(result.current.loading).toBe(true);
    expect(result.current.reports).toEqual([]);
    expect(result.current.error).toBeNull();

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.reports).toHaveLength(2);
    expect(result.current.reports[0].expenses).toEqual(mockExpenses);
    expect(result.current.error).toBeNull();
  });

  it('should handle errors correctly', async () => {
    const error = new Error('Failed to fetch reports');
    vi.mocked(expenseReportsApi.expenseReportsApi.getAll).mockRejectedValue(error);

    const { result } = renderHook(() => useExpenseReports());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.reports).toEqual([]);
    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe('Failed to fetch reports');
  });

  it('should refetch data when refetch is called', async () => {
    vi.mocked(expenseReportsApi.expenseReportsApi.getAll).mockResolvedValue(mockReports);
    vi.mocked(expenseReportsApi.expenseReportsApi.getExpenses).mockResolvedValue(mockExpenses);

    const { result } = renderHook(() => useExpenseReports());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(expenseReportsApi.expenseReportsApi.getAll).toHaveBeenCalledTimes(1);

    await result.current.refetch();

    expect(expenseReportsApi.expenseReportsApi.getAll).toHaveBeenCalledTimes(2);
  });

  it('should handle expense fetch failures gracefully', async () => {
    vi.mocked(expenseReportsApi.expenseReportsApi.getAll).mockResolvedValue(mockReports);
    vi.mocked(expenseReportsApi.expenseReportsApi.getExpenses).mockRejectedValue(
      new Error('Failed to fetch expenses')
    );

    const { result } = renderHook(() => useExpenseReports());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Should still return reports even if expenses fail
    expect(result.current.reports).toHaveLength(2);
    expect(result.current.reports[0].expenses).toBeUndefined();
    expect(result.current.error).toBeNull();
  });

  it('should handle non-Error exceptions', async () => {
    vi.mocked(expenseReportsApi.expenseReportsApi.getAll).mockRejectedValue('String error');

    const { result } = renderHook(() => useExpenseReports());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error?.message).toBe('Failed to fetch reports');
  });
});
