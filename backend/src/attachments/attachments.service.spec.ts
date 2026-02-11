import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AttachmentsService } from './attachments.service';
import { Attachment } from './entities/attachment.entity';
import { FileStorageHelper } from './helpers/file-storage.helper';
import { ExpensesService } from '../expenses/expenses.service';

const createMockRepository = () => ({
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
  find: jest.fn(),
  remove: jest.fn(),
});

describe('AttachmentsService', () => {
  let service: AttachmentsService;
  let repository: ReturnType<typeof createMockRepository>;
  let fileStorageHelper: FileStorageHelper;
  let expensesService: ExpensesService;
  let configService: ConfigService;

  const mockFileStorageHelper = {
    validateFileType: jest.fn(),
    validateFileSize: jest.fn(),
    saveFile: jest.fn(),
    deleteFile: jest.fn(),
    getFileStream: jest.fn(),
  };

  const mockExpensesService = {
    findOne: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AttachmentsService,
        {
          provide: getRepositoryToken(Attachment),
          useValue: createMockRepository(),
        },
        {
          provide: FileStorageHelper,
          useValue: mockFileStorageHelper,
        },
        {
          provide: ExpensesService,
          useValue: mockExpensesService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<AttachmentsService>(AttachmentsService);
    repository = module.get(getRepositoryToken(Attachment));
    fileStorageHelper = module.get<FileStorageHelper>(FileStorageHelper);
    expensesService = module.get<ExpensesService>(ExpensesService);
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('uploadAttachment', () => {
    const mockFile = {
      originalname: 'receipt.pdf',
      mimetype: 'application/pdf',
      size: 1024,
      buffer: Buffer.from('file content'),
    } as Express.Multer.File;

    it('should upload attachment successfully when all validations pass', async () => {
      const expense = {
        id: 'expense-123',
        reportId: 'report-123',
        expenseName: 'Test expense',
      };

      const savedAttachment = {
        id: 'attachment-123',
        expenseId: 'expense-123',
        fileName: 'receipt.pdf',
        filePath: '/uploads/expense-123/file.pdf',
        mimeType: 'application/pdf',
        size: 1024,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockExpensesService.findOne.mockResolvedValue(expense);
      mockFileStorageHelper.validateFileType.mockReturnValue(true);
      mockFileStorageHelper.validateFileSize.mockReturnValue(true);
      mockFileStorageHelper.saveFile.mockResolvedValue({
        filePath: '/uploads/expense-123/file.pdf',
        fileName: 'receipt.pdf',
      });
      repository.create.mockReturnValue(savedAttachment);
      repository.save.mockResolvedValue(savedAttachment);
      mockConfigService.get.mockReturnValue('api');

      const result = await service.uploadAttachment('expense-123', mockFile);

      expect(expensesService.findOne).toHaveBeenCalledWith('expense-123');
      expect(fileStorageHelper.validateFileType).toHaveBeenCalledWith('application/pdf');
      expect(fileStorageHelper.validateFileSize).toHaveBeenCalledWith(1024);
      expect(fileStorageHelper.saveFile).toHaveBeenCalledWith('expense-123', mockFile);
      expect(repository.create).toHaveBeenCalledWith({
        expenseId: 'expense-123',
        fileName: 'receipt.pdf',
        filePath: '/uploads/expense-123/file.pdf',
        mimeType: 'application/pdf',
        size: 1024,
      });
      expect(repository.save).toHaveBeenCalled();
      expect(result.id).toBe('attachment-123');
      expect(result.downloadUrl).toContain('/attachments/attachment-123/download');
    });

    it('should throw NotFoundException when expense does not exist', async () => {
      mockExpensesService.findOne.mockRejectedValue(
        new NotFoundException('Expense with ID expense-123 not found'),
      );

      await expect(service.uploadAttachment('expense-123', mockFile)).rejects.toThrow(
        NotFoundException,
      );
      expect(expensesService.findOne).toHaveBeenCalledWith('expense-123');
      expect(fileStorageHelper.validateFileType).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when file type is invalid', async () => {
      const expense = { id: 'expense-123' };

      mockExpensesService.findOne.mockResolvedValue(expense);
      mockFileStorageHelper.validateFileType.mockReturnValue(false);
      mockConfigService.get.mockReturnValue(['image/jpeg', 'image/png', 'application/pdf']);

      await expect(service.uploadAttachment('expense-123', mockFile)).rejects.toThrow(
        BadRequestException,
      );
      expect(fileStorageHelper.validateFileType).toHaveBeenCalledWith('application/pdf');
      expect(fileStorageHelper.saveFile).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when file size exceeds limit', async () => {
      const expense = { id: 'expense-123' };
      const largeFile = {
        ...mockFile,
        size: 10485760, // 10MB
      } as Express.Multer.File;

      mockExpensesService.findOne.mockResolvedValue(expense);
      mockFileStorageHelper.validateFileType.mockReturnValue(true);
      mockFileStorageHelper.validateFileSize.mockReturnValue(false);
      mockConfigService.get.mockReturnValue(5242880); // 5MB

      await expect(service.uploadAttachment('expense-123', largeFile)).rejects.toThrow(
        BadRequestException,
      );
      expect(fileStorageHelper.validateFileSize).toHaveBeenCalledWith(10485760);
      expect(fileStorageHelper.saveFile).not.toHaveBeenCalled();
    });
  });

  describe('findByExpenseId', () => {
    it('should return all attachments for an expense', async () => {
      const attachments = [
        {
          id: 'attachment-1',
          expenseId: 'expense-123',
          fileName: 'receipt1.pdf',
          filePath: '/uploads/expense-123/file1.pdf',
          mimeType: 'application/pdf',
          size: 1024,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'attachment-2',
          expenseId: 'expense-123',
          fileName: 'receipt2.jpg',
          filePath: '/uploads/expense-123/file2.jpg',
          mimeType: 'image/jpeg',
          size: 2048,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      repository.find.mockResolvedValue(attachments);
      mockConfigService.get.mockReturnValue('api');

      const result = await service.findByExpenseId('expense-123');

      expect(repository.find).toHaveBeenCalledWith({
        where: { expenseId: 'expense-123' },
        order: { createdAt: 'DESC' },
      });
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('attachment-1');
      expect(result[1].id).toBe('attachment-2');
    });

    it('should return empty array when expense has no attachments', async () => {
      repository.find.mockResolvedValue([]);

      const result = await service.findByExpenseId('expense-123');

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return attachment when it exists', async () => {
      const attachment = {
        id: 'attachment-123',
        expenseId: 'expense-123',
        fileName: 'receipt.pdf',
        filePath: '/uploads/expense-123/file.pdf',
        mimeType: 'application/pdf',
        size: 1024,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      repository.findOne.mockResolvedValue(attachment);

      const result = await service.findOne('attachment-123');

      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 'attachment-123' } });
      expect(result).toEqual(attachment);
    });

    it('should throw NotFoundException when attachment does not exist', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.findOne('attachment-123')).rejects.toThrow(NotFoundException);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 'attachment-123' } });
    });
  });

  describe('remove', () => {
    it('should delete attachment and file when attachment exists', async () => {
      const attachment = {
        id: 'attachment-123',
        expenseId: 'expense-123',
        fileName: 'receipt.pdf',
        filePath: '/uploads/expense-123/file.pdf',
        mimeType: 'application/pdf',
        size: 1024,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      repository.findOne.mockResolvedValue(attachment);
      mockFileStorageHelper.deleteFile.mockResolvedValue(undefined);
      repository.remove.mockResolvedValue(attachment);

      await service.remove('attachment-123');

      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 'attachment-123' } });
      expect(fileStorageHelper.deleteFile).toHaveBeenCalledWith('/uploads/expense-123/file.pdf');
      expect(repository.remove).toHaveBeenCalledWith(attachment);
    });

    it('should throw NotFoundException when attachment does not exist', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.remove('attachment-123')).rejects.toThrow(NotFoundException);
      expect(fileStorageHelper.deleteFile).not.toHaveBeenCalled();
      expect(repository.remove).not.toHaveBeenCalled();
    });
  });

  describe('getFileStream', () => {
    it('should return file stream when attachment and file exist', async () => {
      const attachment = {
        id: 'attachment-123',
        expenseId: 'expense-123',
        fileName: 'receipt.pdf',
        filePath: '/uploads/expense-123/file.pdf',
        mimeType: 'application/pdf',
        size: 1024,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockStream = {} as any;

      repository.findOne.mockResolvedValue(attachment);
      mockFileStorageHelper.getFileStream.mockReturnValue(mockStream);

      const result = await service.getFileStream('attachment-123');

      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 'attachment-123' } });
      expect(fileStorageHelper.getFileStream).toHaveBeenCalledWith('/uploads/expense-123/file.pdf');
      expect(result.stream).toBe(mockStream);
      expect(result.fileName).toBe('receipt.pdf');
      expect(result.mimeType).toBe('application/pdf');
      expect(result.size).toBe(1024);
    });

    it('should throw NotFoundException when attachment does not exist', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.getFileStream('attachment-123')).rejects.toThrow(NotFoundException);
      expect(fileStorageHelper.getFileStream).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when file does not exist on filesystem', async () => {
      const attachment = {
        id: 'attachment-123',
        expenseId: 'expense-123',
        fileName: 'receipt.pdf',
        filePath: '/uploads/expense-123/file.pdf',
        mimeType: 'application/pdf',
        size: 1024,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      repository.findOne.mockResolvedValue(attachment);
      mockFileStorageHelper.getFileStream.mockImplementation(() => {
        throw new Error('File not found');
      });

      await expect(service.getFileStream('attachment-123')).rejects.toThrow(NotFoundException);
      expect(fileStorageHelper.getFileStream).toHaveBeenCalledWith('/uploads/expense-123/file.pdf');
    });
  });
});
