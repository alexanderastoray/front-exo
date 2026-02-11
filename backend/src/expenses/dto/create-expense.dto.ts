import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, Min, IsDateString, IsUUID, IsEnum, IsOptional } from 'class-validator';
import { ExpenseCategory } from '../../common/enums';

export class CreateExpenseDto {
  @ApiProperty({ description: 'Expense report ID', example: 'uuid-123' })
  @IsUUID()
  reportId: string;

  @ApiProperty({ description: 'Expense category', enum: ExpenseCategory })
  @IsEnum(ExpenseCategory)
  category: ExpenseCategory;

  @ApiPropertyOptional({ description: 'Expense name', example: 'Train ticket' })
  @IsString()
  @IsOptional()
  expenseName?: string;

  @ApiPropertyOptional({ description: 'Expense description', example: 'Paris to Lyon' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Expense amount', example: 125.50, minimum: 0.01 })
  @IsNumber()
  @Min(0.01)
  amount: number;

  @ApiProperty({ description: 'Expense date', example: '2026-02-15' })
  @IsDateString()
  expenseDate: Date;
}
