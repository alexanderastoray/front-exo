import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { HealthModule } from './health/health.module';
import { UsersModule } from './users/users.module';

/**
 * Root application module
 * Imports all feature modules
 */
@Module({
  imports: [DatabaseModule, HealthModule, UsersModule],
})
export class AppModule {}
