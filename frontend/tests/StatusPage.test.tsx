import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import StatusPage from '../src/pages/StatusPage';
import * as healthApi from '../src/api/health.api';

// Mock the health API
vi.mock('../src/api/health.api');

describe('StatusPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('displays loading state initially', () => {
    vi.mocked(healthApi.checkHealth).mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );

    render(<StatusPage />);

    expect(screen.getByText('System Status')).toBeInTheDocument();
    // Loading spinner should be visible
    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('displays success when backend is healthy', async () => {
    const mockHealth = {
      ok: true,
      api: { ok: true },
      db: { ok: true },
      message: 'All systems operational',
      timestamp: '2026-02-10T15:30:00.000Z',
    };

    vi.mocked(healthApi.checkHealth).mockResolvedValue(mockHealth);

    render(<StatusPage />);

    await waitFor(() => {
      expect(screen.getByText('All systems operational')).toBeInTheDocument();
    });

    expect(screen.getByText('API is responding')).toBeInTheDocument();
    expect(screen.getByText('Database is connected')).toBeInTheDocument();
  });

  it('displays error when backend is unreachable', async () => {
    vi.mocked(healthApi.checkHealth).mockRejectedValue(new Error('Network error'));

    render(<StatusPage />);

    await waitFor(() => {
      expect(screen.getByText('Connection Error')).toBeInTheDocument();
    });

    expect(screen.getByText('Unable to connect to the backend API')).toBeInTheDocument();
  });

  it('displays DB error when database fails', async () => {
    const mockHealth = {
      ok: false,
      api: { ok: true },
      db: { ok: false, error: 'SQLITE_CANTOPEN: unable to open database file' },
      message: 'Database connection failed',
      timestamp: '2026-02-10T15:30:00.000Z',
    };

    vi.mocked(healthApi.checkHealth).mockResolvedValue(mockHealth);

    render(<StatusPage />);

    await waitFor(() => {
      expect(screen.getByText('Database connection failed')).toBeInTheDocument();
    });

    expect(screen.getByText('SQLITE_CANTOPEN: unable to open database file')).toBeInTheDocument();
  });

  it('refetches data when refresh button is clicked', async () => {
    const mockHealth = {
      ok: true,
      api: { ok: true },
      db: { ok: true },
      message: 'All systems operational',
      timestamp: '2026-02-10T15:30:00.000Z',
    };

    vi.mocked(healthApi.checkHealth).mockResolvedValue(mockHealth);

    render(<StatusPage />);

    await waitFor(() => {
      expect(screen.getByText('All systems operational')).toBeInTheDocument();
    });

    const refreshButton = screen.getByRole('button', { name: /refresh/i });
    await userEvent.click(refreshButton);

    expect(healthApi.checkHealth).toHaveBeenCalledTimes(2);
  });
});
