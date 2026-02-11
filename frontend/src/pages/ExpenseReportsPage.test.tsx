import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ExpenseReportsPage } from './ExpenseReportsPage';
import * as useExpenseReportsHook from '../hooks/useExpenseReports';
import { ReportStatus } from '../types/expense-report.types';

// Mock the hooks
vi.mock('../hooks/useExpenseReports');
vi.mock('../hooks/useFilters');
vi.mock('../hooks/useSearch');

describe('ExpenseReportsPage', () => {
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
      expenses: [],
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
      expenses: [],
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should display loading state', () => {
    vi.mocked(useExpenseReportsHook.useExpenseReports).mockReturnValue({
      reports: [],
      loading: true,
      error: null,
      refetch: vi.fn(),
    });

    render(<ExpenseReportsPage />);

    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('should display error state', () => {
    vi.mocked(useExpenseReportsHook.useExpenseReports).mockReturnValue({
      reports: [],
      loading: false,
      error: new Error('Failed to load'),
      refetch: vi.fn(),
    });

    render(<ExpenseReportsPage />);

    expect(screen.getByText(/error loading reports/i)).toBeInTheDocument();
  });

  it('should display reports when loaded', () => {
    vi.mocked(useExpenseReportsHook.useExpenseReports).mockReturnValue({
      reports: mockReports,
      loading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<ExpenseReportsPage />);

    expect(screen.getByText('Business Trip')).toBeInTheDocument();
    expect(screen.getByText('Conference')).toBeInTheDocument();
  });

  it('should call onCreateReport when create button is clicked', async () => {
    const onCreateReport = vi.fn();
    vi.mocked(useExpenseReportsHook.useExpenseReports).mockReturnValue({
      reports: mockReports,
      loading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<ExpenseReportsPage onCreateReport={onCreateReport} />);

    const createButton = screen.getByRole('button', { name: /new report/i });
    await userEvent.click(createButton);

    expect(onCreateReport).toHaveBeenCalledTimes(1);
  });

  it('should call onViewReport when report is clicked', async () => {
    const onViewReport = vi.fn();
    vi.mocked(useExpenseReportsHook.useExpenseReports).mockReturnValue({
      reports: mockReports,
      loading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<ExpenseReportsPage onViewReport={onViewReport} />);

    const reportCard = screen.getByText('Business Trip');
    await userEvent.click(reportCard);

    expect(onViewReport).toHaveBeenCalledWith('1');
  });

  it('should display empty state when no reports', () => {
    vi.mocked(useExpenseReportsHook.useExpenseReports).mockReturnValue({
      reports: [],
      loading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<ExpenseReportsPage />);

    expect(screen.getByText(/no reports found/i)).toBeInTheDocument();
  });

  it('should render search input', () => {
    vi.mocked(useExpenseReportsHook.useExpenseReports).mockReturnValue({
      reports: mockReports,
      loading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<ExpenseReportsPage />);

    expect(screen.getByPlaceholderText(/search reports/i)).toBeInTheDocument();
  });

  it('should render filter button', () => {
    vi.mocked(useExpenseReportsHook.useExpenseReports).mockReturnValue({
      reports: mockReports,
      loading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<ExpenseReportsPage />);

    expect(screen.getByRole('button', { name: /filter/i })).toBeInTheDocument();
  });
});
