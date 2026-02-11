import { Test, TestingModule } from '@nestjs/testing';
import { ExpensesController } from './expenses.controller';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { ExpenseResponseDto } from './dto/expense-response.dto';
import { ExpenseStatus, ExpenseCategory } from '../common/enums';

describe('ExpensesController', () => {
  let controller: ExpensesController;
  let service: ExpensesService;

  const mockExpensesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExpensesController],
      providers: [
        {
          provide: ExpensesService,
          useValue: mockExpensesService,
        },
      ],
    }).compile();

    controller = module.get<ExpensesController>(ExpensesController);
    service = module.get<ExpensesService>(ExpensesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create an expense', async () => {
      const createDto: CreateExpenseDto = {
        reportId: 'report-123',
        category: ExpenseCategory.TRANSPORT,
        expenseName: 'Train ticket',
        description: 'Paris to Lyon',
        amount: 50.0,
        expenseDate: '2026-02-01',
      };

      const expectedResult = new ExpenseResponseDto({
        id: 'expense-123',
        reportId: createDto.reportId,
        category: createDto.category,
        expenseName: createDto.expenseName,
        description: createDto.description,
        amount: createDto.amount,
        expenseDate: new Date(createDto.expenseDate),
        status: ExpenseStatus.CREATED,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      mockExpensesService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(createDto);

      expect(result).toEqual(expectedResult);
      expect(service.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('findAll', () => {
    it('should return paginated expenses', async () => {
      const expectedResult = {
        data: [
          new ExpenseResponseDto({
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
          }),
        ],
        meta: {
          page: 1,
          limit: 10,
          total: 1,
          totalPages: 1,
        },
      };

      mockExpensesService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll({ page: 1, limit: 10 });

      expect(result).toEqual(expectedResult);
      expect(service.findAll).toHaveBeenCalledWith(
        { page: 1, limit: 10 },
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
      );
    });

    it('should pass filters to service', async () => {
      const expectedResult = {
        data: [],
        meta: { page: 1, limit: 10, total: 0, totalPages: 0 },
      };

      mockExpensesService.findAll.mockResolvedValue(expectedResult);

      await controller.findAll(
        { page: 1, limit: 10 },
        'report-123',
        ExpenseCategory.TRANSPORT,
        ExpenseStatus.CREATED,
        '2026-01-01',
        '2026-12-31',
      );

      expect(service.findAll).toHaveBeenCalledWith(
        { page: 1, limit: 10 },
        'report-123',
        ExpenseCategory.TRANSPORT,
        ExpenseStatus.CREATED,
        '2026-01-01',
        '2026-12-31',
      );
    });
  });

  describe('findOne', () => {
    it('should return an expense by id', async () => {
      const expectedResult = new ExpenseResponseDto({
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
      });

      mockExpensesService.findOne.mockResolvedValue(expectedResult);

      const result = await controller.findOne('expense-123');

      expect(result).toEqual(expectedResult);
      expect(service.findOne).toHaveBeenCalledWith('expense-123');
    });
  });

  describe('update', () => {
    it('should update an expense', async () => {
      const updateDto: UpdateExpenseDto = {
        amount: 75.0,
      };

      const expectedResult = new ExpenseResponseDto({
        id: 'expense-123',
        reportId: 'report-123',
        category: ExpenseCategory.TRANSPORT,
        expenseName: 'Train ticket',
        description: 'Paris to Lyon',
        amount: 75.0,
        expenseDate: new Date('2026-02-01'),
        status: ExpenseStatus.CREATED,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      mockExpensesService.update.mockResolvedValue(expectedResult);

      const result = await controller.update('expense-123', updateDto);

      expect(result).toEqual(expectedResult);
      expect(service.update).toHaveBeenCalledWith('expense-123', updateDto);
    });
  });

  describe('remove', () => {
    it('should remove an expense', async () => {
      mockExpensesService.remove.mockResolvedValue(undefined);

      await controller.remove('expense-123');

      expect(service.remove).toHaveBeenCalledWith('expense-123');
    });
  });
});
