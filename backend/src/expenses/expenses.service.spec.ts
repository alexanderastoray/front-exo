import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { Expense } from './entities/expense.entity';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { ExpenseStatus, ExpenseCategory } from '../common/enums';
import { ExpenseReportsService } from '../expense-reports/expense-reports.service';
import { ReportStatus } from '../common/enums';

const createMockRepository = () => ({
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
  find: jest.fn(),
  remove: jest.fn(),
  createQueryBuilder: jest.fn(() => ({
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn(),
  })),
});

const mockExpenseReportsService = {
  findOne: jest.fn(),
  recalculateTotalAmount: jest.fn(),
};

describe('ExpensesService', () => {
  let service: ExpensesService;
  let repository: ReturnType<typeof createMockRepository>;
  let expenseReportsService: typeof mockExpenseReportsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExpensesService,
        {
          provide: getRepositoryToken(Expense),
          useValue: createMockRepository(),
        },
        {
          provide: ExpenseReportsService,
          useValue: mockExpenseReportsService,
        },
      ],
    }).compile();

    service = module.get<ExpensesService>(ExpensesService);
    repository = module.get(getRepositoryToken(Expense));
    expenseReportsService = module.get(ExpenseReportsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new expense', async () => {
      const createDto: CreateExpenseDto = {
        reportId: 'report-123',
        category: ExpenseCategory.TRANSPORT,
        expenseName: 'Train ticket',
        description: 'Paris to Lyon',
        amount: 50.0,
        expenseDate: new Date('2026-02-01'),
      };

      const report = {
        id: 'report-123',
        status: ReportStatus.CREATED,
        purpose: 'Business trip',
        reportDate: new Date('2026-02-01'),
        userId: 'user-123',
        totalAmount: 0,
        paymentDate: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const expense = {
        id: 'expense-123',
        ...createDto,
        status: ExpenseStatus.CREATED,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockExpenseReportsService.findOne.mockResolvedValue(report);
      repository.create.mockReturnValue(expense);
      repository.save.mockResolvedValue(expense);
      mockExpenseReportsService.recalculateTotalAmount.mockResolvedValue(undefined);

      const result = await service.create(createDto);

      expect(expenseReportsService.findOne).toHaveBeenCalledWith(createDto.reportId);
      expect(repository.create).toHaveBeenCalledWith({
        ...createDto,
        status: ExpenseStatus.CREATED,
      });
      expect(repository.save).toHaveBeenCalledWith(expense);
      expect(expenseReportsService.recalculateTotalAmount).toHaveBeenCalledWith(
        createDto.reportId,
      );
      expect(result).toHaveProperty('id', 'expense-123');
    });

    it('should throw BadRequestException if report is not modifiable', async () => {
      const createDto: CreateExpenseDto = {
        reportId: 'report-123',
        category: ExpenseCategory.TRANSPORT,
        expenseName: 'Train ticket',
        description: 'Paris to Lyon',
        amount: 50.0,
        expenseDate: new Date('2026-02-01'),
      };

      const report = {
        id: 'report-123',
        status: ReportStatus.PAID,
        purpose: 'Business trip',
        reportDate: new Date('2026-02-01'),
        userId: 'user-123',
        totalAmount: 100,
        paymentDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockExpenseReportsService.findOne.mockResolvedValue(report);

      await expect(service.create(createDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return paginated expenses', async () => {
      const expenses = [
        {
          id: 'expense-1',
          reportId: 'report-123',
          category: ExpenseCategory.TRANSPORT,
          expenseName: 'Train ticket',
          description: 'Paris to Lyon',
          amount: 50.0,
          expenseDate: new Date('2026-02-01'),
          status: ExpenseStatus.CREATED,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      const mockQueryBuilder = {
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([expenses, 1]),
      } as any;

      repository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await service.findAll({ page: 1, limit: 10 });

      expect(result.data).toHaveLength(1);
      expect(result.meta).toEqual({
        page: 1,
        limit: 10,
        total: 1,
        totalPages: 1,
      });
    });

    it('should apply reportId filter', async () => {
      const mockQueryBuilder = {
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
      } as any;

      repository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      await service.findAll({ page: 1, limit: 10 }, 'report-123');

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'expense.reportId = :reportId',
        { reportId: 'report-123' },
      );
    });

    it('should apply category filter', async () => {
      const mockQueryBuilder = {
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
      } as any;

      repository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      await service.findAll({ page: 1, limit: 10 }, undefined, ExpenseCategory.TRANSPORT);

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'expense.category = :category',
        { category: ExpenseCategory.TRANSPORT },
      );
    });

    it('should apply status filter', async () => {
      const mockQueryBuilder = {
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
      } as any;

      repository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      await service.findAll({ page: 1, limit: 10 }, undefined, undefined, ExpenseStatus.CREATED);

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'expense.status = :status',
        { status: ExpenseStatus.CREATED },
      );
    });

    it('should apply date filters', async () => {
      const mockQueryBuilder = {
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
      } as any;

      repository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      await service.findAll(
        { page: 1, limit: 10 },
        undefined,
        undefined,
        undefined,
        '2026-01-01',
        '2026-12-31',
      );

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'expense.expenseDate >= :dateFrom',
        { dateFrom: '2026-01-01' },
      );
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'expense.expenseDate <= :dateTo',
        { dateTo: '2026-12-31' },
      );
    });
  });

  describe('findOne', () => {
    it('should return an expense by id', async () => {
      const expense = {
        id: 'expense-123',
        reportId: 'report-123',
        category: ExpenseCategory.TRANSPORT,
        expenseName: 'Train ticket',
        description: 'Paris to Lyon',
        amount: 50.0,
        expenseDate: new Date('2026-02-01'),
        status: ExpenseStatus.CREATED,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      repository.findOne.mockResolvedValue(expense);

      const result = await service.findOne('expense-123');

      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 'expense-123' } });
      expect(result).toHaveProperty('id', 'expense-123');
    });

    it('should throw NotFoundException if expense not found', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.findOne('non-existent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update an expense', async () => {
      const updateDto: UpdateExpenseDto = {
        amount: 75.0,
      };

      const existingExpense = {
        id: 'expense-123',
        reportId: 'report-123',
        category: ExpenseCategory.TRANSPORT,
        expenseName: 'Train ticket',
        description: 'Paris to Lyon',
        amount: 50.0,
        expenseDate: new Date('2026-02-01'),
        status: ExpenseStatus.CREATED,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const report = {
        id: 'report-123',
        status: ReportStatus.CREATED,
        purpose: 'Business trip',
        reportDate: new Date('2026-02-01'),
        userId: 'user-123',
        totalAmount: 50,
        paymentDate: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updatedExpense = { ...existingExpense, ...updateDto };

      repository.findOne.mockResolvedValue(existingExpense);
      mockExpenseReportsService.findOne.mockResolvedValue(report);
      repository.save.mockResolvedValue(updatedExpense);
      mockExpenseReportsService.recalculateTotalAmount.mockResolvedValue(undefined);

      const result = await service.update('expense-123', updateDto);

      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 'expense-123' } });
      expect(expenseReportsService.findOne).toHaveBeenCalledWith('report-123');
      expect(repository.save).toHaveBeenCalled();
      expect(expenseReportsService.recalculateTotalAmount).toHaveBeenCalledWith('report-123');
      expect(result).toHaveProperty('amount', 75.0);
    });

    it('should throw NotFoundException if expense not found', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.update('non-existent', { amount: 100 })).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException if report is not modifiable', async () => {
      const expense = {
        id: 'expense-123',
        reportId: 'report-123',
        category: ExpenseCategory.TRANSPORT,
        expenseName: 'Train ticket',
        description: 'Paris to Lyon',
        amount: 50.0,
        expenseDate: new Date('2026-02-01'),
        status: ExpenseStatus.CREATED,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const report = {
        id: 'report-123',
        status: ReportStatus.PAID,
        purpose: 'Business trip',
        reportDate: new Date('2026-02-01'),
        userId: 'user-123',
        totalAmount: 100,
        paymentDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      repository.findOne.mockResolvedValue(expense);
      mockExpenseReportsService.findOne.mockResolvedValue(report);

      await expect(service.update('expense-123', { amount: 100 })).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should not recalculate if amount not changed', async () => {
      const updateDto: UpdateExpenseDto = {
        description: 'Updated description',
      };

      const existingExpense = {
        id: 'expense-123',
        reportId: 'report-123',
        category: ExpenseCategory.TRANSPORT,
        expenseName: 'Train ticket',
        description: 'Paris to Lyon',
        amount: 50.0,
        expenseDate: new Date('2026-02-01'),
        status: ExpenseStatus.CREATED,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const report = {
        id: 'report-123',
        status: ReportStatus.CREATED,
        purpose: 'Business trip',
        reportDate: new Date('2026-02-01'),
        userId: 'user-123',
        totalAmount: 50,
        paymentDate: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      repository.findOne.mockResolvedValue(existingExpense);
      mockExpenseReportsService.findOne.mockResolvedValue(report);
      repository.save.mockResolvedValue({ ...existingExpense, ...updateDto });

      await service.update('expense-123', updateDto);

      expect(expenseReportsService.recalculateTotalAmount).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should remove an expense', async () => {
      const expense = {
        id: 'expense-123',
        reportId: 'report-123',
        category: ExpenseCategory.TRANSPORT,
        expenseName: 'Train ticket',
        description: 'Paris to Lyon',
        amount: 50.0,
        expenseDate: new Date('2026-02-01'),
        status: ExpenseStatus.CREATED,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const report = {
        id: 'report-123',
        status: ReportStatus.CREATED,
        purpose: 'Business trip',
        reportDate: new Date('2026-02-01'),
        userId: 'user-123',
        totalAmount: 50,
        paymentDate: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      repository.findOne.mockResolvedValue(expense);
      mockExpenseReportsService.findOne.mockResolvedValue(report);
      repository.remove.mockResolvedValue(expense);
      mockExpenseReportsService.recalculateTotalAmount.mockResolvedValue(undefined);

      await service.remove('expense-123');

      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 'expense-123' } });
      expect(expenseReportsService.findOne).toHaveBeenCalledWith('report-123');
      expect(repository.remove).toHaveBeenCalledWith(expense);
      expect(expenseReportsService.recalculateTotalAmount).toHaveBeenCalledWith('report-123');
    });

    it('should throw NotFoundException if expense not found', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.remove('non-existent')).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if report is not modifiable', async () => {
      const expense = {
        id: 'expense-123',
        reportId: 'report-123',
        category: ExpenseCategory.TRANSPORT,
        expenseName: 'Train ticket',
        description: 'Paris to Lyon',
        amount: 50.0,
        expenseDate: new Date('2026-02-01'),
        status: ExpenseStatus.CREATED,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const report = {
        id: 'report-123',
        status: ReportStatus.PAID,
        purpose: 'Business trip',
        reportDate: new Date('2026-02-01'),
        userId: 'user-123',
        totalAmount: 100,
        paymentDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      repository.findOne.mockResolvedValue(expense);
      mockExpenseReportsService.findOne.mockResolvedValue(report);

      await expect(service.remove('expense-123')).rejects.toThrow(BadRequestException);
    });
  });

  describe('findByReportId', () => {
    it('should return expenses for a report', async () => {
      const expenses = [
        {
          id: 'expense-1',
          reportId: 'report-123',
          category: ExpenseCategory.TRANSPORT,
          expenseName: 'Train ticket',
          description: 'Paris to Lyon',
          amount: 50.0,
          expenseDate: new Date('2026-02-01'),
          status: ExpenseStatus.CREATED,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      repository.find.mockResolvedValue(expenses);

      const result = await service.findByReportId('report-123');

      expect(repository.find).toHaveBeenCalledWith({
        where: { reportId: 'report-123' },
        order: { createdAt: 'DESC' },
      });
      expect(result).toHaveLength(1);
      expect(result[0]).toHaveProperty('id', 'expense-1');
    });
  });
});
