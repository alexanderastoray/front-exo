import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProfilePage } from './ProfilePage';
import * as useUserHook from '../hooks/useUser';

// Mock the hooks
vi.mock('../hooks/useUser');

describe('ProfilePage', () => {
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

  it('should display loading state', () => {
    vi.mocked(useUserHook.useUser).mockReturnValue({
      user: null,
      manager: null,
      loading: true,
      error: null,
      updating: false,
      update: vi.fn(),
      reload: vi.fn(),
    });

    render(<ProfilePage />);

    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('should display error state', () => {
    vi.mocked(useUserHook.useUser).mockReturnValue({
      user: null,
      manager: null,
      loading: false,
      error: 'Failed to load user',
      updating: false,
      update: vi.fn(),
      reload: vi.fn(),
    });

    render(<ProfilePage />);

    expect(screen.getByText(/error loading profile/i)).toBeInTheDocument();
  });

  it('should display user profile when loaded', () => {
    vi.mocked(useUserHook.useUser).mockReturnValue({
      user: mockUser,
      manager: mockManager,
      loading: false,
      error: null,
      updating: false,
      update: vi.fn(),
      reload: vi.fn(),
    });

    render(<ProfilePage />);

    expect(screen.getByDisplayValue('John')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Doe')).toBeInTheDocument();
    expect(screen.getByDisplayValue('john.doe@example.com')).toBeInTheDocument();
  });

  it('should display manager information', () => {
    vi.mocked(useUserHook.useUser).mockReturnValue({
      user: mockUser,
      manager: mockManager,
      loading: false,
      error: null,
      updating: false,
      update: vi.fn(),
      reload: vi.fn(),
    });

    render(<ProfilePage />);

    expect(screen.getByText(/jane manager/i)).toBeInTheDocument();
  });

  it('should render all form fields', () => {
    vi.mocked(useUserHook.useUser).mockReturnValue({
      user: mockUser,
      manager: mockManager,
      loading: false,
      error: null,
      updating: false,
      update: vi.fn(),
      reload: vi.fn(),
    });

    render(<ProfilePage />);

    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });

  it('should call update when form is submitted', async () => {
    const mockUpdate = vi.fn().mockResolvedValue(true);
    vi.mocked(useUserHook.useUser).mockReturnValue({
      user: mockUser,
      manager: mockManager,
      loading: false,
      error: null,
      updating: false,
      update: mockUpdate,
      reload: vi.fn(),
    });

    render(<ProfilePage />);

    const firstNameInput = screen.getByLabelText(/first name/i);
    await userEvent.clear(firstNameInput);
    await userEvent.type(firstNameInput, 'Johnny');

    const saveButton = screen.getByRole('button', { name: /save/i });
    await userEvent.click(saveButton);

    await waitFor(() => {
      expect(mockUpdate).toHaveBeenCalledWith({ firstName: 'Johnny' });
    });
  });

  it('should show success modal after successful update', async () => {
    const mockUpdate = vi.fn().mockResolvedValue(true);
    vi.mocked(useUserHook.useUser).mockReturnValue({
      user: mockUser,
      manager: mockManager,
      loading: false,
      error: null,
      updating: false,
      update: mockUpdate,
      reload: vi.fn(),
    });

    render(<ProfilePage />);

    const firstNameInput = screen.getByLabelText(/first name/i);
    await userEvent.clear(firstNameInput);
    await userEvent.type(firstNameInput, 'Johnny');

    const saveButton = screen.getByRole('button', { name: /save/i });
    await userEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText(/profile updated/i)).toBeInTheDocument();
    });
  });

  it('should disable save button when updating', () => {
    vi.mocked(useUserHook.useUser).mockReturnValue({
      user: mockUser,
      manager: mockManager,
      loading: false,
      error: null,
      updating: true,
      update: vi.fn(),
      reload: vi.fn(),
    });

    render(<ProfilePage />);

    const saveButton = screen.getByRole('button', { name: /saving/i });
    expect(saveButton).toBeDisabled();
  });

  it('should not call update when no changes are made', async () => {
    const mockUpdate = vi.fn().mockResolvedValue(true);
    vi.mocked(useUserHook.useUser).mockReturnValue({
      user: mockUser,
      manager: mockManager,
      loading: false,
      error: null,
      updating: false,
      update: mockUpdate,
      reload: vi.fn(),
    });

    render(<ProfilePage />);

    const saveButton = screen.getByRole('button', { name: /save/i });
    await userEvent.click(saveButton);

    // Should show success but not call update
    await waitFor(() => {
      expect(screen.getByText(/profile updated/i)).toBeInTheDocument();
    });
    expect(mockUpdate).not.toHaveBeenCalled();
  });
});
