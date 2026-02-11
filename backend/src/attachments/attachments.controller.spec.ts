import { Test, TestingModule } from '@nestjs/testing';
import { AttachmentsController, ExpenseAttachmentsController } from './attachments.controller';
import { AttachmentsService } from './attachments.service';
import { AttachmentResponseDto } from './dto/attachment-response.dto';
import { NotFoundException } from '@nestjs/common';
import { Response } from 'express';
import { StreamableFile } from '@nestjs/common';
import { Readable } from 'stream';

describe('AttachmentsController', () => {
  let controller: AttachmentsController;
  let service: AttachmentsService;

  const mockAttachmentsService = {
    findOne: jest.fn(),
    getFileStream: jest.fn(),
    remove: jest.fn(),
    uploadAttachment: jest.fn(),
    findByExpenseId: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AttachmentsController],
      providers: [
        {
          provide: AttachmentsService,
          useValue: mockAttachmentsService,
        },
      ],
    }).compile();

    controller = module.get<AttachmentsController>(AttachmentsController);
    service = module.get<AttachmentsService>(AttachmentsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findOne', () => {
    it('should return attachment metadata when attachment exists', async () => {
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

      mockAttachmentsService.findOne.mockResolvedValue(attachment);

      const result = await controller.findOne('attachment-123');

      expect(result).toBeInstanceOf(AttachmentResponseDto);
      expect(result.id).toBe('attachment-123');
      expect(result.downloadUrl).toContain('/attachments/attachment-123/download');
      expect(service.findOne).toHaveBeenCalledWith('attachment-123');
    });

    it('should throw NotFoundException when attachment does not exist', async () => {
      mockAttachmentsService.findOne.mockRejectedValue(
        new NotFoundException('Attachment with ID attachment-123 not found'),
      );

      await expect(controller.findOne('attachment-123')).rejects.toThrow(NotFoundException);
      expect(service.findOne).toHaveBeenCalledWith('attachment-123');
    });
  });

  describe('download', () => {
    it('should return file stream with correct headers when file exists', async () => {
      const mockStream = new Readable();
      mockStream.push('file content');
      mockStream.push(null);

      const fileData = {
        stream: mockStream,
        fileName: 'receipt.pdf',
        mimeType: 'application/pdf',
        size: 1024,
      };

      mockAttachmentsService.getFileStream.mockResolvedValue(fileData);

      const mockResponse = {
        set: jest.fn(),
      } as unknown as Response;

      const result = await controller.download('attachment-123', mockResponse);

      expect(result).toBeInstanceOf(StreamableFile);
      expect(mockResponse.set).toHaveBeenCalledWith({
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="receipt.pdf"',
        'Content-Length': 1024,
      });
      expect(service.getFileStream).toHaveBeenCalledWith('attachment-123');
    });

    it('should throw NotFoundException when attachment does not exist', async () => {
      mockAttachmentsService.getFileStream.mockRejectedValue(
        new NotFoundException('Attachment with ID attachment-123 not found'),
      );

      const mockResponse = {
        set: jest.fn(),
      } as unknown as Response;

      await expect(controller.download('attachment-123', mockResponse)).rejects.toThrow(
        NotFoundException,
      );
      expect(service.getFileStream).toHaveBeenCalledWith('attachment-123');
    });

    it('should throw NotFoundException when file not found on filesystem', async () => {
      mockAttachmentsService.getFileStream.mockRejectedValue(
        new NotFoundException('File not found for attachment attachment-123'),
      );

      const mockResponse = {
        set: jest.fn(),
      } as unknown as Response;

      await expect(controller.download('attachment-123', mockResponse)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should delete attachment when it exists', async () => {
      mockAttachmentsService.remove.mockResolvedValue(undefined);

      await controller.remove('attachment-123');

      expect(service.remove).toHaveBeenCalledWith('attachment-123');
    });

    it('should throw NotFoundException when attachment does not exist', async () => {
      mockAttachmentsService.remove.mockRejectedValue(
        new NotFoundException('Attachment with ID attachment-123 not found'),
      );

      await expect(controller.remove('attachment-123')).rejects.toThrow(NotFoundException);
      expect(service.remove).toHaveBeenCalledWith('attachment-123');
    });
  });
});

describe('ExpenseAttachmentsController', () => {
  let controller: ExpenseAttachmentsController;
  let service: AttachmentsService;

  const mockAttachmentsService = {
    uploadAttachment: jest.fn(),
    findByExpenseId: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExpenseAttachmentsController],
      providers: [
        {
          provide: AttachmentsService,
          useValue: mockAttachmentsService,
        },
      ],
    }).compile();

    controller = module.get<ExpenseAttachmentsController>(ExpenseAttachmentsController);
    service = module.get<AttachmentsService>(AttachmentsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('uploadAttachment', () => {
    it('should upload attachment successfully when file is valid', async () => {
      const mockFile = {
        originalname: 'receipt.pdf',
        mimetype: 'application/pdf',
        size: 1024,
        buffer: Buffer.from('file content'),
      } as Express.Multer.File;

      const expectedResult = new AttachmentResponseDto({
        id: 'attachment-123',
        expenseId: 'expense-123',
        fileName: 'receipt.pdf',
        mimeType: 'application/pdf',
        size: 1024,
        downloadUrl: '/api/attachments/attachment-123/download',
        createdAt: new Date(),
      });

      mockAttachmentsService.uploadAttachment.mockResolvedValue(expectedResult);

      const result = await controller.uploadAttachment('expense-123', mockFile);

      expect(result).toEqual(expectedResult);
      expect(service.uploadAttachment).toHaveBeenCalledWith('expense-123', mockFile);
    });

    it('should throw NotFoundException when expense does not exist', async () => {
      const mockFile = {
        originalname: 'receipt.pdf',
        mimetype: 'application/pdf',
        size: 1024,
        buffer: Buffer.from('file content'),
      } as Express.Multer.File;

      mockAttachmentsService.uploadAttachment.mockRejectedValue(
        new NotFoundException('Expense with ID expense-123 not found'),
      );

      await expect(controller.uploadAttachment('expense-123', mockFile)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findByExpense', () => {
    it('should return all attachments for an expense', async () => {
      const expectedResult = [
        new AttachmentResponseDto({
          id: 'attachment-1',
          expenseId: 'expense-123',
          fileName: 'receipt1.pdf',
          mimeType: 'application/pdf',
          size: 1024,
          downloadUrl: '/api/attachments/attachment-1/download',
          createdAt: new Date(),
        }),
        new AttachmentResponseDto({
          id: 'attachment-2',
          expenseId: 'expense-123',
          fileName: 'receipt2.jpg',
          mimeType: 'image/jpeg',
          size: 2048,
          downloadUrl: '/api/attachments/attachment-2/download',
          createdAt: new Date(),
        }),
      ];

      mockAttachmentsService.findByExpenseId.mockResolvedValue(expectedResult);

      const result = await controller.findByExpense('expense-123');

      expect(result).toEqual(expectedResult);
      expect(result).toHaveLength(2);
      expect(service.findByExpenseId).toHaveBeenCalledWith('expense-123');
    });

    it('should return empty array when expense has no attachments', async () => {
      mockAttachmentsService.findByExpenseId.mockResolvedValue([]);

      const result = await controller.findByExpense('expense-123');

      expect(result).toEqual([]);
      expect(service.findByExpenseId).toHaveBeenCalledWith('expense-123');
    });
  });
});
