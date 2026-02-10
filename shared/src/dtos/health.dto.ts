/**
 * Health check response DTO
 * Used by the /health endpoint to report system status
 */
export interface HealthResponseDto {
  /** Overall system health status */
  ok: boolean;

  /** API service status */
  api: {
    ok: boolean;
  };

  /** Database connection status */
  db: {
    ok: boolean;
    error?: string;
  };

  /** Human-readable status message */
  message: string;

  /** ISO 8601 timestamp of the health check */
  timestamp: string;
}
