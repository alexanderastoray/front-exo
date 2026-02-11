# Backend Testing Standards

## Coverage Requirements

### Minimum Thresholds
- **Statements**: 80%
- **Branches**: 60%
- **Lines**: 80%
- **Functions**: 65%

### Module-Specific Requirements
- **Business Logic Modules** (services, controllers): ≥95%
- **Helpers/Utilities**: 100%
- **Interceptors/Filters/Guards**: 100%
- **Entities**: ≥90%
- **Configuration files**: Can be excluded

## Test Quality Standards

### All Tests Must
1. Pass before any commit
2. Be independent (no test order dependency)
3. Clean up after themselves
4. Use descriptive names: `should [action] when [condition]`
5. Follow AAA pattern (Arrange, Act, Assert)

### TypeORM Mocking Rules
1. Use `getRepositoryToken(Entity)` for repository injection
2. Mock QueryBuilder with `as any` for partial implementations
3. Always mock chaining methods with `.mockReturnThis()`
4. Use `mockResolvedValue()` for async operations

### Date Handling
1. Always use `new Date()` objects in entity mocks
2. Never use date strings for entity properties
3. Use ISO strings only for DTOs and API requests

### Error Testing
1. Test both success and error paths
2. Verify specific error types (NotFoundException, BadRequestException)
3. Test validation errors
4. Test business rule violations

## Test Organization

### File Structure
```
src/
  module/
    module.service.ts
    module.service.spec.ts      # Service tests
    module.controller.ts
    module.controller.spec.ts   # Controller tests
    helpers/
      helper.ts
      helper.spec.ts            # Helper tests
```

### Test Naming
- File: `*.spec.ts`
- Describe blocks: Match class/function name
- Test cases: `should [expected behavior] when [condition]`

## Continuous Integration

### Pre-commit Checks
1. All tests must pass
2. Coverage thresholds must be met
3. No TypeScript errors
4. Linting passes

### Coverage Reports
- Generate HTML report: `npm run test:cov`
- Review uncovered lines before PR
- Document reasons for exclusions
