import { FakeAuthGuard } from './fake-auth.guard';
import { ExecutionContext } from '@nestjs/common';

describe('FakeAuthGuard', () => {
  let guard: FakeAuthGuard;
  let mockExecutionContext: ExecutionContext;

  beforeEach(() => {
    guard = new FakeAuthGuard();

    const mockRequest = {
      headers: {
        authorization: 'Bearer fake-token',
      },
      user: null,
    };

    const mockHttpArgumentsHost = {
      getRequest: () => mockRequest,
      getResponse: () => ({}),
      getNext: () => jest.fn(),
    };

    mockExecutionContext = {
      switchToHttp: () => mockHttpArgumentsHost,
      getClass: jest.fn(),
      getHandler: jest.fn(),
      getArgs: jest.fn(),
      getArgByIndex: jest.fn(),
      switchToRpc: jest.fn(),
      switchToWs: jest.fn(),
      getType: jest.fn(),
    } as ExecutionContext;
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    it('should return true for any request', () => {
      const result = guard.canActivate(mockExecutionContext);

      expect(result).toBe(true);
    });

    it('should return true even without authorization header', () => {
      const mockRequest = {
        headers: {},
        user: null,
      };

      const mockHttpArgumentsHost = {
        getRequest: () => mockRequest,
        getResponse: () => ({}),
        getNext: () => jest.fn(),
      };

      const contextWithoutAuth = {
        switchToHttp: () => mockHttpArgumentsHost,
        getClass: jest.fn(),
        getHandler: jest.fn(),
        getArgs: jest.fn(),
        getArgByIndex: jest.fn(),
        switchToRpc: jest.fn(),
        switchToWs: jest.fn(),
        getType: jest.fn(),
      } as ExecutionContext;

      const result = guard.canActivate(contextWithoutAuth);

      expect(result).toBe(true);
    });

    it('should return true for invalid token format', () => {
      const mockRequest = {
        headers: {
          authorization: 'InvalidFormat',
        },
        user: null,
      };

      const mockHttpArgumentsHost = {
        getRequest: () => mockRequest,
        getResponse: () => ({}),
        getNext: () => jest.fn(),
      };

      const contextWithInvalidToken = {
        switchToHttp: () => mockHttpArgumentsHost,
        getClass: jest.fn(),
        getHandler: jest.fn(),
        getArgs: jest.fn(),
        getArgByIndex: jest.fn(),
        switchToRpc: jest.fn(),
        switchToWs: jest.fn(),
        getType: jest.fn(),
      } as ExecutionContext;

      const result = guard.canActivate(contextWithInvalidToken);

      expect(result).toBe(true);
    });

    it('should return boolean value', () => {
      const result = guard.canActivate(mockExecutionContext);

      expect(typeof result).toBe('boolean');
    });
  });
});
