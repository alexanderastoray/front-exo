import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

/**
 * Helper class for file storage operations
 */
@Injectable()
export class FileStorageHelper {
  private readonly logger = new Logger(FileStorageHelper.name);
  private readonly uploadDir: string;

  constructor(private readonly configService: ConfigService) {
    this.uploadDir = this.configService.get<string>('upload.dir') || './uploads';
    this.ensureUploadDirExists();
  }

  /**
   * Ensure upload directory exists
   */
  private ensureUploadDirExists(): void {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
      this.logger.log(`Created upload directory: ${this.uploadDir}`);
    }
  }

  /**
   * Save a file to the filesystem
   */
  async saveFile(
    expenseId: string,
    file: Express.Multer.File,
  ): Promise<{ filePath: string; fileName: string }> {
    const fileExtension = path.extname(file.originalname);
    const sanitizedFileName = this.sanitizeFileName(file.originalname);
    const storedFileName = `${uuidv4()}${fileExtension}`;
    const expenseDir = path.join(this.uploadDir, expenseId);
    const filePath = path.join(expenseDir, storedFileName);

    // Create expense directory if it doesn't exist
    if (!fs.existsSync(expenseDir)) {
      fs.mkdirSync(expenseDir, { recursive: true });
    }

    // Write file
    await fs.promises.writeFile(filePath, file.buffer);

    this.logger.log(`File saved: ${filePath}`);

    return {
      filePath,
      fileName: sanitizedFileName,
    };
  }

  /**
   * Delete a file from the filesystem
   */
  async deleteFile(filePath: string): Promise<void> {
    try {
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
        this.logger.log(`File deleted: ${filePath}`);
      }
    } catch (error) {
      this.logger.warn(`Failed to delete file ${filePath}: ${error.message}`);
      // Don't throw - file might already be deleted
    }
  }

  /**
   * Delete an entire directory
   */
  async deleteDirectory(dirPath: string): Promise<void> {
    try {
      if (fs.existsSync(dirPath)) {
        await fs.promises.rm(dirPath, { recursive: true, force: true });
        this.logger.log(`Directory deleted: ${dirPath}`);
      }
    } catch (error) {
      this.logger.warn(`Failed to delete directory ${dirPath}: ${error.message}`);
    }
  }

  /**
   * Get file stream for download
   */
  getFileStream(filePath: string): fs.ReadStream {
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }
    return fs.createReadStream(filePath);
  }

  /**
   * Sanitize filename to prevent path traversal and other issues
   */
  private sanitizeFileName(fileName: string): string {
    // Remove path separators and other dangerous characters
    return fileName
      .replace(/[/\\]/g, '')
      .replace(/\.\./g, '')
      .substring(0, 255);
  }

  /**
   * Validate file type
   */
  validateFileType(mimeType: string): boolean {
    const allowedTypes = this.configService.get<string[]>('upload.allowedMimeTypes') || [
      'image/jpeg',
      'image/png',
      'application/pdf',
    ];
    return allowedTypes.includes(mimeType);
  }

  /**
   * Validate file size
   */
  validateFileSize(size: number): boolean {
    const maxSize = this.configService.get<number>('upload.maxFileSize') || 5242880; // 5MB
    return size <= maxSize;
  }
}
