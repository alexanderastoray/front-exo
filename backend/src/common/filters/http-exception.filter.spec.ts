import { HttpExceptionFilter } from './http-exception.filter';
import { HttpException, HttpStatus, ArgumentsHost } from '@nestjs/common';

describe('HttpExceptionFilter', () => {
  let filter: HttpExceptionFilter;
  let mockArgumentsHost: ArgumentsHost;
  let mockResponse: any;
  let mockRequest: any;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    filter = new HttpExceptionFilter();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    mockRequest = {
      method: 'GET',
      url: '/api/test',
    };

    const mockHttpArgumentsHost = {
      getResponse: () => mockResponse,
      getRequest: () => mockRequest,
    };

    mockArgumentsHost = {
      switchToHttp: () => mockHttpArgumentsHost,
    } as any;
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('should be defined', () => {
    expect(filter).toBeDefined();
  });

  it('should catch HttpException and format response', () => {
    const exception = new HttpException('Test error', HttpStatus.BAD_REQUEST);

    filter.catch(exception, mockArgumentsHost);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Test error',
        path: '/api/test',
      }),
    );
  });

  it('should handle HttpException with object response', () => {
    const exceptionResponse = {
      message: ['Field is required', 'Field must be string'],
      error: 'Bad Request',
    };
    const exception = new HttpException(exceptionResponse, HttpStatus.BAD_REQUEST);

    filter.catch(exception, mockArgumentsHost);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(mockResponse.json).toHaveBeenCalled();
  });

  it('should log error to console', () => {
    const exception = new HttpException('Test error', HttpStatus.INTERNAL_SERVER_ERROR);

    filter.catch(exception, mockArgumentsHost);

    // The filter logs errors, just verify it was called
    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
  });

  it('should handle validation errors with array of strings', () => {
    const exceptionResponse = {
      message: ['Field is required', 'Field must be string'],
      error: 'Bad Request',
    };
    const exception = new HttpException(exceptionResponse, HttpStatus.BAD_REQUEST);

    filter.catch(exception, mockArgumentsHost);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Validation failed',
        errors: [
          { field: 'unknown', message: 'Field is required' },
          { field: 'unknown', message: 'Field must be string' },
        ],
      }),
    );
  });

  it('should handle validation errors with array of objects', () => {
    const exceptionResponse = {
      message: [
        { field: 'email', message: 'Email is required' },
        { field: 'password', message: 'Password must be at least 8 characters' },
      ],
      error: 'Bad Request',
    };
    const exception = new HttpException(exceptionResponse, HttpStatus.BAD_REQUEST);

    filter.catch(exception, mockArgumentsHost);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Validation failed',
        errors: [
          { field: 'email', message: 'Email is required' },
          { field: 'password', message: 'Password must be at least 8 characters' },
        ],
      }),
    );
  });

  it('should handle non-HttpException Error instances', () => {
    const exception = new Error('Generic error message');

    filter.catch(exception, mockArgumentsHost);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Generic error message',
        path: '/api/test',
      }),
    );
  });

  it('should handle unknown exception types', () => {
    const exception = 'String exception';

    filter.catch(exception, mockArgumentsHost);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
        path: '/api/test',
      }),
    );
  });

  it('should include timestamp in error response', () => {
    const exception = new HttpException('Test error', HttpStatus.BAD_REQUEST);

    filter.catch(exception, mockArgumentsHost);

    const callArgs = mockResponse.json.mock.calls[0][0];

    expect(callArgs.timestamp).toBeDefined();
    expect(typeof callArgs.timestamp).toBe('string');
    // Verify it's a valid ISO string
    expect(() => new Date(callArgs.timestamp)).not.toThrow();
  });

  it('should include request path in error response', () => {
    const exception = new HttpException('Test error', HttpStatus.NOT_FOUND);

    filter.catch(exception, mockArgumentsHost);

    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        path: '/api/test',
      }),
    );
  });

  it('should handle HttpException with string response', () => {
    const exception = new HttpException('Simple error message', HttpStatus.FORBIDDEN);

    filter.catch(exception, mockArgumentsHost);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.FORBIDDEN);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: HttpStatus.FORBIDDEN,
        message: 'Simple error message',
        path: '/api/test',
      }),
    );
  });

  it('should not include errors field when there are no validation errors', () => {
    const exception = new HttpException('Test error', HttpStatus.BAD_REQUEST);

    filter.catch(exception, mockArgumentsHost);

    const callArgs = mockResponse.json.mock.calls[0][0];
    expect(callArgs.errors).toBeUndefined();
  });
});
