import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExpenseReport } from './entities/expense-report.entity';
import { CreateExpenseReportDto } from './dto/create-expense-report.dto';
import { UpdateExpenseReportDto } from './dto/update-expense-report.dto';
import { ExpenseReportResponseDto } from './dto/expense-report-response.dto';
import { PaginationDto, PaginatedResponse } from '../common/dto/pagination.dto';
import { ReportStatus } from '../common/enums';
import { ReportStatusHelper } from './helpers/report-status.helper';

@Injectable()
export class ExpenseReportsService {
  constructor(
    @InjectRepository(ExpenseReport)
    private readonly expenseReportRepository: Repository<ExpenseReport>,
  ) {}

  /**
   * Create a new expense report
   */
  async create(createDto: CreateExpenseReportDto): Promise<ExpenseReportResponseDto> {
    const report = this.expenseReportRepository.create({
      ...createDto,
      status: ReportStatus.CREATED,
      totalAmount: 0,
      paymentDate: null,
    });

    const savedReport = await this.expenseReportRepository.save(report);
    return new ExpenseReportResponseDto(savedReport);
  }

  /**
   * Find all expense reports with pagination and filters
   */
  async findAll(
    paginationDto: PaginationDto,
    userId?: string,
    status?: ReportStatus,
    dateFrom?: string,
    dateTo?: string,
  ): Promise<PaginatedResponse<ExpenseReportResponseDto>> {
    const { page = 1, limit = 10, sortBy = 'createdAt', order = 'DESC' } = paginationDto;

    const queryBuilder = this.expenseReportRepository.createQueryBuilder('report');

    // Apply filters
    if (userId) {
      queryBuilder.andWhere('report.userId = :userId', { userId });
    }

    if (status) {
      queryBuilder.andWhere('report.status = :status', { status });
    }

    if (dateFrom) {
      queryBuilder.andWhere('report.reportDate >= :dateFrom', { dateFrom });
    }

    if (dateTo) {
      queryBuilder.andWhere('report.reportDate <= :dateTo', { dateTo });
    }

    // Apply sorting
    queryBuilder.orderBy(`report.${sortBy}`, order);

    // Apply pagination
    queryBuilder.skip((page - 1) * limit).take(limit);

    const [reports, total] = await queryBuilder.getManyAndCount();

    return {
      data: reports.map((report) => new ExpenseReportResponseDto(report)),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Find one expense report by ID
   */
  async findOne(id: string, includeUser = false): Promise<ExpenseReportResponseDto> {
    const queryBuilder = this.expenseReportRepository.createQueryBuilder('report');

    if (includeUser) {
      queryBuilder.leftJoinAndSelect('report.user', 'user');
    }

    queryBuilder.where('report.id = :id', { id });

    const report = await queryBuilder.getOne();

    if (!report) {
      throw new NotFoundException(`Expense report with ID ${id} not found`);
    }

    return new ExpenseReportResponseDto(report);
  }

  /**
   * Update an expense report
   */
  async update(id: string, updateDto: UpdateExpenseReportDto): Promise<ExpenseReportResponseDto> {
    const report = await this.expenseReportRepository.findOne({ where: { id } });

    if (!report) {
      throw new NotFoundException(`Expense report with ID ${id} not found`);
    }

    if (!ReportStatusHelper.canModify(report.status)) {
      throw new BadRequestException(
        `Cannot modify expense report with status ${report.status}`,
      );
    }

    Object.assign(report, updateDto);
    const updatedReport = await this.expenseReportRepository.save(report);

    return new ExpenseReportResponseDto(updatedReport);
  }

  /**
   * Remove an expense report
   */
  async remove(id: string): Promise<void> {
    const report = await this.expenseReportRepository.findOne({ where: { id } });

    if (!report) {
      throw new NotFoundException(`Expense report with ID ${id} not found`);
    }

    if (!ReportStatusHelper.canDelete(report.status)) {
      throw new BadRequestException(
        `Cannot delete expense report with status ${report.status}. Only CREATED reports can be deleted.`,
      );
    }

    await this.expenseReportRepository.remove(report);
  }

  /**
   * Submit an expense report (CREATED -> SUBMITTED)
   */
  async submitReport(id: string): Promise<ExpenseReportResponseDto> {
    const report = await this.expenseReportRepository.findOne({ where: { id } });

    if (!report) {
      throw new NotFoundException(`Expense report with ID ${id} not found`);
    }

    if (!ReportStatusHelper.canTransitionTo(report.status, ReportStatus.SUBMITTED)) {
      throw new BadRequestException(
        `Cannot transition from ${report.status} to SUBMITTED`,
      );
    }

    report.status = ReportStatus.SUBMITTED;
    const updatedReport = await this.expenseReportRepository.save(report);

    return new ExpenseReportResponseDto(updatedReport);
  }

  /**
   * Validate an expense report (SUBMITTED -> VALIDATED) - V2
   */
  async validateReport(id: string): Promise<ExpenseReportResponseDto> {
    const report = await this.expenseReportRepository.findOne({ where: { id } });

    if (!report) {
      throw new NotFoundException(`Expense report with ID ${id} not found`);
    }

    if (!ReportStatusHelper.canTransitionTo(report.status, ReportStatus.VALIDATED)) {
      throw new BadRequestException(
        `Cannot transition from ${report.status} to VALIDATED`,
      );
    }

    report.status = ReportStatus.VALIDATED;
    const updatedReport = await this.expenseReportRepository.save(report);

    return new ExpenseReportResponseDto(updatedReport);
  }

  /**
   * Reject an expense report (SUBMITTED -> REJECTED) - V2
   */
  async rejectReport(id: string): Promise<ExpenseReportResponseDto> {
    const report = await this.expenseReportRepository.findOne({ where: { id } });

    if (!report) {
      throw new NotFoundException(`Expense report with ID ${id} not found`);
    }

    if (!ReportStatusHelper.canTransitionTo(report.status, ReportStatus.REJECTED)) {
      throw new BadRequestException(
        `Cannot transition from ${report.status} to REJECTED`,
      );
    }

    report.status = ReportStatus.REJECTED;
    const updatedReport = await this.expenseReportRepository.save(report);

    return new ExpenseReportResponseDto(updatedReport);
  }

  /**
   * Mark an expense report as paid
   */
  async payReport(id: string): Promise<ExpenseReportResponseDto> {
    const report = await this.expenseReportRepository.findOne({ where: { id } });

    if (!report) {
      throw new NotFoundException(`Expense report with ID ${id} not found`);
    }

    if (!ReportStatusHelper.canTransitionTo(report.status, ReportStatus.PAID)) {
      throw new BadRequestException(
        `Cannot transition from ${report.status} to PAID`,
      );
    }

    report.status = ReportStatus.PAID;
    report.paymentDate = new Date();
    const updatedReport = await this.expenseReportRepository.save(report);

    return new ExpenseReportResponseDto(updatedReport);
  }

  /**
   * Recalculate total amount for an expense report
   * Called by ExpensesService when expenses are created/updated/deleted
   */
  async recalculateTotalAmount(reportId: string): Promise<void> {
    const result = await this.expenseReportRepository
      .createQueryBuilder('report')
      .leftJoin('expenses', 'expense', 'expense.reportId = report.id')
      .select('COALESCE(SUM(expense.amount), 0)', 'total')
      .where('report.id = :reportId', { reportId })
      .getRawOne();

    const totalAmount = parseFloat(result.total) || 0;

    await this.expenseReportRepository.update(reportId, { totalAmount });
  }
}
