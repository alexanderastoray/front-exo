import { HealthResponseDto } from '@shared/types';
import { apiCall } from './client';

/**
 * Health API
 * Handles health check endpoint calls
 */

const BASE_URL = '/api';

/**
 * Check system health
 * @returns Health status of API and database
 */
export async function checkHealth(): Promise<HealthResponseDto> {
  return apiCall<HealthResponseDto>(`${BASE_URL}/health`);
}
