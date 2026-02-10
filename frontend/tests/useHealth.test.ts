import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useHealth } from '../src/hooks/useHealth';
import * as healthApi from '../src/api/health.api';

// Mock the health API
vi.mock('../src/api/health.api');

describe('useHealth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches health data on mount', async () => {
    const mockHealth = {
      ok: true,
      api: { ok: true },
      db: { ok: true },
      message: 'All systems operational',
      timestamp: '2026-02-10T15:30:00.000Z',
    };

    vi.mocked(healthApi.checkHealth).mockResolvedValue(mockHealth);

    const { result } = renderHook(() => useHealth());

    expect(result.current.loading).toBe(true);
    expect(result.current.health).toBeNull();
    expect(result.current.error).toBeNull();

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.health).toEqual(mockHealth);
    expect(result.current.error).toBeNull();
  });

  it('handles errors correctly', async () => {
    vi.mocked(healthApi.checkHealth).mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useHealth());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.health).toBeNull();
    expect(result.current.error).toBe('Network error');
  });

  it('refetches data when refetch is called', async () => {
    const mockHealth = {
      ok: true,
      api: { ok: true },
      db: { ok: true },
      message: 'All systems operational',
      timestamp: '2026-02-10T15:30:00.000Z',
    };

    vi.mocked(healthApi.checkHealth).mockResolvedValue(mockHealth);

    const { result } = renderHook(() => useHealth());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(healthApi.checkHealth).toHaveBeenCalledTimes(1);

    await result.current.refetch();

    expect(healthApi.checkHealth).toHaveBeenCalledTimes(2);
  });
});
