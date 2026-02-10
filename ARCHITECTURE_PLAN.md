# Architecture Plan: Production-Ready Full-Stack Monorepo

## Executive Summary

This document outlines the complete architecture for a production-ready full-stack monorepo using:
- **Frontend**: React 18 + Vite + TypeScript + TailwindCSS
- **Backend**: NestJS + TypeORM + SQLite + Swagger
- **Shared**: TypeScript package for shared types
- **Quality**: ≥80% test coverage, ESLint, Prettier, comprehensive validation

---

## 1. Project Structure

```
/
├── frontend/                      # React application
│   ├── src/
│   │   ├── api/
│   │   │   ├── client.ts         # Base API client with error handling
│   │   │   └── health.api.ts     # Health endpoint calls
│   │   ├── components/
│   │   │   ├── StatusCard.tsx    # Reusable status display component
│   │   │   └── LoadingSpinner.tsx
│   │   ├── hooks/
│   │   │   └── useHealth.ts      # Custom hook for health checks
│   │   ├── pages/
│   │   │   └── StatusPage.tsx    # Main status dashboard
│   │   ├── styles/
│   │   │   └── index.css         # Tailwind imports
│   │   ├── App.tsx               # Root component
│   │   ├── main.tsx              # Entry point
│   │   └── vite-env.d.ts         # Vite type definitions
│   ├── tests/
│   │   ├── setup.ts              # Test setup
│   │   ├── StatusPage.test.tsx   # Status page tests
│   │   └── useHealth.test.ts     # Hook tests
│   ├── public/
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   ├── vite.config.ts
│   ├── vitest.config.ts
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── .eslintrc.json
│   └── .prettierrc
│
├── backend/                       # NestJS application
│   ├── src/
│   │   ├── config/
│   │   │   └── database.config.ts # TypeORM configuration
│   │   ├── database/
│   │   │   └── database.module.ts # Database module
│   │   ├── health/
│   │   │   ├── health.controller.ts
│   │   │   ├── health.service.ts
│   │   │   ├── health.module.ts
│   │   │   └── health.service.spec.ts
│   │   ├── users/
│   │   │   ├── entities/
│   │   │   │   └── user.entity.ts
│   │   │   ├── dto/
│   │   │   │   ├── create-user.dto.ts
│   │   │   │   └── user-response.dto.ts
│   │   │   ├── users.controller.ts
│   │   │   ├── users.service.ts
│   │   │   ├── users.module.ts
│   │   │   ├── users.controller.spec.ts
│   │   │   └── users.service.spec.ts
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── test/
│   │   └── jest-e2e.json
│   ├── data/                      # SQLite database files (gitignored)
│   │   └── .gitkeep
│   ├── package.json
│   ├── tsconfig.json
│   ├── tsconfig.build.json
│   ├── nest-cli.json
│   ├── jest.config.js
│   ├── .eslintrc.js
│   ├── .prettierrc
│   └── .env.example
│
├── shared/                        # Shared TypeScript package
│   ├── src/
│   │   ├── dtos/
│   │   │   ├── health.dto.ts     # HealthResponseDto
│   │   │   ├── user.dto.ts       # UserDto
│   │   │   └── create-user.dto.ts
│   │   └── index.ts              # Barrel export
│   ├── package.json
│   ├── tsconfig.json
│   ├── .eslintrc.json
│   └── .prettierrc
│
├── package.json                   # Root workspace configuration
├── package-lock.json
├── .gitignore
├── .prettierrc                    # Root Prettier config
├── .eslintrc.json                 # Root ESLint config
├── README.md                      # Comprehensive documentation
└── ARCHITECTURE_PLAN.md           # This file
```

---

## 2. Technology Choices & Rationale

### 2.1 Monorepo Strategy: NPM Workspaces

**Choice**: NPM Workspaces (native npm feature)

**Rationale**:
- No additional tooling required (yarn, pnpm, lerna)
- Native support in npm 7+
- Simple workspace protocol for local dependencies
- Hoisting of common dependencies
- Single `package-lock.json` for consistency

**Implementation**:
```json
{
  "workspaces": ["frontend", "backend", "shared"]
}
```

### 2.2 Frontend Stack

