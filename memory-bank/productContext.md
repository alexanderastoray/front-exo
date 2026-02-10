# Product Context

This file provides a high-level overview of the project and the expected product that will be created. Initially it is based upon projectBrief.md (if provided) and all other available project-related information in the working directory. This file is intended to be updated as the project evolves, and should be used to inform all other modes of the project's goals and context.

## Project Goal

Production-ready full-stack monorepo with Node.js + TypeScript, featuring:
- **Frontend**: React + Vite + TypeScript + TailwindCSS
- **Backend**: NestJS + TypeScript + SQLite + TypeORM + Swagger
- **Shared**: TypeScript package for shared types/DTOs
- **Quality**: ≥80% test coverage, ESLint, Prettier, full type safety

## Key Features

### Core Infrastructure
- NPM workspaces monorepo structure
- Shared TypeScript package for DTOs/types
- Environment configuration management
- CORS configuration for development
- Comprehensive error handling

### Frontend Features
- Status dashboard showing system health
- Real-time backend/database connectivity check
- Clean Tailwind UI
- Vite proxy for API calls
- Vitest + Testing Library for tests

### Backend Features
- Health check endpoint with real DB testing
- User management (CRUD operations)
- Swagger documentation at `/docs`
- Input validation with class-validator
- TypeORM with SQLite
- Structured logging with NestJS Logger

### Quality Standards
- ESLint + Prettier across all packages
- ≥80% test coverage (frontend + backend)
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
│   │   ├── health/    # Health check module
│   │   ├── users/     # User CRUD module
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── data/          # SQLite database files
│   └── package.json
│
├── shared/            # Shared TypeScript types
│   ├── src/
│   │   ├── dtos/      # Data Transfer Objects
│   │   └── index.ts
│   └── package.json
│
├── package.json       # Root workspace config
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

---

2026-02-10 16:28:40 - Initial project context created for full-stack monorepo
