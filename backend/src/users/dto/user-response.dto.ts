import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from '@shared/types';

/**
 * User response DTO
 * Formats user data for API responses
 */
export class UserResponseDto implements UserDto {
  @ApiProperty({
    description: 'Unique user identifier',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'User display name',
    example: 'John Doe',
  })
  name: string;

  @ApiProperty({
    description: 'Account creation timestamp',
    example: '2026-02-10T15:30:00.000Z',
  })
  createdAt: string;
}