#### React 18 + TypeScript
- **React 18**: Latest stable, concurrent features, improved performance
- **TypeScript**: Type safety, better DX, catches errors at compile time

#### Vite
- **Fast HMR**: Instant hot module replacement
- **ESBuild**: Lightning-fast builds
- **Native ESM**: Modern module system
- **Proxy Support**: Easy API proxying for development

#### TailwindCSS
- **Utility-first**: Rapid UI development
- **Production optimization**: Automatic purging of unused styles
- **Consistency**: Design system built-in
- **No CSS-in-JS overhead**: Pure CSS output

#### Vitest + Testing Library
- **Vitest**: Vite-native testing, same config, fast
- **Testing Library**: Best practices for React testing
- **Coverage**: Built-in v8 coverage with threshold enforcement

### 2.3 Backend Stack

#### NestJS
- **Enterprise-ready**: Proven architecture patterns
- **TypeScript-first**: Native TypeScript support
- **Modular**: Clear separation of concerns
- **Decorators**: Clean, declarative code
- **Built-in**: Validation, OpenAPI, testing utilities

#### TypeORM
- **Active Record + Data Mapper**: Flexible patterns
- **TypeScript decorators**: Type-safe entities
- **Migration support**: Production-ready schema management
- **Multiple DB support**: Easy to switch from SQLite to PostgreSQL

#### SQLite
- **Zero configuration**: File-based, no server needed
- **Development-friendly**: Easy setup, portable
- **Production-capable**: Suitable for small-to-medium apps
- **Easy migration path**: Can switch to PostgreSQL later

#### Swagger/OpenAPI
- **Auto-documentation**: Generated from decorators
- **Interactive UI**: Test endpoints directly
- **Client generation**: Can generate TypeScript clients
- **API contract**: Clear interface definition

### 2.4 Shared Package Strategy

**Choice**: TypeScript project with build step

**Rationale**:
- Clean separation of shared types
- Single source of truth for DTOs
- Type safety across frontend/backend boundary
- Workspace protocol for local linking

**Build approach**:
- Compile TypeScript to CommonJS + ESM
- Frontend and backend import compiled output
- Build order: shared → backend → frontend

---

## 3. Dependency Matrix

### 3.1 Root Dependencies

```json
{
  "devDependencies": {
    "concurrently": "^8.2.2",
    "npm-run-all": "^4.1.5"
  }
}
```

### 3.2 Frontend Dependencies

**Production**:
- `react`: ^18.2.0
- `react-dom`: ^18.2.0
- `@shared/types`: workspace:*

**Development**:
- `@vitejs/plugin-react`: ^4.2.1
- `vite`: ^5.0.0
- `typescript`: ^5.3.3
- `tailwindcss`: ^3.4.0
- `postcss`: ^8.4.32
- `autoprefixer`: ^10.4.16
- `vitest`: ^1.0.4
- `@testing-library/react`: ^14.1.2
- `@testing-library/jest-dom`: ^6.1.5
- `@testing-library/user-event`: ^14.5.1
- `@vitest/coverage-v8`: ^1.0.4
- `jsdom`: ^23.0.1
- `eslint`: ^8.56.0
- `eslint-plugin-react`: ^7.33.2
- `eslint-plugin-react-hooks`: ^4.6.0
- `@typescript-eslint/parser`: ^6.15.0
- `@typescript-eslint/eslint-plugin`: ^6.15.0
- `prettier`: ^3.1.1

### 3.3 Backend Dependencies

**Production**:
- `@nestjs/common`: ^10.3.0
- `@nestjs/core`: ^10.3.0
- `@nestjs/platform-express`: ^10.3.0
- `@nestjs/typeorm`: ^10.0.1
- `@nestjs/swagger`: ^7.1.17
- `typeorm`: ^0.3.19
- `sqlite3`: ^5.1.7
- `class-validator`: ^0.14.0
- `class-transformer`: ^0.5.1
- `reflect-metadata`: ^0.2.1
- `rxjs`: ^7.8.1
- `@shared/types`: workspace:*

