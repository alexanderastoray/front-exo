import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useExpenseReportDetails } from './useExpenseReportDetails';
import * as expenseReportsApi from '../api/expense-reports.api';
import { ReportStatus, ExpenseCategory, ExpenseStatus } from '../types/expense-report.types';

// Mock the expense reports API
vi.mock('../api/expense-reports.api');

describe('useExpenseReportDetails', () => {
  const mockReport = {
    id: '1',
    purpose: 'Business Trip',
    reportDate: '2026-02-10',
    totalAmount: 500,
    status: ReportStatus.SUBMITTED,
    paymentDate: null,
    userId: 'user-1',
    createdAt: '2026-02-10T10:00:00.000Z',
    updatedAt: '2026-02-10T10:00:00.000Z',
  };

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

  it('should fetch report details and expenses on mount', async () => {
    vi.mocked(expenseReportsApi.expenseReportsApi.getById).mockResolvedValue(mockReport);
    vi.mocked(expenseReportsApi.expenseReportsApi.getExpenses).mockResolvedValue(mockExpenses);

    const { result } = renderHook(() => useExpenseReportDetails('1'));

    expect(result.current.loading).toBe(true);
    expect(result.current.report).toBeNull();
    expect(result.current.expenses).toEqual([]);
    expect(result.current.error).toBeNull();

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.report).toEqual(mockReport);
    expect(result.current.expenses).toEqual(mockExpenses);
    expect(result.current.error).toBeNull();
  });

  it('should handle errors correctly', async () => {
    const error = new Error('Failed to fetch report');
    vi.mocked(expenseReportsApi.expenseReportsApi.getById).mockRejectedValue(error);
    vi.mocked(expenseReportsApi.expenseReportsApi.getExpenses).mockRejectedValue(error);

    const { result } = renderHook(() => useExpenseReportDetails('1'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.report).toBeNull();
    expect(result.current.expenses).toEqual([]);
    expect(result.current.error).toBeInstanceOf(Error);
  });

  it('should not fetch when reportId is empty', async () => {
    const { result } = renderHook(() => useExpenseReportDetails(''));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(expenseReportsApi.expenseReportsApi.getById).not.toHaveBeenCalled();
    expect(expenseReportsApi.expenseReportsApi.getExpenses).not.toHaveBeenCalled();
  });

  it('should refetch when reportId changes', async () => {
    vi.mocked(expenseReportsApi.expenseReportsApi.getById).mockResolvedValue(mockReport);
    vi.mocked(expenseReportsApi.expenseReportsApi.getExpenses).mockResolvedValue(mockExpenses);

    const { result, rerender } = renderHook(
      ({ id }) => useExpenseReportDetails(id),
      { initialProps: { id: '1' } }
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(expenseReportsApi.expenseReportsApi.getById).toHaveBeenCalledWith('1');

    // Change the report ID
    const mockReport2 = { ...mockReport, id: '2' };
    vi.mocked(expenseReportsApi.expenseReportsApi.getById).mockResolvedValue(mockReport2);

    rerender({ id: '2' });

    await waitFor(() => {
      expect(result.current.report?.id).toBe('2');
    });

    expect(expenseReportsApi.expenseReportsApi.getById).toHaveBeenCalledWith('2');
    expect(expenseReportsApi.expenseReportsApi.getById).toHaveBeenCalledTimes(2);
  });

  it('should fetch both report and expenses in parallel', async () => {
    vi.mocked(expenseReportsApi.expenseReportsApi.getById).mockResolvedValue(mockReport);
    vi.mocked(expenseReportsApi.expenseReportsApi.getExpenses).mockResolvedValue(mockExpenses);

    const { result } = renderHook(() => useExpenseReportDetails('1'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Both should be called once
    expect(expenseReportsApi.expenseReportsApi.getById).toHaveBeenCalledTimes(1);
    expect(expenseReportsApi.expenseReportsApi.getExpenses).toHaveBeenCalledTimes(1);
  });
});
