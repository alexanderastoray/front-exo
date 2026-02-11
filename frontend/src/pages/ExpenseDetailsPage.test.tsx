import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ExpenseDetailsPage } from './ExpenseDetailsPage';
import * as useExpenseDetailsHook from '../hooks/useExpenseDetails';
import { ExpenseCategory, ExpenseStatus } from '../types/expense-report.types';

// Mock the useExpenseDetails hook
vi.mock('../hooks/useExpenseDetails');

describe('ExpenseDetailsPage', () => {
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
    // Mock window.alert
    vi.spyOn(window, 'alert').mockImplementation(() => {});
  });

  it('should display loading state initially', () => {
    vi.mocked(useExpenseDetailsHook.useExpenseDetails).mockReturnValue({
      expense: null,
      loading: true,
      error: null,
    });

    render(<ExpenseDetailsPage expenseId="1" />);

    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('should display error state when loading fails', () => {
    vi.mocked(useExpenseDetailsHook.useExpenseDetails).mockReturnValue({
      expense: null,
      loading: false,
      error: new Error('Failed to load'),
    });

    render(<ExpenseDetailsPage expenseId="1" />);

    expect(screen.getByText('Error loading expense details')).toBeInTheDocument();
  });

  it('should display expense details when loaded', () => {
    vi.mocked(useExpenseDetailsHook.useExpenseDetails).mockReturnValue({
      expense: mockExpense,
      loading: false,
      error: null,
    });

    render(<ExpenseDetailsPage expenseId="1" />);

    expect(screen.getByText('$150.50')).toBeInTheDocument();
    expect(screen.getByText('Lunch with clients')).toBeInTheDocument();
    expect(screen.getAllByText('Submitted').length).toBeGreaterThan(0);
  });

  it('should call onBack when back button is clicked', async () => {
    const onBack = vi.fn();
    vi.mocked(useExpenseDetailsHook.useExpenseDetails).mockReturnValue({
      expense: mockExpense,
      loading: false,
      error: null,
    });

    render(<ExpenseDetailsPage expenseId="1" onBack={onBack} />);

    const backButton = screen.getAllByRole('button')[0]; // First button is the back button
    await userEvent.click(backButton);

    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it('should call onEdit when edit button is clicked', async () => {
    const onEdit = vi.fn();
    vi.mocked(useExpenseDetailsHook.useExpenseDetails).mockReturnValue({
      expense: mockExpense,
      loading: false,
      error: null,
    });

    render(<ExpenseDetailsPage expenseId="1" onEdit={onEdit} />);

    const editButton = screen.getByRole('button', { name: /edit/i });
    await userEvent.click(editButton);

    expect(onEdit).toHaveBeenCalledWith('1');
  });

  it('should show alert when download PDF button is clicked', async () => {
    vi.mocked(useExpenseDetailsHook.useExpenseDetails).mockReturnValue({
      expense: mockExpense,
      loading: false,
      error: null,
    });

    render(<ExpenseDetailsPage expenseId="1" />);

    const downloadButton = screen.getByRole('button', { name: /download pdf/i });
    await userEvent.click(downloadButton);

    expect(window.alert).toHaveBeenCalledWith('PDF download functionality will be implemented soon');
  });

  it('should display correct status badge for VALIDATED status', () => {
    const validatedExpense = { ...mockExpense, status: ExpenseStatus.VALIDATED };
    vi.mocked(useExpenseDetailsHook.useExpenseDetails).mockReturnValue({
      expense: validatedExpense,
      loading: false,
      error: null,
    });

    render(<ExpenseDetailsPage expenseId="1" />);

    expect(screen.getAllByText('Approved').length).toBeGreaterThan(0);
  });

  it('should display correct status badge for REJECTED status', () => {
    const rejectedExpense = { ...mockExpense, status: ExpenseStatus.REJECTED };
    vi.mocked(useExpenseDetailsHook.useExpenseDetails).mockReturnValue({
      expense: rejectedExpense,
      loading: false,
      error: null,
    });

    render(<ExpenseDetailsPage expenseId="1" />);

    expect(screen.getAllByText('Rejected').length).toBeGreaterThan(0);
  });

  it('should display correct status badge for PAID status', () => {
    const paidExpense = { ...mockExpense, status: ExpenseStatus.PAID };
    vi.mocked(useExpenseDetailsHook.useExpenseDetails).mockReturnValue({
      expense: paidExpense,
      loading: false,
      error: null,
    });

    render(<ExpenseDetailsPage expenseId="1" />);

    expect(screen.getAllByText('Paid').length).toBeGreaterThan(0);
  });

  it('should display correct status badge for CREATED status', () => {
    const createdExpense = { ...mockExpense, status: ExpenseStatus.CREATED };
    vi.mocked(useExpenseDetailsHook.useExpenseDetails).mockReturnValue({
      expense: createdExpense,
      loading: false,
      error: null,
    });

    render(<ExpenseDetailsPage expenseId="1" />);

    expect(screen.getAllByText('Draft').length).toBeGreaterThan(0);
  });

  it('should display history timeline', () => {
    vi.mocked(useExpenseDetailsHook.useExpenseDetails).mockReturnValue({
      expense: mockExpense,
      loading: false,
      error: null,
    });

    render(<ExpenseDetailsPage expenseId="1" />);

    expect(screen.getByText('History')).toBeInTheDocument();
    expect(screen.getAllByText('Submitted').length).toBeGreaterThan(0);
  });

  it('should display expense name when available', () => {
    vi.mocked(useExpenseDetailsHook.useExpenseDetails).mockReturnValue({
      expense: mockExpense,
      loading: false,
      error: null,
    });

    render(<ExpenseDetailsPage expenseId="1" />);

    expect(screen.getByText('Lunch with clients')).toBeInTheDocument();
  });

  it('should display "No description" when description and name are missing', () => {
    const expenseWithoutDescription = {
      ...mockExpense,
      description: null,
      expenseName: null,
    };
    vi.mocked(useExpenseDetailsHook.useExpenseDetails).mockReturnValue({
      expense: expenseWithoutDescription,
      loading: false,
      error: null,
    });

    render(<ExpenseDetailsPage expenseId="1" />);

    expect(screen.getByText('No description')).toBeInTheDocument();
  });
});