**Development**:
- `@nestjs/cli`: ^10.3.0
- `@nestjs/schematics`: ^10.1.0
- `@nestjs/testing`: ^10.3.0
- `@types/node`: ^20.10.6
- `typescript`: ^5.3.3
- `ts-node`: ^10.9.2
- `ts-jest`: ^29.1.1
- `jest`: ^29.7.0
- `@types/jest`: ^29.5.11
- `eslint`: ^8.56.0
- `@typescript-eslint/parser`: ^6.15.0
- `@typescript-eslint/eslint-plugin`: ^6.15.0
- `prettier`: ^3.1.1

### 3.4 Shared Dependencies

**Development**:
- `typescript`: ^5.3.3
- `eslint`: ^8.56.0
- `@typescript-eslint/parser`: ^6.15.0
- `@typescript-eslint/eslint-plugin`: ^6.15.0
- `prettier`: ^3.1.1

---

## 4. Build Order & Scripts

### 4.1 Build Order

```
1. shared (compile TypeScript)
   ↓
2. backend (compile NestJS)
   ↓
3. frontend (build Vite)
```

### 4.2 Root Scripts

```json
{
  "scripts": {
    "install": "npm install",
    "dev": "concurrently \"npm run dev -w backend\" \"npm run dev -w frontend\"",
    "build": "npm run build -w shared && npm run build -w backend && npm run build -w frontend",
    "test": "npm run test -w backend && npm run test -w frontend",
    "test:cov": "npm run test:cov -w backend && npm run test:cov -w frontend",
    "lint": "npm run lint -w shared && npm run lint -w backend && npm run lint -w frontend",
    "format": "npm run format -w shared && npm run format -w backend && npm run format -w frontend",
    "typecheck": "npm run typecheck -w shared && npm run typecheck -w backend && npm run typecheck -w frontend"
  }
}
```

### 4.3 Frontend Scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:cov": "vitest run --coverage",
    "test:watch": "vitest",
    "lint": "eslint src --ext ts,tsx",
    "format": "prettier --write \"src/**/*.{ts,tsx}\"",
    "typecheck": "tsc --noEmit"
  }
}
```

### 4.4 Backend Scripts

```json
{
  "scripts": {
    "dev": "nest start --watch",
    "build": "nest build",
    "start": "node dist/main",
    "start:prod": "node dist/main",
    "test": "jest",
    "test:cov": "jest --coverage",
    "test:watch": "jest --watch",
    "lint": "eslint \"{src,test}/**/*.ts\"",
    "format": "prettier --write \"src/**/*.ts\"",
    "typecheck": "tsc --noEmit"
  }
}
```

### 4.5 Shared Scripts

```json
{
  "scripts": {
    "build": "tsc",
    "watch": "tsc --watch",
    "lint": "eslint src --ext ts",
    "format": "prettier --write \"src/**/*.ts\"",
    "typecheck": "tsc --noEmit"
  }
}
```

---

## 5. Testing Strategy

### 5.1 Coverage Requirements

**Minimum threshold**: 80% across all packages

**Enforcement**:
- Frontend: Vitest coverage configuration
- Backend: Jest coverage configuration
- CI/CD: Fail build if coverage < 80%

### 5.2 Frontend Testing

**Framework**: Vitest + Testing Library

**Test Types**:
1. **Component Tests**: StatusCard, LoadingSpinner
2. **Page Tests**: StatusPage with mocked API
3. **Hook Tests**: useHealth with various states
4. **Integration Tests**: Full user flow

**Coverage Areas**:
- ✅ Component rendering
- ✅ User interactions
- ✅ API call handling
- ✅ Error states
- ✅ Loading states
- ✅ Success states

**Example Test Cases**:
```typescript
// StatusPage.test.tsx
describe('StatusPage', () => {
  it('displays loading state initially', () => {});
  it('displays success when backend is healthy', () => {});
  it('displays error when backend is unreachable', () => {});
  it('displays DB error when database fails', () => {});
});
```

### 5.3 Backend Testing

**Framework**: Jest + NestJS Testing utilities

**Test Types**:
1. **Unit Tests**: Services with mocked dependencies
2. **Controller Tests**: HTTP layer with mocked services
3. **Integration Tests**: Full module testing

**Coverage Areas**:
- ✅ HealthService: DB connection testing
- ✅ UsersService: CRUD operations
- ✅ Validation: DTO validation
- ✅ Error handling: Exception filters
- ✅ Database operations: Repository mocking

**Example Test Cases**:
```typescript
// health.service.spec.ts
describe('HealthService', () => {
  it('returns healthy status when DB is connected', () => {});
  it('returns unhealthy status when DB fails', () => {});
  it('includes error message on DB failure', () => {});
});

