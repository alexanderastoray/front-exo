# NestJS Testing Patterns

## Mock Repository Pattern
```typescript
const createMockRepository = () => ({
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
  find: jest.fn(),
  remove: jest.fn(),
  update: jest.fn(),
  createQueryBuilder: jest.fn(),
});

// Usage in test module
{
  provide: getRepositoryToken(Entity),
  useValue: createMockRepository(),
}
```

## Mock QueryBuilder Pattern
```typescript
// Create complete mock with chaining
const mockQueryBuilder = {
  leftJoinAndSelect: jest.fn().mockReturnThis(),
  leftJoin: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  andWhere: jest.fn().mockReturnThis(),
  orderBy: jest.fn().mockReturnThis(),
  skip: jest.fn().mockReturnThis(),
  take: jest.fn().mockReturnThis(),
  getOne: jest.fn().mockResolvedValue(data),
  getManyAndCount: jest.fn().mockResolvedValue([data, count]),
  getRawOne: jest.fn().mockResolvedValue(rawData),
} as any; // Use 'as any' to avoid TypeScript errors

repository.createQueryBuilder.mockReturnValue(mockQueryBuilder);
```

## RxJS Interceptor Tests
```typescript
import { of } from 'rxjs';

it('should transform response', (done) => {
  const testData = { id: '123' };
  mockCallHandler.handle = jest.fn(() => of(testData));
  
  interceptor.intercept(context, mockCallHandler).subscribe((result: any) => {
    expect(result).toEqual({ data: testData });
    done();
  });
});
```

## Exception Filter Tests
```typescript
const mockResponse = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis(),
};

const mockRequest = {
  method: 'GET',
  url: '/api/test',
};

const mockArgumentsHost = {
  switchToHttp: () => ({
    getResponse: () => mockResponse,
    getRequest: () => mockRequest,
  }),
} as any;

filter.catch(exception, mockArgumentsHost);
```

## State Transition Helper Tests
- Test all valid transitions
- Test all invalid transitions
- Test edge cases (same state, null values)
- Verify boolean returns and arrays

## Date Handling in Tests
```typescript
// ✅ Correct: Use Date objects for entities
const entity = {
  reportDate: new Date('2026-02-01'),
  createdAt: new Date(),
};

// ❌ Wrong: Don't use strings
const entity = {
  reportDate: '2026-02-01', // TypeScript error
};
```

## Test Structure (AAA Pattern)
```typescript
it('should create entity', async () => {
  // Arrange
  const createDto = { name: 'Test' };
  const expected = { id: '123', ...createDto };
  mockRepository.create.mockReturnValue(expected);
  mockRepository.save.mockResolvedValue(expected);
  
  // Act
  const result = await service.create(createDto);
  
  // Assert
  expect(result).toEqual(expected);
  expect(mockRepository.create).toHaveBeenCalledWith(createDto);
});
```
