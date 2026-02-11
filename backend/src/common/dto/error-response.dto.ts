import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ValidationError {
  @ApiProperty()
  field: string;

  @ApiProperty()
  message: string;
}

export class ErrorResponseDto {
  @ApiProperty({ description: 'HTTP status code' })
  statusCode: number;

  @ApiProperty({ description: 'Error message' })
  message: string;

  @ApiPropertyOptional({ type: [ValidationError], description: 'Validation errors' })
  errors?: ValidationError[];

  @ApiProperty({ description: 'Timestamp of the error' })
  timestamp: string;

  @ApiProperty({ description: 'Request path' })
  path: string;
}
