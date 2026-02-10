import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { HealthResponseDto } from '@shared/types';

/**
 * Health service
 * Performs health checks on system components
 */
@Injectable()
export class HealthService {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  /**
   * Perform comprehensive health check
   * Tests database connectivity and returns system status
   */
  async check(): Promise<HealthResponseDto> {
    const timestamp = new Date().toISOString();
    let dbOk = false;
    let dbError: string | undefined;

    // Test database connection
    try {
      await this.dataSource.query('SELECT 1');
      dbOk = true;
    } catch (error) {
      dbOk = false;
      dbError = error instanceof Error ? error.message : 'Unknown database error';
    }

    const ok = dbOk;
    const message = ok ? 'All systems operational' : 'Database connection failed';

    return {
      ok,
      api: { ok: true },
      db: {
        ok: dbOk,
        ...(dbError && { error: dbError }),
      },
      message,
      timestamp,
    };
  }
}
