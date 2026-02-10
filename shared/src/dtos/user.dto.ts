/**
 * User data transfer object
 * Represents a user entity in API responses
 */
export interface UserDto {
  /** Unique user identifier (UUID) */
  id: string;

  /** User's email address */
  email: string;

  /** User's display name */
  name: string;

  /** Account creation timestamp (ISO 8601) */
  createdAt: string;
}

/**
 * Create user request DTO
 * Used when creating a new user
 */
export interface CreateUserRequestDto {
  /** User's email address (must be valid email format) */
  email: string;

  /** User's display name (minimum 2 characters) */
  name: string;
}
