import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ExpenseStatus, ExpenseCategory } from '../../common/enums';

export class ExpenseResponseDto {
  @ApiProperty({ description: 'Expense ID' })
  id: string;

  @ApiProperty({ description: 'Report ID' })
  reportId: string;

  @ApiProperty({ description: 'Expense category', enum: ExpenseCategory })
  category: ExpenseCategory;

  @ApiPropertyOptional({ description: 'Expense name', nullable: true })
  expenseName: string | null;

  @ApiPropertyOptional({ description: 'Expense description', nullable: true })
  description: string | null;

  @ApiProperty({ description: 'Expense amount' })
  amount: number;

  @ApiProperty({ description: 'Expense date' })
  expenseDate: Date;

  @ApiProperty({ description: 'Expense status', enum: ExpenseStatus })
  status: ExpenseStatus;

  @ApiProperty({ description: 'Creation date' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update date' })
  updatedAt: Date;

  constructor(partial: Partial<ExpenseResponseDto>) {
    Object.assign(this, partial);
  }
}
