import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HealthService } from './health.service';
import { HealthResponseDto } from '@shared/types';

/**
 * Health controller
 * Exposes health check endpoints
 */
@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  /**
   * Health check endpoint
   * Returns the status of the API and database connection
   */
  @Get()
  @ApiOperation({ summary: 'Check system health' })
  @ApiResponse({
    status: 200,
    description: 'System health status',
    type: Object,
  })
  async check(): Promise<HealthResponseDto> {
    return this.healthService.check();
  }
}
