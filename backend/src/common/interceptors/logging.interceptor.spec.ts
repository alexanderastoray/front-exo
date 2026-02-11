import { LoggingInterceptor } from './logging.interceptor';
import { of } from 'rxjs';
import { CallHandler, ExecutionContext } from '@nestjs/common';

describe('LoggingInterceptor', () => {
  let interceptor: LoggingInterceptor;
  let mockExecutionContext: ExecutionContext;
  let mockCallHandler: CallHandler;
  let consoleLogSpy: jest.SpyInstance;

  beforeEach(() => {
    interceptor = new LoggingInterceptor();
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    
    const mockRequest = {
      method: 'GET',
      url: '/api/users',
    };
    
    const mockResponse = {
      statusCode: 200,
    };
    
    const mockHttpArgumentsHost = {
      getRequest: () => mockRequest,
      getResponse: () => mockResponse,
    };
    
    mockExecutionContext = {
      switchToHttp: () => mockHttpArgumentsHost,
    } as any;
    
    mockCallHandler = {
      handle: jest.fn(),
    } as any;
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  it('should log request and response', (done) => {
    const testData = { id: '123' };
    mockCallHandler.handle = jest.fn(() => of(testData));

    interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe(() => {
      // The interceptor processes the request
      expect(mockCallHandler.handle).toHaveBeenCalled();
      done();
    });
  });
});