// users.service.spec.ts
describe('UsersService', () => {
  it('creates a user with valid data', () => {});
  it('finds all users', () => {});
  it('finds user by id', () => {});
  it('throws NotFoundException for invalid id', () => {});
});
```

### 5.4 Shared Package Testing

**Approach**: Type-level testing via TypeScript compiler

**Validation**:
- ✅ All exports are properly typed
- ✅ DTOs compile without errors
- ✅ No circular dependencies

---

## 6. API Design

### 6.1 Health Endpoint

**Route**: `GET /health`

**Response Type**: `HealthResponseDto`

```typescript
interface HealthResponseDto {
  ok: boolean;
  api: {
    ok: boolean;
  };
  db: {
    ok: boolean;
    error?: string;
  };
  message: string;
  timestamp: string;
}
```

**Success Response** (200):
```json
{
  "ok": true,
  "api": { "ok": true },
  "db": { "ok": true },
  "message": "All systems operational",
  "timestamp": "2026-02-10T15:30:00.000Z"
}
```

**DB Error Response** (200):
```json
{
  "ok": false,
  "api": { "ok": true },
  "db": {
    "ok": false,
    "error": "SQLITE_CANTOPEN: unable to open database file"
  },
  "message": "Database connection failed",
  "timestamp": "2026-02-10T15:30:00.000Z"
}
```

### 6.2 Users Endpoints

#### Create User
**Route**: `POST /users`

**Request Body**: `CreateUserRequestDto`
```typescript
{
  email: string;    // Valid email, required
  name: string;     // Min 2 chars, required
}
```

**Response**: `UserDto` (201)
```typescript
{
  id: string;       // UUID
  email: string;
  name: string;
  createdAt: string; // ISO 8601
}
```

#### Get All Users
**Route**: `GET /users`

**Response**: `UserDto[]` (200)

#### Get User by ID
**Route**: `GET /users/:id`

**Response**: `UserDto` (200)

**Errors**:
- 404: User not found

---

## 7. Configuration Management

### 7.1 Environment Variables

**Backend** (`.env.example`):
```env
# Server
PORT=3000
NODE_ENV=development

# Database
DB_TYPE=sqlite
DB_DATABASE=data/dev.sqlite
DB_SYNCHRONIZE=true

# CORS
CORS_ORIGIN=http://localhost:5173
```

### 7.2 Frontend Configuration

**Vite Proxy** (`vite.config.ts`):
```typescript
export default defineConfig({
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
});
```

### 7.3 TypeScript Configuration

**Shared** (`tsconfig.json`):
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "declaration": true,
    "outDir": "./dist",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  }
}
```

---

## 8. Code Quality Standards

### 8.1 ESLint Configuration

**Rules**:
- TypeScript strict rules
- React hooks rules (frontend)
- No unused variables
- Consistent naming conventions
- Import order enforcement

### 8.2 Prettier Configuration

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2
}
```

### 8.3 Git Ignore

```
# Dependencies
node_modules/
package-lock.json (keep only root)

# Build outputs
dist/
build/
.next/

