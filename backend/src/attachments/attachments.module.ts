import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttachmentsService } from './attachments.service';
import { AttachmentsController, ExpenseAttachmentsController } from './attachments.controller';
import { Attachment } from './entities/attachment.entity';
import { FileStorageHelper } from './helpers/file-storage.helper';
import { ExpensesModule } from '../expenses/expenses.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Attachment]),
    ExpensesModule,
  ],
  controllers: [AttachmentsController, ExpenseAttachmentsController],
  providers: [AttachmentsService, FileStorageHelper],
  exports: [AttachmentsService],
})
export class AttachmentsModule {}
