import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, IsDateString, IsUUID } from 'class-validator';

export class CreateExpenseReportDto {
  @ApiProperty({ description: 'Purpose of the expense report', example: 'Business trip to Paris', minLength: 5 })
  @IsString()
  @MinLength(5)
  purpose: string;

  @ApiProperty({ description: 'Report date', example: '2026-02-15' })
  @IsDateString()
  reportDate: Date;

  @ApiProperty({ description: 'User ID', example: 'uuid-123' })
  @IsUUID()
  userId: string;
}
