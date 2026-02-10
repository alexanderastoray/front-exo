# System Patterns

This file documents recurring patterns and standards used in the project.

## Coding Patterns

[2026-02-10 16:31:35] - **TypeScript Strict Mode**: All packages use strict TypeScript configuration
[2026-02-10 16:31:35] - **Barrel Exports**: Shared package uses index.ts for clean imports
[2026-02-10 16:31:35] - **DTO Pattern**: All API contracts defined as DTOs with validation
[2026-02-10 16:31:35] - **Error Handling**: Try-catch in async functions, error boundaries in React
[2026-02-10 16:31:35] - **Environment Variables**: .env.example files document required config

## Architectural Patterns

[2026-02-10 16:31:35] - **Monorepo Workspaces**: NPM workspaces with shared package
[2026-02-10 16:31:35] - **Layered Architecture**:
  - Frontend: Pages → Components → Hooks → API
  - Backend: Controllers → Services → Repositories → Entities
[2026-02-10 16:31:35] - **Dependency Injection**: NestJS DI container for backend services
[2026-02-10 16:31:35] - **API Gateway Pattern**: Vite proxy routes /api/* to backend
[2026-02-10 16:31:35] - **Repository Pattern**: TypeORM repositories for data access

## Testing Patterns

[2026-02-10 16:31:35] - **Test Organization**: Tests colocated with source files
[2026-02-10 16:31:35] - **Mocking Strategy**:
  - Frontend: Mock API calls with MSW or fetch mocks
  - Backend: Mock repositories and external dependencies
[2026-02-10 16:31:35] - **Coverage Enforcement**: 80% minimum threshold in CI/CD
[2026-02-10 16:31:35] - **Test Types**:
  - Unit tests for services and utilities
  - Component tests for React components
  - Integration tests for full modules
[2026-02-10 16:31:35] - **AAA Pattern**: Arrange-Act-Assert structure in all tests
