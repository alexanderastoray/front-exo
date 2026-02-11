import { Module, Global } from '@nestjs/common';
import { FakeAuthGuard } from './guards/fake-auth.guard';

/**
 * Common module for shared resources
 * Exported globally to be available in all modules
 */
@Global()
@Module({
  providers: [FakeAuthGuard],
  exports: [FakeAuthGuard],
})
export class CommonModule {}
