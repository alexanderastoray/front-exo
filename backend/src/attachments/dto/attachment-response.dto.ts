import { ApiProperty } from '@nestjs/swagger';

export class AttachmentResponseDto {
  @ApiProperty({ description: 'Attachment ID' })
  id: string;

  @ApiProperty({ description: 'Expense ID' })
  expenseId: string;

  @ApiProperty({ description: 'Original file name' })
  fileName: string;

  @ApiProperty({ description: 'MIME type' })
  mimeType: string;

  @ApiProperty({ description: 'File size in bytes' })
  size: number;

  @ApiProperty({ description: 'Download URL' })
  downloadUrl: string;

  @ApiProperty({ description: 'Upload date' })
  createdAt: Date;

  constructor(partial: Partial<AttachmentResponseDto>) {
    Object.assign(this, partial);
  }
}
