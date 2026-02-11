import { Test, TestingModule } from '@nestjs/testing';
import { ExpenseReportsController } from './expense-reports.controller';
import { ExpenseReportsService } from './expense-reports.service';
import { ExpensesService } from '../expenses/expenses.service';
import { CreateExpenseReportDto } from './dto/create-expense-report.dto';
import { UpdateExpenseReportDto } from './dto/update-expense-report.dto';
import { ExpenseReportResponseDto } from './dto/expense-report-response.dto';
import { ReportStatus } from '../common/enums';

describe('ExpenseReportsController', () => {
  let controller: ExpenseReportsController;
  let expenseReportsService: ExpenseReportsService;
  let expensesService: ExpensesService;

  const mockExpenseReportsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    submitReport: jest.fn(),
    validateReport: jest.fn(),
    rejectReport: jest.fn(),
    payReport: jest.fn(),
  };

  const mockExpensesService = {
    findByReportId: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExpenseReportsController],
      providers: [
        {
          provide: ExpenseReportsService,
          useValue: mockExpenseReportsService,
        },
        {
          provide: ExpensesService,
          useValue: mockExpensesService,
        },
      ],
    }).compile();

    controller = module.get<ExpenseReportsController>(ExpenseReportsController);
    expenseReportsService = module.get<ExpenseReportsService>(ExpenseReportsService);
    expensesService = module.get<ExpensesService>(ExpensesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create an expense report', async () => {
      const createDto: CreateExpenseReportDto = {
        purpose: 'Business trip to Paris',
        reportDate: '2026-02-01',
        userId: 'user-123',
      };

      const expectedResult = new ExpenseReportResponseDto({
        id: 'report-123',
        purpose: createDto.purpose,
        reportDate: new Date(createDto.reportDate),
        userId: createDto.userId,
        status: ReportStatus.CREATED,
        totalAmount: 0,
        paymentDate: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      mockExpenseReportsService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(createDto);

      expect(result).toEqual(expectedResult);
      expect(expenseReportsService.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('findAll', () => {
    it('should return paginated expense reports', async () => {
      const expectedResult = {
        data: [
          new ExpenseReportResponseDto({
            id: 'report-1',
            purpose: 'Trip 1',
            reportDate: new Date('2026-02-01'),
            userId: 'user-123',
            status: ReportStatus.CREATED,
            totalAmount: 100,
            paymentDate: null,
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

      mockExpenseReportsService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll({ page: 1, limit: 10 });

      expect(result).toEqual(expectedResult);
      expect(expenseReportsService.findAll).toHaveBeenCalledWith(
        { page: 1, limit: 10 },
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

      mockExpenseReportsService.findAll.mockResolvedValue(expectedResult);

      await controller.findAll(
        { page: 1, limit: 10 },
        'user-123',
        ReportStatus.SUBMITTED,
        '2026-01-01',
        '2026-12-31',
      );

      expect(expenseReportsService.findAll).toHaveBeenCalledWith(
        { page: 1, limit: 10 },
        'user-123',
        ReportStatus.SUBMITTED,
        '2026-01-01',
        '2026-12-31',
      );
    });
  });

  describe('findOne', () => {
    it('should return an expense report by id', async () => {
      const expectedResult = new ExpenseReportResponseDto({
        id: 'report-123',
        purpose: 'Business trip',
        reportDate: new Date('2026-02-01'),
        userId: 'user-123',
        status: ReportStatus.CREATED,
        totalAmount: 100,
        paymentDate: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      mockExpenseReportsService.findOne.mockResolvedValue(expectedResult);

      const result = await controller.findOne('report-123');

      expect(result).toEqual(expectedResult);
      expect(expenseReportsService.findOne).toHaveBeenCalledWith('report-123');
    });
  });

  describe('findExpenses', () => {
    it('should return expenses for a report', async () => {
      const expectedResult = {
        data: [],
        meta: { page: 1, limit: 10, total: 0, totalPages: 0 },
      };

      mockExpensesService.findByReportId.mockResolvedValue(expectedResult);

      const result = await controller.findExpenses('report-123');

      expect(result).toEqual(expectedResult);
      expect(expensesService.findByReportId).toHaveBeenCalledWith('report-123');
    });
  });

  describe('update', () => {
    it('should update an expense report', async () => {
      const updateDto: UpdateExpenseReportDto = {
        purpose: 'Updated purpose',
      };

      const expectedResult = new ExpenseReportResponseDto({
        id: 'report-123',
        purpose: 'Updated purpose',
        reportDate: new Date('2026-02-01'),
        userId: 'user-123',
        status: ReportStatus.CREATED,
        totalAmount: 100,
        paymentDate: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      mockExpenseReportsService.update.mockResolvedValue(expectedResult);

      const result = await controller.update('report-123', updateDto);

      expect(result).toEqual(expectedResult);
      expect(expenseReportsService.update).toHaveBeenCalledWith('report-123', updateDto);
    });
  });

  describe('remove', () => {
    it('should remove an expense report', async () => {
      mockExpenseReportsService.remove.mockResolvedValue(undefined);

      await controller.remove('report-123');

      expect(expenseReportsService.remove).toHaveBeenCalledWith('report-123');
    });
  });

  describe('submit', () => {
    it('should submit an expense report', async () => {
      const expectedResult = new ExpenseReportResponseDto({
        id: 'report-123',
        purpose: 'Business trip',
        reportDate: new Date('2026-02-01'),
        userId: 'user-123',
        status: ReportStatus.SUBMITTED,
        totalAmount: 100,
        paymentDate: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      mockExpenseReportsService.submitReport.mockResolvedValue(expectedResult);

      const result = await controller.submit('report-123');

      expect(result).toEqual(expectedResult);
      expect(expenseReportsService.submitReport).toHaveBeenCalledWith('report-123');
    });
  });

  describe('validate', () => {
    it('should validate an expense report', async () => {
      const expectedResult = new ExpenseReportResponseDto({
        id: 'report-123',
        purpose: 'Business trip',
        reportDate: new Date('2026-02-01'),
        userId: 'user-123',
        status: ReportStatus.VALIDATED,
        totalAmount: 100,
        paymentDate: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      mockExpenseReportsService.validateReport.mockResolvedValue(expectedResult);

      const result = await controller.validate('report-123');

      expect(result).toEqual(expectedResult);
      expect(expenseReportsService.validateReport).toHaveBeenCalledWith('report-123');
    });
  });

  describe('reject', () => {
    it('should reject an expense report', async () => {
      const expectedResult = new ExpenseReportResponseDto({
        id: 'report-123',
        purpose: 'Business trip',
        reportDate: new Date('2026-02-01'),
        userId: 'user-123',
        status: ReportStatus.REJECTED,
        totalAmount: 100,
        paymentDate: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      mockExpenseReportsService.rejectReport.mockResolvedValue(expectedResult);

      const result = await controller.reject('report-123');

      expect(result).toEqual(expectedResult);
      expect(expenseReportsService.rejectReport).toHaveBeenCalledWith('report-123');
    });
  });

  describe('pay', () => {
    it('should mark an expense report as paid', async () => {
      const expectedResult = new ExpenseReportResponseDto({
        id: 'report-123',
        purpose: 'Business trip',
        reportDate: new Date('2026-02-01'),
        userId: 'user-123',
        status: ReportStatus.PAID,
        totalAmount: 100,
        paymentDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      mockExpenseReportsService.payReport.mockResolvedValue(expectedResult);

      const result = await controller.pay('report-123');

      expect(result).toEqual(expectedResult);
      expect(expenseReportsService.payReport).toHaveBeenCalledWith('report-123');
    });
  });
});
