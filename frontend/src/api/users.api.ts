/**
 * Users API
 * API calls for user management
 */

import { apiClient } from './client';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  managerId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  email?: string;
}

/**
 * Get user by ID
 */
export async function getUser(userId: string): Promise<User> {
  const response = await apiClient.get<User>(`/users/${userId}`);
  return response.data;
}

/**
 * Update user profile
 */
export async function updateUser(userId: string, data: UpdateUserData): Promise<User> {
  const response = await apiClient.patch<User>(`/users/${userId}`, data);
  return response.data;
}

/**
 * Get manager information
 */
export async function getManager(managerId: string): Promise<User> {
  const response = await apiClient.get<User>(`/users/${managerId}`);
  return response.data;
}
