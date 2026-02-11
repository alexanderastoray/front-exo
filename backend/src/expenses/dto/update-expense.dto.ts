import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, Min, IsDateString, IsEnum, IsOptional } from 'class-validator';
import { ExpenseCategory } from '../../common/enums';

export class UpdateExpenseDto {
  @ApiPropertyOptional({ description: 'Expense category', enum: ExpenseCategory })
  @IsEnum(ExpenseCategory)
  @IsOptional()
  category?: ExpenseCategory;

  @ApiPropertyOptional({ description: 'Expense name' })
  @IsString()
  @IsOptional()
  expenseName?: string;

  @ApiPropertyOptional({ description: 'Expense description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: 'Expense amount', minimum: 0.01 })
  @IsNumber()
  @Min(0.01)
  @IsOptional()
  amount?: number;

  @ApiPropertyOptional({ description: 'Expense date', example: '2026-02-15' })
  @IsDateString()
  @IsOptional()
  expenseDate?: string;
}
