import { useState, useEffect } from 'react';
import { HealthResponseDto } from '@shared/types';
import { checkHealth } from '../api/health.api';

interface UseHealthResult {
  health: HealthResponseDto | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook for health check
 * Fetches health status on mount and provides refetch function
 */
export function useHealth(): UseHealthResult {
  const [health, setHealth] = useState<HealthResponseDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHealth = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await checkHealth();
      setHealth(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch health status');
      setHealth(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  return {
    health,
    loading,
    error,
    refetch: fetchHealth,
  };
}