# Database
backend/data/*.sqlite
backend/data/*.sqlite-*

# Environment
.env
.env.local

# IDE
.vscode/
.idea/

# Testing
coverage/

# Logs
*.log
```

---

## 9. Error Handling Strategy

### 9.1 Backend Error Handling

**NestJS Exception Filters**:
- `ValidationPipe`: Automatic DTO validation
- `HttpException`: Standard HTTP errors
- Custom exception filters for database errors

**Example**:
```typescript
@Post()
async create(@Body() dto: CreateUserDto) {
  // ValidationPipe automatically validates
  // Throws 400 if validation fails
  return this.usersService.create(dto);
}
```

### 9.2 Frontend Error Handling

**API Client**:
```typescript
async function apiCall<T>(url: string): Promise<T> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return response.json();
  } catch (error) {
    // Handle network errors, parse errors, etc.
    throw error;
  }
}
```

**Component Level**:
- Error boundaries for React errors
- Try-catch in async functions
- Error state in components

---

## 10. Database Strategy

### 10.1 TypeORM Configuration

**Synchronize**: `true` in development (documented risk)

**Warning in README**:
> ⚠️ **Development Mode**: `synchronize: true` is enabled for rapid development. This automatically syncs schema changes but **should be disabled in production**. Use migrations for production deployments.

### 10.2 Entity Design

**User Entity**:
```typescript
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @CreateDateColumn()
  createdAt: Date;
}
```

### 10.3 Migration Path

**Future Production Setup**:
1. Disable `synchronize`
2. Generate migrations: `npm run migration:generate`
3. Run migrations: `npm run migration:run`
4. Consider PostgreSQL for production

---

## 11. Implementation Checklist

### Phase 1: Project Setup
- [ ] Create root `package.json` with workspaces
- [ ] Create `.gitignore`
- [ ] Create root ESLint and Prettier configs
- [ ] Create `README.md` with setup instructions

### Phase 2: Shared Package
- [ ] Create `shared/package.json`
- [ ] Create `shared/tsconfig.json`
- [ ] Create DTOs: `HealthResponseDto`, `UserDto`, `CreateUserRequestDto`
- [ ] Create barrel export `index.ts`
- [ ] Add ESLint and Prettier configs
- [ ] Test build: `npm run build -w shared`

### Phase 3: Backend Setup
- [ ] Create `backend/package.json` with dependencies
- [ ] Create NestJS configuration files
- [ ] Create `main.ts` with Swagger setup
- [ ] Create `app.module.ts`
- [ ] Configure TypeORM with SQLite
- [ ] Add CORS configuration
- [ ] Create `.env.example`

### Phase 4: Backend - Health Module
- [ ] Create `health.module.ts`
- [ ] Create `health.controller.ts` with Swagger decorators
- [ ] Create `health.service.ts` with real DB check
- [ ] Create `health.service.spec.ts` with tests
- [ ] Test endpoint manually

### Phase 5: Backend - Users Module
- [ ] Create `user.entity.ts`
- [ ] Create DTOs with validation decorators
- [ ] Create `users.module.ts`
- [ ] Create `users.controller.ts` with Swagger
- [ ] Create `users.service.ts` with CRUD operations
- [ ] Create `users.service.spec.ts` with tests
- [ ] Create `users.controller.spec.ts`
- [ ] Test all endpoints

### Phase 6: Backend - Testing
- [ ] Configure Jest with coverage thresholds
- [ ] Write unit tests for services
- [ ] Write controller tests
- [ ] Run `npm run test:cov` - verify ≥80%
- [ ] Fix any coverage gaps

### Phase 7: Frontend Setup
- [ ] Create `frontend/package.json` with dependencies
- [ ] Create Vite configuration with proxy
- [ ] Create TypeScript configurations
- [ ] Configure TailwindCSS
- [ ] Create `index.html` and `main.tsx`
- [ ] Create `App.tsx`

### Phase 8: Frontend - API Layer
- [ ] Create `api/client.ts` with error handling
- [ ] Create `api/health.api.ts`
- [ ] Create `hooks/useHealth.ts`

### Phase 9: Frontend - Components
- [ ] Create `components/StatusCard.tsx`
- [ ] Create `components/LoadingSpinner.tsx`
- [ ] Create `pages/StatusPage.tsx`
- [ ] Style with TailwindCSS

### Phase 10: Frontend - Testing
- [ ] Configure Vitest with coverage
- [ ] Create test setup file
- [ ] Write `StatusPage.test.tsx`
- [ ] Write `useHealth.test.ts`
- [ ] Run `npm run test:cov` - verify ≥80%

### Phase 11: Integration & Scripts
- [ ] Create root scripts (dev, build, test, etc.)
- [ ] Test `npm install` from clean state
- [ ] Test `npm run dev` - verify both servers start
- [ ] Test `npm run build` - verify all packages build
- [ ] Test `npm run test` - verify all tests pass
- [ ] Test `npm run test:cov` - verify ≥80% coverage
- [ ] Test `npm run lint` - verify no errors
- [ ] Test `npm run format` - verify formatting works

### Phase 12: Documentation
- [ ] Write comprehensive `README.md`
- [ ] Document all scripts
- [ ] Add setup instructions
- [ ] Add architecture overview
- [ ] Add troubleshooting section
- [ ] Document environment variables
- [ ] Add development workflow guide

### Phase 13: Final Validation
- [ ] Clean install: delete `node_modules`, run `npm install`
- [ ] Verify frontend displays status correctly
- [ ] Verify Swagger docs at `http://localhost:3000/docs`
- [ ] Test health endpoint returns correct data
- [ ] Test user CRUD operations
- [ ] Verify all quality gates pass
- [ ] Review all code for TODOs
- [ ] Final code review

---

## 12. Success Criteria

### ✅ Functional Requirements
- [ ] `npm install` completes without errors
- [ ] `npm run dev` starts both frontend and backend
- [ ] Frontend displays at `http://localhost:5173`
- [ ] Backend API responds at `http://localhost:3000`
- [ ] Swagger docs available at `http://localhost:3000/docs`
- [ ] Status page shows real backend/DB status
- [ ] Health endpoint performs real DB check
- [ ] User CRUD operations work correctly
- [ ] Error states display properly

### ✅ Quality Requirements
- [ ] `npm run build` completes without errors
- [ ] `npm run test` passes all tests
- [ ] `npm run test:cov` shows ≥80% coverage (frontend + backend)
- [ ] `npm run lint` shows no errors
- [ ] `npm run typecheck` shows no type errors
- [ ] All code follows ESLint rules
- [ ] All code is formatted with Prettier

### ✅ Architecture Requirements
- [ ] NPM workspaces configured correctly
- [ ] Shared package consumed by frontend and backend
- [ ] TypeScript strict mode enabled
- [ ] Validation on all backend inputs
- [ ] Proper error handling throughout
- [ ] CORS configured for development
- [ ] Environment variables documented
- [ ] No TODO comments blocking functionality

---

## 13. Risk Mitigation

### Risk 1: SQLite Synchronize in Production
**Mitigation**: Clear documentation warning, migration path outlined

### Risk 2: Coverage Threshold Not Met
**Mitigation**: Write tests incrementally, use coverage reports to identify gaps

### Risk 3: Workspace Dependencies Not Resolving
**Mitigation**: Use `workspace:*` protocol, ensure build order is correct

### Risk 4: CORS Issues in Development
**Mitigation**: Vite proxy configured, CORS enabled in NestJS

### Risk 5: Type Mismatches Between Frontend/Backend
**Mitigation**: Shared package ensures single source of truth

---

## 14. Next Steps

After architecture approval, proceed to implementation in this order:

1. **Switch to Code Mode** to begin implementation
2. **Start with Phase 1**: Project setup and root configuration
3. **Build incrementally**: Complete each phase before moving to next
4. **Test continuously**: Run tests after each module completion
5. **Validate frequently**: Check that scripts work at each phase

---

## Appendix A: Key Design Decisions

### Decision 1: NPM Workspaces vs. Other Monorepo Tools
**Chosen**: NPM Workspaces
**Reason**: Native, simple, no additional tooling, meets all requirements

### Decision 2: Vite vs. Create React App
**Chosen**: Vite
**Reason**: Faster, modern, better DX, native ESM, easier proxy setup

### Decision 3: Vitest vs. Jest (Frontend)
**Chosen**: Vitest
**Reason**: Vite-native, same config, faster, better DX with Vite projects

### Decision 4: SQLite vs. PostgreSQL
**Chosen**: SQLite (development), PostgreSQL (production path)
**Reason**: Zero config for dev, easy migration path documented

### Decision 5: Shared Package Build Strategy
**Chosen**: Compile TypeScript to dist/
**Reason**: Clean separation, works with both CJS and ESM, standard approach

---

## Appendix B: File Count Estimate

- **Root**: 6 files
- **Frontend**: ~25 files
- **Backend**: ~30 files
- **Shared**: ~8 files
- **Total**: ~69 files

Estimated implementation time: 2-3 hours for complete generation and testing.
