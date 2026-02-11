import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  UseInterceptors,
  UploadedFile,
  HttpCode,
  HttpStatus,
  UseGuards,
  Res,
  StreamableFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { Response } from 'express';
import { AttachmentsService } from './attachments.service';
import { AttachmentResponseDto } from './dto/attachment-response.dto';
import { ErrorResponseDto } from '../common/dto/error-response.dto';
import { FakeAuthGuard } from '../common/guards/fake-auth.guard';

@ApiTags('attachments')
@Controller('attachments')
@UseGuards(FakeAuthGuard)
export class AttachmentsController {
  constructor(private readonly attachmentsService: AttachmentsService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get attachment metadata by ID' })
  @ApiParam({ name: 'id', description: 'Attachment ID' })
  @ApiResponse({
    status: 200,
    description: 'Attachment metadata retrieved successfully',
    type: AttachmentResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Attachment not found',
    type: ErrorResponseDto,
  })
  async findOne(@Param('id') id: string): Promise<AttachmentResponseDto> {
    const attachment = await this.attachmentsService.findOne(id);
    const apiPrefix = process.env.API_PREFIX || 'api';
    return new AttachmentResponseDto({
      ...attachment,
      downloadUrl: `/${apiPrefix}/attachments/${attachment.id}/download`,
    });
  }

  @Get(':id/download')
  @ApiOperation({ summary: 'Download attachment file' })
  @ApiParam({ name: 'id', description: 'Attachment ID' })
  @ApiResponse({
    status: 200,
    description: 'File downloaded successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Attachment or file not found',
    type: ErrorResponseDto,
  })
  async download(@Param('id') id: string, @Res({ passthrough: true }) res: Response) {
    const { stream, fileName, mimeType, size } = await this.attachmentsService.getFileStream(id);

    res.set({
      'Content-Type': mimeType,
      'Content-Disposition': `attachment; filename="${fileName}"`,
      'Content-Length': size,
    });

    return new StreamableFile(stream);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an attachment' })
  @ApiParam({ name: 'id', description: 'Attachment ID' })
  @ApiResponse({
    status: 204,
    description: 'Attachment deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Attachment not found',
    type: ErrorResponseDto,
  })
  remove(@Param('id') id: string): Promise<void> {
    return this.attachmentsService.remove(id);
  }
}

@ApiTags('expenses')
@Controller('expenses')
@UseGuards(FakeAuthGuard)
export class ExpenseAttachmentsController {
  constructor(private readonly attachmentsService: AttachmentsService) {}

  @Post(':expenseId/attachments')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload an attachment for an expense' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiParam({ name: 'expenseId', description: 'Expense ID' })
  @ApiResponse({
    status: 201,
    description: 'Attachment uploaded successfully',
    type: AttachmentResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid file type or size',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Expense not found',
    type: ErrorResponseDto,
  })
  uploadAttachment(
    @Param('expenseId') expenseId: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<AttachmentResponseDto> {
    return this.attachmentsService.uploadAttachment(expenseId, file);
  }

  @Get(':expenseId/attachments')
  @ApiOperation({ summary: 'Get all attachments for an expense' })
  @ApiParam({ name: 'expenseId', description: 'Expense ID' })
  @ApiResponse({
    status: 200,
    description: 'Attachments retrieved successfully',
    type: [AttachmentResponseDto],
  })
  findByExpense(@Param('expenseId') expenseId: string): Promise<AttachmentResponseDto[]> {
    return this.attachmentsService.findByExpenseId(expenseId);
  }
}
