import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attachment } from './entities/attachment.entity';
import { AttachmentResponseDto } from './dto/attachment-response.dto';
import { FileStorageHelper } from './helpers/file-storage.helper';
import { ExpensesService } from '../expenses/expenses.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AttachmentsService {
  constructor(
    @InjectRepository(Attachment)
    private readonly attachmentRepository: Repository<Attachment>,
    private readonly fileStorageHelper: FileStorageHelper,
    private readonly expensesService: ExpensesService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Upload an attachment for an expense
   */
  async uploadAttachment(
    expenseId: string,
    file: Express.Multer.File,
  ): Promise<AttachmentResponseDto> {
    // Verify expense exists
    await this.expensesService.findOne(expenseId);

    // Validate file type
    if (!this.fileStorageHelper.validateFileType(file.mimetype)) {
      throw new BadRequestException(
        `File type ${file.mimetype} is not allowed. Allowed types: ${this.configService.get('upload.allowedMimeTypes').join(', ')}`,
      );
    }

    // Validate file size
    if (!this.fileStorageHelper.validateFileSize(file.size)) {
      const maxSize = this.configService.get<number>('upload.maxFileSize');
      throw new BadRequestException(
        `File size exceeds maximum allowed size of ${maxSize} bytes`,
      );
    }

    // Save file to filesystem
    const { filePath, fileName } = await this.fileStorageHelper.saveFile(
      expenseId,
      file,
    );

    // Create attachment record
    const attachment = this.attachmentRepository.create({
      expenseId,
      fileName,
      filePath,
      mimeType: file.mimetype,
      size: file.size,
    });

    const savedAttachment = await this.attachmentRepository.save(attachment);

    return this.toResponseDto(savedAttachment);
  }

  /**
   * Find all attachments for an expense
   */
  async findByExpenseId(expenseId: string): Promise<AttachmentResponseDto[]> {
    const attachments = await this.attachmentRepository.find({
      where: { expenseId },
      order: { createdAt: 'DESC' },
    });

    return attachments.map((attachment) => this.toResponseDto(attachment));
  }

  /**
   * Find one attachment by ID
   */
  async findOne(id: string): Promise<Attachment> {
    const attachment = await this.attachmentRepository.findOne({ where: { id } });

    if (!attachment) {
      throw new NotFoundException(`Attachment with ID ${id} not found`);
    }

    return attachment;
  }

  /**
   * Delete an attachment
   */
  async remove(id: string): Promise<void> {
    const attachment = await this.findOne(id);

    // Delete file from filesystem
    await this.fileStorageHelper.deleteFile(attachment.filePath);

    // Delete database record
    await this.attachmentRepository.remove(attachment);
  }

  /**
   * Get file stream for download
   */
  async getFileStream(id: string) {
    const attachment = await this.findOne(id);
    
    try {
      const stream = this.fileStorageHelper.getFileStream(attachment.filePath);
      return {
        stream,
        fileName: attachment.fileName,
        mimeType: attachment.mimeType,
        size: attachment.size,
      };
    } catch (error) {
      throw new NotFoundException(`File not found for attachment ${id}`);
    }
  }

  /**
   * Convert entity to response DTO
   */
  private toResponseDto(attachment: Attachment): AttachmentResponseDto {
    const apiPrefix = this.configService.get<string>('apiPrefix') || 'api';
    return new AttachmentResponseDto({
      ...attachment,
      downloadUrl: `/${apiPrefix}/attachments/${attachment.id}/download`,
    });
  }
}
