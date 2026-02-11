import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Expense } from './entities/expense.entity';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { ExpenseResponseDto } from './dto/expense-response.dto';
import { PaginationDto, PaginatedResponse } from '../common/dto/pagination.dto';
import { ExpenseStatus, ExpenseCategory } from '../common/enums';
import { ExpenseReportsService } from '../expense-reports/expense-reports.service';
import { ReportStatusHelper } from '../expense-reports/helpers/report-status.helper';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectRepository(Expense)
    private readonly expenseRepository: Repository<Expense>,
    private readonly expenseReportsService: ExpenseReportsService,
  ) {}

  /**
   * Create a new expense
   */
  async create(createDto: CreateExpenseDto): Promise<ExpenseResponseDto> {
    // Check if report exists and is modifiable
    const report = await this.expenseReportsService.findOne(createDto.reportId);
    
    if (!ReportStatusHelper.canModify(report.status)) {
      throw new BadRequestException(
        `Cannot add expense to report with status ${report.status}`,
      );
    }

    const expense = this.expenseRepository.create({
      ...createDto,
      status: ExpenseStatus.CREATED,
    });

    const savedExpense = await this.expenseRepository.save(expense);

    // Recalculate report total amount
    await this.expenseReportsService.recalculateTotalAmount(createDto.reportId);

    return new ExpenseResponseDto(savedExpense);
  }

  /**
   * Find all expenses with pagination and filters
   */
  async findAll(
    paginationDto: PaginationDto,
    reportId?: string,
    category?: ExpenseCategory,
    status?: ExpenseStatus,
    dateFrom?: string,
    dateTo?: string,
  ): Promise<PaginatedResponse<ExpenseResponseDto>> {
    const { page = 1, limit = 10, sortBy = 'createdAt', order = 'DESC' } = paginationDto;

    const queryBuilder = this.expenseRepository.createQueryBuilder('expense');

    // Apply filters
    if (reportId) {
      queryBuilder.andWhere('expense.reportId = :reportId', { reportId });
    }

    if (category) {
      queryBuilder.andWhere('expense.category = :category', { category });
    }

    if (status) {
      queryBuilder.andWhere('expense.status = :status', { status });
    }

    if (dateFrom) {
      queryBuilder.andWhere('expense.expenseDate >= :dateFrom', { dateFrom });
    }

    if (dateTo) {
      queryBuilder.andWhere('expense.expenseDate <= :dateTo', { dateTo });
    }

    // Apply sorting
    queryBuilder.orderBy(`expense.${sortBy}`, order);

    // Apply pagination
    queryBuilder.skip((page - 1) * limit).take(limit);

    const [expenses, total] = await queryBuilder.getManyAndCount();

    return {
      data: expenses.map((expense) => new ExpenseResponseDto(expense)),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Find one expense by ID
   */
  async findOne(id: string): Promise<ExpenseResponseDto> {
    const expense = await this.expenseRepository.findOne({ where: { id } });

    if (!expense) {
      throw new NotFoundException(`Expense with ID ${id} not found`);
    }

    return new ExpenseResponseDto(expense);
  }

  /**
   * Update an expense
   */
  async update(id: string, updateDto: UpdateExpenseDto): Promise<ExpenseResponseDto> {
    const expense = await this.expenseRepository.findOne({ where: { id } });

    if (!expense) {
      throw new NotFoundException(`Expense with ID ${id} not found`);
    }

    // Check if parent report is modifiable
    const report = await this.expenseReportsService.findOne(expense.reportId);
    
    if (!ReportStatusHelper.canModify(report.status)) {
      throw new BadRequestException(
        `Cannot modify expense in report with status ${report.status}`,
      );
    }

    const oldAmount = expense.amount;
    Object.assign(expense, updateDto);
    const updatedExpense = await this.expenseRepository.save(expense);

    // Recalculate report total amount if amount changed
    if (updateDto.amount !== undefined && updateDto.amount !== oldAmount) {
      await this.expenseReportsService.recalculateTotalAmount(expense.reportId);
    }

    return new ExpenseResponseDto(updatedExpense);
  }

  /**
   * Remove an expense
   */
  async remove(id: string): Promise<void> {
    const expense = await this.expenseRepository.findOne({ where: { id } });

    if (!expense) {
      throw new NotFoundException(`Expense with ID ${id} not found`);
    }

    // Check if parent report is modifiable
    const report = await this.expenseReportsService.findOne(expense.reportId);
    
    if (!ReportStatusHelper.canModify(report.status)) {
      throw new BadRequestException(
        `Cannot delete expense in report with status ${report.status}`,
      );
    }

    const reportId = expense.reportId;
    await this.expenseRepository.remove(expense);

    // Recalculate report total amount
    await this.expenseReportsService.recalculateTotalAmount(reportId);
  }

  /**
   * Find expenses by report ID
   */
  async findByReportId(reportId: string): Promise<ExpenseResponseDto[]> {
    const expenses = await this.expenseRepository.find({
      where: { reportId },
      order: { createdAt: 'DESC' },
    });

    return expenses.map((expense) => new ExpenseResponseDto(expense));
  }
}
