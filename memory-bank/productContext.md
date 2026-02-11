# Product Context

This file provides a high-level overview of the project and the expected product that will be created. Initially it is based upon projectBrief.md (if provided) and all other available project-related information in the working directory. This file is intended to be updated as the project evolves, and should be used to inform all other modes of the project's goals and context.

## Project Goal

Production-ready full-stack monorepo with Node.js + TypeScript, featuring:
- **Frontend**: React + Vite + TypeScript + TailwindCSS
- **Backend**: NestJS + TypeScript + SQLite + TypeORM + Swagger
- **Shared**: TypeScript package for shared types/DTOs
- **Quality**: ≥80% test coverage, ESLint, Prettier, full type safety

**NEW**: API de gestion de notes de frais (Expense Management API)
- Backend NestJS avec TypeORM + SQLite
- Swagger documentation complète
- Tests unitaires ≥85% coverage
- Authentification factice (V1) → JWT (V2)
- Stockage local fichiers (V1) → Cloud (V2)

## Key Features

### Core Infrastructure (Existing)
- NPM workspaces monorepo structure
- Shared TypeScript package for DTOs/types
- Environment configuration management
- CORS configuration for development
- Comprehensive error handling

### Frontend Features (Existing)
- Status dashboard showing system health
- Real-time backend/database connectivity check
- Clean Tailwind UI
- Vite proxy for API calls
- Vitest + Testing Library for tests

### Backend Features (Existing)
- Health check endpoint with real DB testing
- User management (CRUD operations)
- Swagger documentation at `/docs`
- Input validation with class-validator
- TypeORM with SQLite
- Structured logging with NestJS Logger

### NEW: Expense Management API (V1)

#### Entities & Relations
1. **User**: firstName, lastName, email (unique), role (EMPLOYEE), managerId (V2)
2. **ExpenseReport**: purpose, reportDate, totalAmount (calculated), status, paymentDate, userId
3. **Expense**: reportId, category, expenseName, description, amount, expenseDate, status
4. **Attachment**: expenseId, fileName, filePath, mimeType, size

#### Business Rules
- totalAmount calculé automatiquement (somme des expenses)
- Recalcul à chaque create/update/delete d'expense
- Modification autorisée si status ∈ {CREATED, SUBMITTED}
- Workflow: CREATED → SUBMITTED → VALIDATED/REJECTED → PAID
- Upload fichiers: 5MB max, types autorisés (jpeg, png, pdf)
- Stockage local: `uploads/<expenseId>/<uuid>.<ext>`

#### API Endpoints (25+)
- **Users**: GET, POST, PATCH, DELETE /api/users
- **ExpenseReports**: CRUD + /submit, /validate, /reject, /pay
- **Expenses**: CRUD avec recalcul automatique totalAmount
- **Attachments**: Upload, download, delete, list

#### Authentication
- V1: FakeAuthGuard (return true)
- V2: JWT + rôles (EMPLOYEE, MANAGER)

### Quality Standards
- ESLint + Prettier across all packages
- ≥85% test coverage (Expense API)
- ≥80% test coverage (existing features)
- TypeScript strict mode
- Validation on all inputs
- Proper error handling and HTTP exceptions

## Overall Architecture

```
/
├── frontend/          # React + Vite + TypeScript
│   ├── src/
│   │   ├── api/       # API client layer
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── styles/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── tests/
│   └── package.json
│
├── backend/           # NestJS + TypeORM + SQLite
│   ├── src/
│   │   ├── config/    # Configuration modules
│   │   ├── database/  # TypeORM setup
│   │   ├── common/    # Shared (enums, guards, interceptors, filters)
│   │   ├── health/    # Health check module
│   │   ├── users/     # User CRUD module
│   │   ├── expense-reports/  # ExpenseReports module
│   │   ├── expenses/         # Expenses module
│   │   ├── attachments/      # Attachments module
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── data/          # SQLite database files
│   ├── uploads/       # File uploads (gitignored)
│   └── package.json
│
├── shared/            # Shared TypeScript types
│   ├── src/
│   │   ├── dtos/      # Data Transfer Objects
│   │   └── index.ts
│   └── package.json
│
├── memory-bank/       # Project context & decisions
│   ├── productContext.md
│   ├── activeContext.md
│   ├── progress.md
│   ├── decisionLog.md
│   └── systemPatterns.md
│
├── package.json       # Root workspace config
├── ARCHITECTURE_PLAN.md  # Original architecture
├── ARCHITECTURE_GESTION_NOTES_FRAIS.md  # Expense API architecture
└── README.md
```

### Technology Stack

**Frontend**
- React 18+ with TypeScript
- Vite for build tooling
- TailwindCSS for styling
- Vitest + Testing Library for testing
- ESLint + Prettier

**Backend**
- NestJS framework
- TypeORM for database ORM
- SQLite for database
- Swagger/OpenAPI documentation
- class-validator for validation
- Jest for testing

**Shared**
- Pure TypeScript package
- Exported DTOs and types
- Consumed via workspace protocol

### Development Workflow

1. `npm install` - Install all dependencies
2. `npm run dev` - Start frontend (5173) + backend (3000)
3. `npm run build` - Build all packages
4. `npm run test` - Run all tests
5. `npm run test:cov` - Generate coverage reports (≥80%)

### API Communication

- Frontend runs on port 5173
- Backend runs on port 3000
- Vite proxy: `/api/*` → `http://localhost:3000/*`
- Frontend calls: `fetch('/api/health')`
- Swagger docs: `http://localhost:3000/docs`

---

2026-02-10 16:28:40 - Initial project context created for full-stack monorepo
2026-02-11 09:02:00 - Added Expense Management API architecture and features
