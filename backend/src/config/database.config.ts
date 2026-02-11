import { TypeOrmModuleOptions } from '@nestjs/typeorm';

/**
 * TypeORM database configuration
 * Uses SQLite for development with auto-synchronization
 *
 * ⚠️ WARNING: synchronize: true should be disabled in production
 * Use migrations for production deployments
 */
export const databaseConfig = (): TypeOrmModuleOptions => ({
  type: 'sqlite',
  database: process.env.DB_DATABASE || './data/expense-management.sqlite',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: process.env.DB_SYNCHRONIZE === 'true' || process.env.NODE_ENV !== 'production',
  logging: process.env.DB_LOGGING === 'true' || process.env.NODE_ENV === 'development',
});
