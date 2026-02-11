import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, MinLength, IsDateString, IsOptional } from 'class-validator';

export class UpdateExpenseReportDto {
  @ApiPropertyOptional({ description: 'Purpose of the expense report', minLength: 5 })
  @IsString()
  @MinLength(5)
  @IsOptional()
  purpose?: string;

  @ApiPropertyOptional({ description: 'Report date' })
  @IsDateString()
  @IsOptional()
  reportDate?: Date;
}
