import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './config/database.config';
import appConfig from './config/app.config';
import { CommonModule } from './common/common.module';
import { DatabaseModule } from './database/database.module';
import { HealthModule } from './health/health.module';
import { UsersModule } from './users/users.module';
import { ExpenseReportsModule } from './expense-reports/expense-reports.module';
import { ExpensesModule } from './expenses/expenses.module';
import { AttachmentsModule } from './attachments/attachments.module';

/**
 * Root application module
 * Imports all feature modules and configuration
 */
@Module({
  imports: [
    // Configuration module (global)
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
      envFilePath: '.env',
    }),

    // Database module
    TypeOrmModule.forRoot(databaseConfig()),
    DatabaseModule,

    // Common module (global)
    CommonModule,

    // Feature modules
    HealthModule,
    UsersModule,
    ExpenseReportsModule,
    ExpensesModule,
    AttachmentsModule,
  ],
})
export class AppModule {}
