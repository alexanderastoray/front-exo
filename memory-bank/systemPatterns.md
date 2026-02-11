# System Patterns

## Tests NestJS

### Mock Repository Pattern
```typescript
const mockRepository = {
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
  find: jest.fn(),
  remove: jest.fn(),
  createQueryBuilder: jest.fn(),
};

// Dans beforeEach
{
  provide: getRepositoryToken(Entity),
  useValue: mockRepository,
}
```

### Mock QueryBuilder Pattern
```typescript
const mockQueryBuilder = {
  andWhere: jest.fn().mockReturnThis(),
  orderBy: jest.fn().mockReturnThis(),
  skip: jest.fn().mockReturnThis(),
  take: jest.fn().mockReturnThis(),
  getManyAndCount: jest.fn().mockResolvedValue([data, count]),
} as any; // Utiliser 'as any' pour éviter erreurs TypeScript

repository.createQueryBuilder.mockReturnValue(mockQueryBuilder);
```

### Tests Interceptors RxJS
```typescript
import { of } from 'rxjs';

it('should transform data', (done) => {
  mockCallHandler.handle = jest.fn(() => of(testData));
  
  interceptor.intercept(context, mockCallHandler).subscribe((result: any) => {
    expect(result).toEqual(expected);
    done();
  });
});
```

### Tests Filters
```typescript
const mockResponse = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis(),
};

const mockRequest = { method: 'GET', url: '/api/test' };

const mockArgumentsHost = {
  switchToHttp: () => ({
    getResponse: () => mockResponse,
    getRequest: () => mockRequest,
  }),
} as any;
```

### Tests Helpers Statiques
- Tester toutes transitions d'état possibles
- Tester cas limites et invalides
- Vérifier retours booléens et tableaux

## Règles Tests Backend

### Couverture Minimale
- Statements: 80%
- Branches: 60%
- Modules métier critiques: 95%+

### Bonnes Pratiques
- Tous tests doivent passer avant commit
- Utiliser `new Date()` pour entities, pas strings
- Mocks TypeORM: `as any` pour QueryBuilder partiel
- Structure AAA: Arrange, Act, Assert
- Nommage clair: `should [action] when [condition]`
