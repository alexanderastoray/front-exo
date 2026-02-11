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
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { ExpenseResponseDto } from './dto/expense-response.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { ErrorResponseDto } from '../common/dto/error-response.dto';
import { FakeAuthGuard } from '../common/guards/fake-auth.guard';
import { ExpenseStatus, ExpenseCategory } from '../common/enums';

@ApiTags('expenses')
@Controller('expenses')
@UseGuards(FakeAuthGuard)
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new expense' })
  @ApiResponse({
    status: 201,
    description: 'Expense created successfully',
    type: ExpenseResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error or parent report not modifiable',
    type: ErrorResponseDto,
  })
  create(@Body() createDto: CreateExpenseDto): Promise<ExpenseResponseDto> {
    return this.expensesService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all expenses with pagination and filters' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'sortBy', required: false, type: String })
  @ApiQuery({ name: 'order', required: false, enum: ['ASC', 'DESC'] })
  @ApiQuery({ name: 'reportId', required: false, type: String })
  @ApiQuery({ name: 'category', required: false, enum: ExpenseCategory })
  @ApiQuery({ name: 'status', required: false, enum: ExpenseStatus })
  @ApiQuery({ name: 'dateFrom', required: false, type: String })
  @ApiQuery({ name: 'dateTo', required: false, type: String })
  @ApiResponse({
    status: 200,
    description: 'Expenses retrieved successfully',
  })
  findAll(
    @Query() paginationDto: PaginationDto,
    @Query('reportId') reportId?: string,
    @Query('category') category?: ExpenseCategory,
    @Query('status') status?: ExpenseStatus,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
  ) {
    return this.expensesService.findAll(paginationDto, reportId, category, status, dateFrom, dateTo);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an expense by ID' })
  @ApiParam({ name: 'id', description: 'Expense ID' })
  @ApiResponse({
    status: 200,
    description: 'Expense retrieved successfully',
    type: ExpenseResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Expense not found',
    type: ErrorResponseDto,
  })
  findOne(@Param('id') id: string): Promise<ExpenseResponseDto> {
    return this.expensesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an expense' })
  @ApiParam({ name: 'id', description: 'Expense ID' })
  @ApiResponse({
    status: 200,
    description: 'Expense updated successfully',
    type: ExpenseResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Expense not found',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Cannot modify expense in non-modifiable report',
    type: ErrorResponseDto,
  })
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateExpenseDto,
  ): Promise<ExpenseResponseDto> {
    return this.expensesService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an expense' })
  @ApiParam({ name: 'id', description: 'Expense ID' })
  @ApiResponse({
    status: 204,
    description: 'Expense deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Expense not found',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Cannot delete expense in non-modifiable report',
    type: ErrorResponseDto,
  })
  remove(@Param('id') id: string): Promise<void> {
    return this.expensesService.remove(id);
  }
}
