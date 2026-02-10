# Decision Log

This file records architectural and implementation decisions using a list format.

---

## [2026-02-10 16:31:35] Monorepo Strategy: NPM Workspaces

**Decision**: Use NPM Workspaces for monorepo management

**Rationale**:
- Native npm feature (no additional tooling required)
- Simple workspace protocol for local dependencies
- Single package-lock.json for consistency
- Hoisting of common dependencies reduces duplication
- Meets all project requirements without complexity

**Implementation Details**:
- Root package.json defines workspaces: ["frontend", "backend", "shared"]
- Shared package referenced via `workspace:*` protocol
- Build order enforced through scripts: shared → backend → frontend

---

## [2026-02-10 16:31:35] Frontend Stack: React + Vite + TailwindCSS

**Decision**: Use Vite as build tool instead of Create React App

**Rationale**:
- Lightning-fast HMR with ESBuild
- Native ESM support
- Built-in proxy support for API calls
- Better developer experience
- Smaller bundle sizes

**Implementation Details**:
- Vite proxy: `/api/*` → `http://localhost:3000/*`
- Frontend port: 5173
- TailwindCSS for utility-first styling
- Vitest for testing (Vite-native)

---

## [2026-02-10 16:31:35] Backend Stack: NestJS + TypeORM + SQLite

**Decision**: Use NestJS framework with TypeORM and SQLite

**Rationale**:
- NestJS provides enterprise-ready architecture patterns
- TypeScript-first with excellent decorator support
- Built-in Swagger/OpenAPI integration
- TypeORM offers type-safe database operations
- SQLite enables zero-config development

**Implementation Details**:
- Backend port: 3000
- Swagger docs at `/docs`
- SQLite file: `backend/data/dev.sqlite`
- synchronize: true in development (with documented migration path)
- CORS enabled for frontend origin

---

## [2026-02-10 16:31:35] Testing Strategy: ≥80% Coverage

**Decision**: Enforce 80% minimum test coverage across all packages

**Rationale**:
- Ensures production-ready code quality
- Catches regressions early
- Documents expected behavior
- Builds confidence for refactoring

**Implementation Details**:
- Frontend: Vitest + Testing Library + v8 coverage
- Backend: Jest with coverage thresholds
- Coverage enforced in CI/CD pipeline
- Test types: unit, integration, component tests

---

## [2026-02-10 16:31:35] Shared Package Strategy

**Decision**: Build shared TypeScript package with compiled output

**Rationale**:
- Single source of truth for DTOs and types
- Type safety across frontend/backend boundary
- Clean separation of concerns
- Prevents type drift between layers

**Implementation Details**:
- Compile TypeScript to CommonJS + ESM
- Export DTOs: HealthResponseDto, UserDto, CreateUserRequestDto
- Consumed via workspace protocol
- Build before backend and frontend

---

## [2026-02-10 16:31:35] Code Quality: ESLint + Prettier

**Decision**: Enforce consistent code style with ESLint and Prettier

**Rationale**:
- Maintains code consistency across team
- Catches common errors early
- Reduces code review friction
- Industry standard tooling

**Implementation Details**:
- Root configs shared across workspaces
- TypeScript strict rules enabled
- React hooks rules for frontend
- Pre-commit hooks possible future addition
