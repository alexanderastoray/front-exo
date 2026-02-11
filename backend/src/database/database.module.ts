import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from '../config/database.config';

/**
 * Database module
 * Configures TypeORM with SQLite
 */
@Module({
  imports: [TypeOrmModule.forRoot(databaseConfig())],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
