import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CreateExpensePage } from './CreateExpensePage';
import * as useExpenseHook from '../hooks/useExpense';
import { ExpenseCategory, ExpenseStatus } from '../types/expense-report.types';

// Mock the hooks
vi.mock('../hooks/useExpense');
vi.mock('../api/expenses.api');

describe('CreateExpensePage', () => {
  const mockExpense = {
    id: '1',
    reportId: 'report-1',
    category: ExpenseCategory.MEALS,
    expenseName: 'Team Lunch',
    description: 'Lunch with clients',
    amount: 150.50,
    expenseDate: '2026-02-10',
    status: ExpenseStatus.CREATED,
    createdAt: '2026-02-10T10:00:00.000Z',
    updatedAt: '2026-02-10T10:00:00.000Z',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render create mode by default', () => {
    vi.mocked(useExpenseHook.useExpense).mockReturnValue({
      expense: null,
      loading: false,
      error: null,
    });

    render(<CreateExpensePage />);

    expect(screen.getByText(/add expense/i)).toBeInTheDocument();
  });

  it('should render edit mode when expenseId is provided', () => {
    vi.mocked(useExpenseHook.useExpense).mockReturnValue({
      expense: mockExpense,
      loading: false,
      error: null,
    });

    render(<CreateExpensePage expenseId="1" />);

    expect(screen.getByText(/edit expense/i)).toBeInTheDocument();
  });

  it('should display loading state', () => {
    vi.mocked(useExpenseHook.useExpense).mockReturnValue({
      expense: null,
      loading: true,
      error: null,
    });

    render(<CreateExpensePage expenseId="1" />);

    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('should render all form fields', () => {
    vi.mocked(useExpenseHook.useExpense).mockReturnValue({
      expense: null,
      loading: false,
      error: null,
    });

    render(<CreateExpensePage />);

    expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/amount/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/expense name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
  });

  it('should populate form with expense data in edit mode', () => {
    vi.mocked(useExpenseHook.useExpense).mockReturnValue({
      expense: mockExpense,
      loading: false,
      error: null,
    });

    render(<CreateExpensePage expenseId="1" />);

    expect(screen.getByDisplayValue('Team Lunch')).toBeInTheDocument();
    expect(screen.getByDisplayValue('150.5')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Lunch with clients')).toBeInTheDocument();
  });

  it('should call onClose when cancel button is clicked', async () => {
    const onClose = vi.fn();
    vi.mocked(useExpenseHook.useExpense).mockReturnValue({
      expense: null,
      loading: false,
      error: null,
    });

    render(<CreateExpensePage onClose={onClose} />);

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await userEvent.click(cancelButton);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should update form data when inputs change', async () => {
    vi.mocked(useExpenseHook.useExpense).mockReturnValue({
      expense: null,
      loading: false,
      error: null,
    });

    render(<CreateExpensePage />);

    const nameInput = screen.getByLabelText(/expense name/i);
    await userEvent.type(nameInput, 'New Expense');

    expect(screen.getByDisplayValue('New Expense')).toBeInTheDocument();
  });

  it('should render category options', () => {
    vi.mocked(useExpenseHook.useExpense).mockReturnValue({
      expense: null,
      loading: false,
      error: null,
    });

    render(<CreateExpensePage />);

    expect(screen.getByRole('option', { name: /travel/i })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /meals/i })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /accommodation/i })).toBeInTheDocument();
  });

  it('should render save button', () => {
    vi.mocked(useExpenseHook.useExpense).mockReturnValue({
      expense: null,
      loading: false,
      error: null,
    });

    render(<CreateExpensePage />);

    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
  });
});
