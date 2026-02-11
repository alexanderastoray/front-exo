/**
 * useUser Hook
 * Manages user profile data and updates
 */

import { useState, useEffect } from 'react';
import { getUser, updateUser, getManager, User, UpdateUserData } from '../api/users.api';

export function useUser(userId: string) {
  const [user, setUser] = useState<User | null>(null);
  const [manager, setManager] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadUser();
  }, [userId]);

  const loadUser = async () => {
    try {
      setLoading(true);
      setError(null);
      const userData = await getUser(userId);
      setUser(userData);

      // Load manager if exists
      if (userData.managerId) {
        try {
          const managerData = await getManager(userData.managerId);
          setManager(managerData);
        } catch (err) {
          console.error('Failed to load manager:', err);
          // Don't set error for manager load failure
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load user');
    } finally {
      setLoading(false);
    }
  };

  const update = async (data: UpdateUserData): Promise<boolean> => {
    try {
      setUpdating(true);
      setError(null);
      const updatedUser = await updateUser(userId, data);
      setUser(updatedUser);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update user');
      return false;
    } finally {
      setUpdating(false);
    }
  };

  return {
    user,
    manager,
    loading,
    error,
    updating,
    update,
    reload: loadUser,
  };
}
