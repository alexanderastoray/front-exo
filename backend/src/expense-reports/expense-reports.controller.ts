import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { ExpenseReportsService } from './expense-reports.service';
import { CreateExpenseReportDto } from './dto/create-expense-report.dto';
import { UpdateExpenseReportDto } from './dto/update-expense-report.dto';
import { ExpenseReportResponseDto } from './dto/expense-report-response.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { ErrorResponseDto } from '../common/dto/error-response.dto';
import { FakeAuthGuard } from '../common/guards/fake-auth.guard';
import { ReportStatus } from '../common/enums';
import { ExpensesService } from '../expenses/expenses.service';

@ApiTags('expense-reports')
@Controller('expense-reports')
@UseGuards(FakeAuthGuard)
export class ExpenseReportsController {
  constructor(
    private readonly expenseReportsService: ExpenseReportsService,
    private readonly expensesService: ExpensesService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new expense report' })
  @ApiResponse({
    status: 201,
    description: 'Expense report created successfully',
    type: ExpenseReportResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error',
    type: ErrorResponseDto,
  })
  create(@Body() createDto: CreateExpenseReportDto): Promise<ExpenseReportResponseDto> {
    console.log('Received DTO:', JSON.stringify(createDto, null, 2));
    return this.expenseReportsService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all expense reports with pagination and filters' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'sortBy', required: false, type: String })
  @ApiQuery({ name: 'order', required: false, enum: ['ASC', 'DESC'] })
  @ApiQuery({ name: 'userId', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, enum: ReportStatus })
  @ApiQuery({ name: 'dateFrom', required: false, type: String })
  @ApiQuery({ name: 'dateTo', required: false, type: String })
  @ApiResponse({
    status: 200,
    description: 'Expense reports retrieved successfully',
  })
  findAll(
    @Query() paginationDto: PaginationDto,
    @Query('userId') userId?: string,
    @Query('status') status?: ReportStatus,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
  ) {
    return this.expenseReportsService.findAll(paginationDto, userId, status, dateFrom, dateTo);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an expense report by ID' })
  @ApiParam({ name: 'id', description: 'Expense report ID' })
  @ApiResponse({
    status: 200,
    description: 'Expense report retrieved successfully',
    type: ExpenseReportResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Expense report not found',
    type: ErrorResponseDto,
  })
  findOne(@Param('id') id: string): Promise<ExpenseReportResponseDto> {
    return this.expenseReportsService.findOne(id);
  }

  @Get(':id/expenses')
  @ApiOperation({ summary: 'Get all expenses for an expense report' })
  @ApiParam({ name: 'id', description: 'Expense report ID' })
  @ApiResponse({
    status: 200,
    description: 'Expenses retrieved successfully',
  })
  findExpenses(@Param('id') id: string) {
    return this.expensesService.findByReportId(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an expense report' })
  @ApiParam({ name: 'id', description: 'Expense report ID' })
  @ApiResponse({
    status: 200,
    description: 'Expense report updated successfully',
    type: ExpenseReportResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Expense report not found',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Cannot modify report with current status',
    type: ErrorResponseDto,
  })
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateExpenseReportDto,
  ): Promise<ExpenseReportResponseDto> {
    return this.expenseReportsService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an expense report' })
  @ApiParam({ name: 'id', description: 'Expense report ID' })
  @ApiResponse({
    status: 204,
    description: 'Expense report deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Expense report not found',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Cannot delete report with current status',
    type: ErrorResponseDto,
  })
  remove(@Param('id') id: string): Promise<void> {
    return this.expenseReportsService.remove(id);
  }

  @Patch(':id/submit')
  @ApiOperation({ summary: 'Submit an expense report (CREATED -> SUBMITTED)' })
  @ApiParam({ name: 'id', description: 'Expense report ID' })
  @ApiResponse({
    status: 200,
    description: 'Expense report submitted successfully',
    type: ExpenseReportResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid status transition',
    type: ErrorResponseDto,
  })
  submit(@Param('id') id: string): Promise<ExpenseReportResponseDto> {
    return this.expenseReportsService.submitReport(id);
  }

  @Patch(':id/validate')
  @ApiOperation({ summary: 'Validate an expense report (SUBMITTED -> VALIDATED) - V2' })
  @ApiParam({ name: 'id', description: 'Expense report ID' })
  @ApiResponse({
    status: 200,
    description: 'Expense report validated successfully',
    type: ExpenseReportResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid status transition',
    type: ErrorResponseDto,
  })
  validate(@Param('id') id: string): Promise<ExpenseReportResponseDto> {
    return this.expenseReportsService.validateReport(id);
  }

  @Patch(':id/reject')
  @ApiOperation({ summary: 'Reject an expense report (SUBMITTED -> REJECTED) - V2' })
  @ApiParam({ name: 'id', description: 'Expense report ID' })
  @ApiResponse({
    status: 200,
    description: 'Expense report rejected successfully',
    type: ExpenseReportResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid status transition',
    type: ErrorResponseDto,
  })
  reject(@Param('id') id: string): Promise<ExpenseReportResponseDto> {
    return this.expenseReportsService.rejectReport(id);
  }

  @Patch(':id/pay')
  @ApiOperation({ summary: 'Mark an expense report as paid' })
  @ApiParam({ name: 'id', description: 'Expense report ID' })
  @ApiResponse({
    status: 200,
    description: 'Expense report marked as paid successfully',
    type: ExpenseReportResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid status transition',
    type: ErrorResponseDto,
  })
  pay(@Param('id') id: string): Promise<ExpenseReportResponseDto> {
    return this.expenseReportsService.payReport(id);
  }
}
