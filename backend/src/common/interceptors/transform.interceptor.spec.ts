import { TransformInterceptor } from './transform.interceptor';
import { of } from 'rxjs';
import { CallHandler, ExecutionContext } from '@nestjs/common';

describe('TransformInterceptor', () => {
  let interceptor: TransformInterceptor<any>;
  let mockExecutionContext: ExecutionContext;
  let mockCallHandler: CallHandler;

  beforeEach(() => {
    interceptor = new TransformInterceptor<any>();
    mockExecutionContext = {} as ExecutionContext;
    mockCallHandler = {
      handle: jest.fn(),
    } as any;
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  it('should wrap response data in data property', (done) => {
    const testData = { id: '123', name: 'Test' };
    mockCallHandler.handle = jest.fn(() => of(testData));

    interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe((result: any) => {
      expect(result).toEqual({ data: testData });
      done();
    });
  });

  it('should preserve paginated response structure', (done) => {
    const paginatedData = {
      data: [{ id: '1' }, { id: '2' }],
      meta: { page: 1, limit: 10, total: 2, totalPages: 1 },
    };
    mockCallHandler.handle = jest.fn(() => of(paginatedData));

    interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe((result: any) => {
      expect(result).toEqual(paginatedData);
      done();
    });
  });

  it('should handle null response', (done) => {
    mockCallHandler.handle = jest.fn(() => of(null));

    interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe((result: any) => {
      expect(result).toEqual({ data: null });
      done();
    });
  });

  it('should handle undefined response', (done) => {
    mockCallHandler.handle = jest.fn(() => of(undefined));

    interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe((result: any) => {
      expect(result).toEqual({ data: undefined });
      done();
    });
  });
});
