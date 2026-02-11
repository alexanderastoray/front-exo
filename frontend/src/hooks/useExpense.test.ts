import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useExpense } from './useExpense';
import * as expensesApi from '../api/expenses.api';
import { ExpenseCategory, ExpenseStatus } from '../types/expense-report.types';

// Mock the expenses API
vi.mock('../api/expenses.api');

describe('useExpense', () => {
  const mockExpense = {
    id: '1',
    reportId: 'report-1',
    category: ExpenseCategory.MEALS,
    expenseName: 'Team Lunch',
    description: 'Lunch with clients',
    amount: 150.50,
    expenseDate: '2026-02-10',
    status: ExpenseStatus.SUBMITTED,
    createdAt: '2026-02-10T10:00:00.000Z',
    updatedAt: '2026-02-10T10:00:00.000Z',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch expense when expenseId is provided', async () => {
    vi.mocked(expensesApi.expensesApi.getById).mockResolvedValue(mockExpense);

    const { result } = renderHook(() => useExpense('1'));

    expect(result.current.loading).toBe(true);
    expect(result.current.expense).toBeNull();
    expect(result.current.error).toBeNull();

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.expense).toEqual(mockExpense);
    expect(result.current.error).toBeNull();
    expect(expensesApi.expensesApi.getById).toHaveBeenCalledWith('1');
  });

  it('should not fetch when expenseId is undefined', () => {
    const { result } = renderHook(() => useExpense(undefined));

    expect(result.current.loading).toBe(false);
    expect(result.current.expense).toBeNull();
    expect(result.current.error).toBeNull();
    expect(expensesApi.expensesApi.getById).not.toHaveBeenCalled();
  });

  it('should handle errors correctly', async () => {
    const error = new Error('Failed to fetch expense');
    vi.mocked(expensesApi.expensesApi.getById).mockRejectedValue(error);

    const { result } = renderHook(() => useExpense('1'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.expense).toBeNull();
    expect(result.current.error).toBeInstanceOf(Error);
  });

  it('should refetch when expenseId changes', async () => {
    vi.mocked(expensesApi.expensesApi.getById).mockResolvedValue(mockExpense);

    const { result, rerender } = renderHook(
      ({ id }) => useExpense(id),
      { initialProps: { id: '1' } }
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(expensesApi.expensesApi.getById).toHaveBeenCalledWith('1');

    // Change the expense ID
    const mockExpense2 = { ...mockExpense, id: '2' };
    vi.mocked(expensesApi.expensesApi.getById).mockResolvedValue(mockExpense2);

    rerender({ id: '2' });

    await waitFor(() => {
      expect(result.current.expense?.id).toBe('2');
    });

    expect(expensesApi.expensesApi.getById).toHaveBeenCalledWith('2');
    expect(expensesApi.expensesApi.getById).toHaveBeenCalledTimes(2);
  });

  it('should clear expense when expenseId becomes undefined', async () => {
    vi.mocked(expensesApi.expensesApi.getById).mockResolvedValue(mockExpense);

    const { result, rerender } = renderHook(
      ({ id }) => useExpense(id),
      { initialProps: { id: '1' as string | undefined } }
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.expense).toEqual(mockExpense);

    // Change to undefined
    rerender({ id: undefined });

    expect(result.current.expense).toBeNull();
    expect(result.current.loading).toBe(false);
  });
});
