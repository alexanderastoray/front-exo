import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ExpenseReportsService } from './expense-reports.service';
import { ExpenseReport } from './entities/expense-report.entity';
import { CreateExpenseReportDto } from './dto/create-expense-report.dto';
import { UpdateExpenseReportDto } from './dto/update-expense-report.dto';
import { ReportStatus } from '../common/enums';

const createMockRepository = () => ({
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
  find: jest.fn(),
  remove: jest.fn(),
  update: jest.fn(),
  createQueryBuilder: jest.fn(() => ({
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    leftJoin: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getOne: jest.fn(),
    getManyAndCount: jest.fn(),
    getRawOne: jest.fn(),
  })),
});

describe('ExpenseReportsService', () => {
  let service: ExpenseReportsService;
  let repository: ReturnType<typeof createMockRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExpenseReportsService,
        {
          provide: getRepositoryToken(ExpenseReport),
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    service = module.get<ExpenseReportsService>(ExpenseReportsService);
    repository = module.get(getRepositoryToken(ExpenseReport));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new expense report', async () => {
      const createDto: CreateExpenseReportDto = {
        purpose: 'Business trip to Paris',
        reportDate: '2026-02-01',
        userId: 'user-123',
      };

      const report = {
        id: 'report-123',
        purpose: createDto.purpose,
        reportDate: createDto.reportDate,
        userId: createDto.userId,
        status: ReportStatus.CREATED,
        totalAmount: 0,
        paymentDate: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      repository.create.mockReturnValue(report);
      repository.save.mockResolvedValue(report);

      const result = await service.create(createDto);

      expect(repository.create).toHaveBeenCalledWith({
        ...createDto,
        status: ReportStatus.CREATED,
        totalAmount: 0,
        paymentDate: null,
      });
      expect(repository.save).toHaveBeenCalledWith(report);
      expect(result).toHaveProperty('id', 'report-123');
      expect(result).toHaveProperty('status', ReportStatus.CREATED);
      expect(result).toHaveProperty('totalAmount', 0);
    });
  });

  describe('findAll', () => {
    it('should return paginated expense reports', async () => {
      const reports = [
        {
          id: 'report-1',
          purpose: 'Trip 1',
          reportDate: new Date('2026-02-01'),
          userId: 'user-123',
          status: ReportStatus.CREATED,
          totalAmount: 100,
          paymentDate: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      const mockQueryBuilder = {
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([reports, 1]),
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

    it('should apply userId filter', async () => {
      const mockQueryBuilder = {
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
      } as any;

      repository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      await service.findAll({ page: 1, limit: 10 }, 'user-123');

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'report.userId = :userId',
        { userId: 'user-123' },
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

      await service.findAll({ page: 1, limit: 10 }, undefined, ReportStatus.SUBMITTED);

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'report.status = :status',
        { status: ReportStatus.SUBMITTED },
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
        '2026-01-01',
        '2026-12-31',
      );

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'report.reportDate >= :dateFrom',
        { dateFrom: '2026-01-01' },
      );
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'report.reportDate <= :dateTo',
        { dateTo: '2026-12-31' },
      );
    });
  });

  describe('findOne', () => {
    it('should return an expense report by id', async () => {
      const report = {
        id: 'report-123',
        purpose: 'Business trip',
        reportDate: new Date('2026-02-01'),
        userId: 'user-123',
        status: ReportStatus.CREATED,
        totalAmount: 100,
        paymentDate: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(report),
      } as any;

      repository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await service.findOne('report-123');

      expect(mockQueryBuilder.where).toHaveBeenCalledWith('report.id = :id', {
        id: 'report-123',
      });
      expect(result).toHaveProperty('id', 'report-123');
    });

    it('should include user when requested', async () => {
      const report = {
        id: 'report-123',
        purpose: 'Business trip',
        reportDate: new Date('2026-02-01'),
        userId: 'user-123',
        status: ReportStatus.CREATED,
        totalAmount: 100,
        paymentDate: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(report),
      } as any;

      repository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      await service.findOne('report-123', true);

      expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith('report.user', 'user');
    });

    it('should throw NotFoundException if report not found', async () => {
      const mockQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      } as any;

      repository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      await expect(service.findOne('non-existent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update an expense report', async () => {
      const updateDto: UpdateExpenseReportDto = {
        purpose: 'Updated purpose',
      };

      const existingReport = {
        id: 'report-123',
        purpose: 'Old purpose',
        reportDate: new Date('2026-02-01'),
        userId: 'user-123',
        status: ReportStatus.CREATED,
        totalAmount: 100,
        paymentDate: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updatedReport = { ...existingReport, ...updateDto };

      repository.findOne.mockResolvedValue(existingReport);
      repository.save.mockResolvedValue(updatedReport);

      const result = await service.update('report-123', updateDto);

      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 'report-123' } });
      expect(repository.save).toHaveBeenCalled();
      expect(result).toHaveProperty('purpose', 'Updated purpose');
    });

    it('should throw NotFoundException if report not found', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(
        service.update('non-existent', { purpose: 'Test' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if report cannot be modified', async () => {
      const report = {
        id: 'report-123',
        status: ReportStatus.PAID,
        purpose: 'Test',
        reportDate: new Date('2026-02-01'),
        userId: 'user-123',
        totalAmount: 100,
        paymentDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      repository.findOne.mockResolvedValue(report);

      await expect(
        service.update('report-123', { purpose: 'Updated' }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('remove', () => {
    it('should remove an expense report', async () => {
      const report = {
        id: 'report-123',
        purpose: 'Test',
        reportDate: new Date('2026-02-01'),
        userId: 'user-123',
        status: ReportStatus.CREATED,
        totalAmount: 100,
        paymentDate: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      repository.findOne.mockResolvedValue(report);
      repository.remove.mockResolvedValue(report);

      await service.remove('report-123');

      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 'report-123' } });
      expect(repository.remove).toHaveBeenCalledWith(report);
    });

    it('should throw NotFoundException if report not found', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.remove('non-existent')).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if report cannot be deleted', async () => {
      const report = {
        id: 'report-123',
        status: ReportStatus.SUBMITTED,
        purpose: 'Test',
        reportDate: new Date('2026-02-01'),
        userId: 'user-123',
        totalAmount: 100,
        paymentDate: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      repository.findOne.mockResolvedValue(report);

      await expect(service.remove('report-123')).rejects.toThrow(BadRequestException);
    });
  });

  describe('submitReport', () => {
    it('should submit an expense report', async () => {
      const report = {
        id: 'report-123',
        purpose: 'Test',
        reportDate: new Date('2026-02-01'),
        userId: 'user-123',
        status: ReportStatus.CREATED,
        totalAmount: 100,
        paymentDate: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const submittedReport = { ...report, status: ReportStatus.SUBMITTED };

      repository.findOne.mockResolvedValue(report);
      repository.save.mockResolvedValue(submittedReport);

      const result = await service.submitReport('report-123');

      expect(result).toHaveProperty('status', ReportStatus.SUBMITTED);
    });

    it('should throw NotFoundException if report not found', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.submitReport('non-existent')).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException for invalid transition', async () => {
      const report = {
        id: 'report-123',
        status: ReportStatus.PAID,
        purpose: 'Test',
        reportDate: new Date('2026-02-01'),
        userId: 'user-123',
        totalAmount: 100,
        paymentDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      repository.findOne.mockResolvedValue(report);

      await expect(service.submitReport('report-123')).rejects.toThrow(BadRequestException);
    });
  });

  describe('validateReport', () => {
    it('should validate an expense report', async () => {
      const report = {
        id: 'report-123',
        purpose: 'Test',
        reportDate: new Date('2026-02-01'),
        userId: 'user-123',
        status: ReportStatus.SUBMITTED,
        totalAmount: 100,
        paymentDate: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const validatedReport = { ...report, status: ReportStatus.VALIDATED };

      repository.findOne.mockResolvedValue(report);
      repository.save.mockResolvedValue(validatedReport);

      const result = await service.validateReport('report-123');

      expect(result).toHaveProperty('status', ReportStatus.VALIDATED);
    });

    it('should throw NotFoundException if report not found', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.validateReport('non-existent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('rejectReport', () => {
    it('should reject an expense report', async () => {
      const report = {
        id: 'report-123',
        purpose: 'Test',
        reportDate: new Date('2026-02-01'),
        userId: 'user-123',
        status: ReportStatus.SUBMITTED,
        totalAmount: 100,
        paymentDate: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const rejectedReport = { ...report, status: ReportStatus.REJECTED };

      repository.findOne.mockResolvedValue(report);
      repository.save.mockResolvedValue(rejectedReport);

      const result = await service.rejectReport('report-123');

      expect(result).toHaveProperty('status', ReportStatus.REJECTED);
    });

    it('should throw NotFoundException if report not found', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.rejectReport('non-existent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('payReport', () => {
    it('should mark an expense report as paid', async () => {
      const report = {
        id: 'report-123',
        purpose: 'Test',
        reportDate: new Date('2026-02-01'),
        userId: 'user-123',
        status: ReportStatus.VALIDATED,
        totalAmount: 100,
        paymentDate: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const paidReport = {
        ...report,
        status: ReportStatus.PAID,
        paymentDate: new Date(),
      };

      repository.findOne.mockResolvedValue(report);
      repository.save.mockResolvedValue(paidReport);

      const result = await service.payReport('report-123');

      expect(result).toHaveProperty('status', ReportStatus.PAID);
      expect(result).toHaveProperty('paymentDate');
    });

    it('should throw NotFoundException if report not found', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.payReport('non-existent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('recalculateTotalAmount', () => {
    it('should recalculate total amount for a report', async () => {
      const mockQueryBuilder = {
        leftJoin: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getRawOne: jest.fn().mockResolvedValue({ total: '250.50' }),
      } as any;

      repository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      await service.recalculateTotalAmount('report-123');

      expect(mockQueryBuilder.leftJoin).toHaveBeenCalled();
      expect(mockQueryBuilder.select).toHaveBeenCalled();
      expect(mockQueryBuilder.where).toHaveBeenCalledWith('report.id = :reportId', {
        reportId: 'report-123',
      });
      expect(repository.update).toHaveBeenCalledWith('report-123', { totalAmount: 250.5 });
    });

    it('should handle zero total amount', async () => {
      const mockQueryBuilder = {
        leftJoin: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getRawOne: jest.fn().mockResolvedValue({ total: '0' }),
      } as any;

      repository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      await service.recalculateTotalAmount('report-123');

      expect(repository.update).toHaveBeenCalledWith('report-123', { totalAmount: 0 });
    });
  });
});
