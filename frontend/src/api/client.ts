/**
 * Base API client
 * Provides error handling and common fetch configuration
 */

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Generic API call function with error handling
 */
export async function apiCall<T>(url: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      throw new ApiError(`HTTP ${response.status}: ${errorText}`, response.status);
    }

    return response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    // Network errors, parse errors, etc.
    throw new ApiError(
      error instanceof Error ? error.message : 'Network error occurred',
      undefined
    );
  }
}
