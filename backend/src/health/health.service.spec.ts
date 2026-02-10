import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { HealthService } from './health.service';

describe('HealthService', () => {
  let service: HealthService;
  let dataSource: DataSource;

  const mockDataSource = {
    query: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HealthService,
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    }).compile();

    service = module.get<HealthService>(HealthService);
    dataSource = module.get<DataSource>(DataSource);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('check', () => {
    it('should return healthy status when database is connected', async () => {
      mockDataSource.query.mockResolvedValue([{ '1': 1 }]);

      const result = await service.check();

      expect(result.ok).toBe(true);
      expect(result.api.ok).toBe(true);
      expect(result.db.ok).toBe(true);
      expect(result.db.error).toBeUndefined();
      expect(result.message).toBe('All systems operational');
      expect(result.timestamp).toBeDefined();
      expect(dataSource.query).toHaveBeenCalledWith('SELECT 1');
    });

    it('should return unhealthy status when database fails', async () => {
      const dbError = new Error('SQLITE_CANTOPEN: unable to open database file');
      mockDataSource.query.mockRejectedValue(dbError);

      const result = await service.check();

      expect(result.ok).toBe(false);
      expect(result.api.ok).toBe(true);
      expect(result.db.ok).toBe(false);
      expect(result.db.error).toBe('SQLITE_CANTOPEN: unable to open database file');
      expect(result.message).toBe('Database connection failed');
      expect(result.timestamp).toBeDefined();
    });

    it('should handle unknown database errors', async () => {
      mockDataSource.query.mockRejectedValue('Unknown error');

      const result = await service.check();

      expect(result.ok).toBe(false);
      expect(result.db.ok).toBe(false);
      expect(result.db.error).toBe('Unknown database error');
    });

    it('should include ISO 8601 timestamp', async () => {
      mockDataSource.query.mockResolvedValue([{ '1': 1 }]);

      const result = await service.check();

      expect(result.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    });
  });
});
