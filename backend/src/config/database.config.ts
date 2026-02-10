import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';

/**
 * TypeORM database configuration
 * Uses SQLite for development with auto-synchronization
 *
 * ⚠️ WARNING: synchronize: true should be disabled in production
 * Use migrations for production deployments
 */
export const databaseConfig: TypeOrmModuleOptions = {
  type: 'sqlite',
  database: process.env.DB_DATABASE || 'data/dev.sqlite',
  entities: [User],
  synchronize: process.env.DB_SYNCHRONIZE === 'true' || process.env.NODE_ENV === 'development',
  logging: process.env.NODE_ENV === 'development',
};
