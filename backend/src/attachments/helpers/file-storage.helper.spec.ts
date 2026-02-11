import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { FileStorageHelper } from './file-storage.helper';
import * as fs from 'fs';
import * as path from 'path';

// Mock uuid module
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'mocked-uuid-1234'),
}));

// Mock fs module
jest.mock('fs', () => ({
  existsSync: jest.fn(),
  mkdirSync: jest.fn(),
  createReadStream: jest.fn(),
  promises: {
    writeFile: jest.fn(),
    unlink: jest.fn(),
    rm: jest.fn(),
  },
}));

describe('FileStorageHelper', () => {
  let helper: FileStorageHelper;
  let configService: ConfigService;

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FileStorageHelper,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    helper = module.get<FileStorageHelper>(FileStorageHelper);
    configService = module.get<ConfigService>(ConfigService);

    // Reset mocks
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(helper).toBeDefined();
  });

  describe('constructor', () => {
    it('should create upload directory if it does not exist', () => {
      mockConfigService.get.mockReturnValue('./uploads');
      (fs.existsSync as jest.Mock).mockReturnValue(false);
      (fs.mkdirSync as jest.Mock).mockReturnValue(undefined);

      // Create new instance to trigger constructor
      new FileStorageHelper(configService);

      expect(fs.existsSync).toHaveBeenCalled();
      expect(fs.mkdirSync).toHaveBeenCalledWith('./uploads', { recursive: true });
    });

    it('should not create upload directory if it already exists', () => {
      mockConfigService.get.mockReturnValue('./uploads');
      (fs.existsSync as jest.Mock).mockReturnValue(true);

      // Create new instance to trigger constructor
      new FileStorageHelper(configService);

      expect(fs.existsSync).toHaveBeenCalled();
      expect(fs.mkdirSync).not.toHaveBeenCalled();
    });
  });

  describe('saveFile', () => {
    const mockFile = {
      originalname: 'receipt.pdf',
      mimetype: 'application/pdf',
      size: 1024,
      buffer: Buffer.from('file content'),
    } as Express.Multer.File;

    beforeEach(() => {
      mockConfigService.get.mockReturnValue('./uploads');
      (fs.existsSync as jest.Mock).mockReturnValue(true);
    });

    it('should save file successfully when directory exists', async () => {
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.promises.writeFile as jest.Mock).mockResolvedValue(undefined);

      const result = await helper.saveFile('expense-123', mockFile);

      expect(result.fileName).toBe('receipt.pdf');
      expect(result.filePath).toContain('expense-123');
      expect(result.filePath).toContain('.pdf');
      expect(fs.promises.writeFile).toHaveBeenCalledWith(
        expect.any(String),
        mockFile.buffer,
      );
    });


    it('should sanitize filename and preserve extension', async () => {
      const fileWithDangerousName = {
        ...mockFile,
        originalname: '../../../etc/passwd.pdf',
      } as Express.Multer.File;

      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.promises.writeFile as jest.Mock).mockResolvedValue(undefined);

      const result = await helper.saveFile('expense-123', fileWithDangerousName);

      expect(result.fileName).not.toContain('../');
      expect(result.fileName).not.toContain('/');
      expect(result.filePath).toContain('.pdf');
    });

    it('should handle files without extension', async () => {
      const fileWithoutExtension = {
        ...mockFile,
        originalname: 'receipt',
      } as Express.Multer.File;

      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.promises.writeFile as jest.Mock).mockResolvedValue(undefined);

      const result = await helper.saveFile('expense-123', fileWithoutExtension);

      expect(result.fileName).toBe('receipt');
      expect(result.filePath).toBeDefined();
    });

    it('should throw error when file write fails', async () => {
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.promises.writeFile as jest.Mock).mockRejectedValue(new Error('Write failed'));

      await expect(helper.saveFile('expense-123', mockFile)).rejects.toThrow('Write failed');
    });
  });

  describe('deleteFile', () => {
    beforeEach(() => {
      mockConfigService.get.mockReturnValue('./uploads');
      (fs.existsSync as jest.Mock).mockReturnValue(true);
    });

    it('should delete file when it exists', async () => {
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.promises.unlink as jest.Mock).mockResolvedValue(undefined);

      await helper.deleteFile('/uploads/expense-123/file.pdf');

      expect(fs.existsSync).toHaveBeenCalledWith('/uploads/expense-123/file.pdf');
      expect(fs.promises.unlink).toHaveBeenCalledWith('/uploads/expense-123/file.pdf');
    });

    it('should not throw error when file does not exist', async () => {
      (fs.existsSync as jest.Mock).mockReturnValue(false);

      await expect(helper.deleteFile('/uploads/expense-123/file.pdf')).resolves.not.toThrow();
      expect(fs.promises.unlink).not.toHaveBeenCalled();
    });

    it('should not throw error when unlink fails', async () => {
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.promises.unlink as jest.Mock).mockRejectedValue(new Error('Unlink failed'));

      await expect(helper.deleteFile('/uploads/expense-123/file.pdf')).resolves.not.toThrow();
    });
  });

  describe('deleteDirectory', () => {
    beforeEach(() => {
      mockConfigService.get.mockReturnValue('./uploads');
      (fs.existsSync as jest.Mock).mockReturnValue(true);
    });

    it('should delete directory when it exists', async () => {
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.promises.rm as jest.Mock).mockResolvedValue(undefined);

      await helper.deleteDirectory('/uploads/expense-123');

      expect(fs.existsSync).toHaveBeenCalledWith('/uploads/expense-123');
      expect(fs.promises.rm).toHaveBeenCalledWith('/uploads/expense-123', {
        recursive: true,
        force: true,
      });
    });

    it('should not throw error when directory does not exist', async () => {
      (fs.existsSync as jest.Mock).mockReturnValue(false);

      await expect(helper.deleteDirectory('/uploads/expense-123')).resolves.not.toThrow();
      expect(fs.promises.rm).not.toHaveBeenCalled();
    });

    it('should not throw error when rm fails', async () => {
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.promises.rm as jest.Mock).mockRejectedValue(new Error('Remove failed'));

      await expect(helper.deleteDirectory('/uploads/expense-123')).resolves.not.toThrow();
    });
  });

  describe('getFileStream', () => {
    beforeEach(() => {
      mockConfigService.get.mockReturnValue('./uploads');
      (fs.existsSync as jest.Mock).mockReturnValue(true);
    });

    it('should return file stream when file exists', () => {
      const mockStream = {} as any;
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.createReadStream as jest.Mock).mockReturnValue(mockStream);

      const result = helper.getFileStream('/uploads/expense-123/file.pdf');

      expect(fs.existsSync).toHaveBeenCalledWith('/uploads/expense-123/file.pdf');
      expect(fs.createReadStream).toHaveBeenCalledWith('/uploads/expense-123/file.pdf');
      expect(result).toBe(mockStream);
    });

    it('should throw error when file does not exist', () => {
      (fs.existsSync as jest.Mock).mockReturnValue(false);

      expect(() => helper.getFileStream('/uploads/expense-123/file.pdf')).toThrow(
        'File not found: /uploads/expense-123/file.pdf',
      );
      expect(fs.createReadStream).not.toHaveBeenCalled();
    });
  });

  describe('validateFileType', () => {
    beforeEach(() => {
      mockConfigService.get.mockReturnValue('./uploads');
      (fs.existsSync as jest.Mock).mockReturnValue(true);
    });

    it('should return true for allowed mime types', () => {
      mockConfigService.get.mockReturnValue(['image/jpeg', 'image/png', 'application/pdf']);

      expect(helper.validateFileType('image/jpeg')).toBe(true);
      expect(helper.validateFileType('image/png')).toBe(true);
      expect(helper.validateFileType('application/pdf')).toBe(true);
    });

    it('should return false for disallowed mime types', () => {
      mockConfigService.get.mockReturnValue(['image/jpeg', 'image/png', 'application/pdf']);

      expect(helper.validateFileType('application/exe')).toBe(false);
      expect(helper.validateFileType('text/html')).toBe(false);
    });

    it('should use default allowed types when config is not set', () => {
      mockConfigService.get.mockReturnValue(null);

      expect(helper.validateFileType('image/jpeg')).toBe(true);
      expect(helper.validateFileType('image/png')).toBe(true);
      expect(helper.validateFileType('application/pdf')).toBe(true);
      expect(helper.validateFileType('application/exe')).toBe(false);
    });
  });

  describe('validateFileSize', () => {
    beforeEach(() => {
      mockConfigService.get.mockReturnValue('./uploads');
      (fs.existsSync as jest.Mock).mockReturnValue(true);
    });

    it('should return true when file size is within limit', () => {
      mockConfigService.get.mockReturnValue(5242880); // 5MB

      expect(helper.validateFileSize(1024)).toBe(true);
      expect(helper.validateFileSize(5242880)).toBe(true);
    });

    it('should return false when file size exceeds limit', () => {
      mockConfigService.get.mockReturnValue(5242880); // 5MB

      expect(helper.validateFileSize(5242881)).toBe(false);
      expect(helper.validateFileSize(10485760)).toBe(false);
    });

    it('should use default max size when config is not set', () => {
      mockConfigService.get.mockReturnValue(null);

      expect(helper.validateFileSize(5242880)).toBe(true); // 5MB default
      expect(helper.validateFileSize(5242881)).toBe(false);
    });
  });
});
