import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useUser } from './useUser';
import * as usersApi from '../api/users.api';

// Mock the users API
vi.mock('../api/users.api');

describe('useUser', () => {
  const mockUser = {
    id: 'user-1',
    email: 'john.doe@example.com',
    firstName: 'John',
    lastName: 'Doe',
    role: 'EMPLOYEE' as const,
    managerId: 'manager-1',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  };

  const mockManager = {
    id: 'manager-1',
    email: 'jane.manager@example.com',
    firstName: 'Jane',
    lastName: 'Manager',
    role: 'MANAGER' as const,
    managerId: null,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch user on mount', async () => {
    vi.mocked(usersApi.getUser).mockResolvedValue(mockUser);
    vi.mocked(usersApi.getManager).mockResolvedValue(mockManager);

    const { result } = renderHook(() => useUser('user-1'));

    expect(result.current.loading).toBe(true);
    expect(result.current.user).toBeNull();
    expect(result.current.manager).toBeNull();
    expect(result.current.error).toBeNull();

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.manager).toEqual(mockManager);
    expect(result.current.error).toBeNull();
  });

  it('should not fetch manager when user has no managerId', async () => {
    const userWithoutManager = { ...mockUser, managerId: null };
    vi.mocked(usersApi.getUser).mockResolvedValue(userWithoutManager);

    const { result } = renderHook(() => useUser('user-1'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.user).toEqual(userWithoutManager);
    expect(result.current.manager).toBeNull();
    expect(usersApi.getManager).not.toHaveBeenCalled();
  });

  it('should handle user fetch errors', async () => {
    const error = new Error('Failed to load user');
    vi.mocked(usersApi.getUser).mockRejectedValue(error);

    const { result } = renderHook(() => useUser('user-1'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.user).toBeNull();
    expect(result.current.error).toBe('Failed to load user');
  });

  it('should handle manager fetch errors gracefully', async () => {
    vi.mocked(usersApi.getUser).mockResolvedValue(mockUser);
    vi.mocked(usersApi.getManager).mockRejectedValue(new Error('Failed to load manager'));

    const { result } = renderHook(() => useUser('user-1'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // User should still be loaded even if manager fails
    expect(result.current.user).toEqual(mockUser);
    expect(result.current.manager).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('should update user successfully', async () => {
    vi.mocked(usersApi.getUser).mockResolvedValue(mockUser);
    vi.mocked(usersApi.getManager).mockResolvedValue(mockManager);

    const updatedUser = { ...mockUser, firstName: 'Johnny' };
    vi.mocked(usersApi.updateUser).mockResolvedValue(updatedUser);

    const { result } = renderHook(() => useUser('user-1'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.updating).toBe(false);

    let success: boolean = false;
    await act(async () => {
      success = await result.current.update({ firstName: 'Johnny' });
    });

    expect(success).toBe(true);
    expect(result.current.user).toEqual(updatedUser);
    expect(result.current.error).toBeNull();
    expect(usersApi.updateUser).toHaveBeenCalledWith('user-1', { firstName: 'Johnny' });
  });

  it('should handle update errors', async () => {
    vi.mocked(usersApi.getUser).mockResolvedValue(mockUser);
    vi.mocked(usersApi.getManager).mockResolvedValue(mockManager);

    const error = new Error('Failed to update user');
    vi.mocked(usersApi.updateUser).mockRejectedValue(error);

    const { result } = renderHook(() => useUser('user-1'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    let success: boolean = false;
    await act(async () => {
      success = await result.current.update({ firstName: 'Johnny' });
    });

    expect(success).toBe(false);
    expect(result.current.user).toEqual(mockUser); // Should remain unchanged
    expect(result.current.error).toBe('Failed to update user');
  });

  it('should reload user data when reload is called', async () => {
    vi.mocked(usersApi.getUser).mockResolvedValue(mockUser);
    vi.mocked(usersApi.getManager).mockResolvedValue(mockManager);

    const { result } = renderHook(() => useUser('user-1'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(usersApi.getUser).toHaveBeenCalledTimes(1);

    await result.current.reload();

    expect(usersApi.getUser).toHaveBeenCalledTimes(2);
  });

  it('should refetch when userId changes', async () => {
    vi.mocked(usersApi.getUser).mockResolvedValue(mockUser);
    vi.mocked(usersApi.getManager).mockResolvedValue(mockManager);

    const { result, rerender } = renderHook(
      ({ id }) => useUser(id),
      { initialProps: { id: 'user-1' } }
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(usersApi.getUser).toHaveBeenCalledWith('user-1');

    // Change user ID
    const mockUser2 = { ...mockUser, id: 'user-2' };
    vi.mocked(usersApi.getUser).mockResolvedValue(mockUser2);

    rerender({ id: 'user-2' });

    await waitFor(() => {
      expect(result.current.user?.id).toBe('user-2');
    });

    expect(usersApi.getUser).toHaveBeenCalledWith('user-2');
  });

  it('should handle non-Error exceptions in user fetch', async () => {
    vi.mocked(usersApi.getUser).mockRejectedValue('String error');

    const { result } = renderHook(() => useUser('user-1'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Failed to load user');
  });

  it('should handle non-Error exceptions in update', async () => {
    vi.mocked(usersApi.getUser).mockResolvedValue(mockUser);
    vi.mocked(usersApi.getManager).mockResolvedValue(mockManager);
    vi.mocked(usersApi.updateUser).mockRejectedValue('String error');

    const { result } = renderHook(() => useUser('user-1'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    let success: boolean = false;
    await act(async () => {
      success = await result.current.update({ firstName: 'Johnny' });
    });

    expect(success).toBe(false);
    expect(result.current.error).toBe('Failed to update user');
  });
});
