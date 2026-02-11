import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExpenseReportsService } from './expense-reports.service';
import { ExpenseReportsController } from './expense-reports.controller';
import { ExpenseReport } from './entities/expense-report.entity';
import { ExpensesModule } from '../expenses/expenses.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ExpenseReport]),
    forwardRef(() => ExpensesModule),
  ],
  controllers: [ExpenseReportsController],
  providers: [ExpenseReportsService],
  exports: [ExpenseReportsService],
})
export class ExpenseReportsModule {}
