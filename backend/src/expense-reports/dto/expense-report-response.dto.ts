import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ReportStatus } from '../../common/enums';
import { UserResponseDto } from '../../users/dto/user-response.dto';

export class ExpenseReportResponseDto {
  @ApiProperty({ description: 'Report ID' })
  id: string;

  @ApiProperty({ description: 'Purpose of the expense report' })
  purpose: string;

  @ApiProperty({ description: 'Report date' })
  reportDate: Date;

  @ApiProperty({ description: 'Total amount (calculated)' })
  totalAmount: number;

  @ApiProperty({ description: 'Report status', enum: ReportStatus })
  status: ReportStatus;

  @ApiPropertyOptional({ description: 'Payment date', nullable: true })
  paymentDate: Date | null;

  @ApiProperty({ description: 'User ID' })
  userId: string;

  @ApiPropertyOptional({ description: 'User details', type: () => UserResponseDto })
  user?: UserResponseDto;

  @ApiProperty({ description: 'Creation date' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update date' })
  updatedAt: Date;

  constructor(partial: Partial<ExpenseReportResponseDto>) {
    Object.assign(this, partial);
  }
}
