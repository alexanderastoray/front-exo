# Full-Stack Monorepo

A production-ready full-stack monorepo featuring React, NestJS, and TypeScript with comprehensive testing and quality standards.

## 🏗️ Architecture

This monorepo consists of three packages:

- **`frontend/`** - React 18 + Vite + TypeScript + TailwindCSS
- **`backend/`** - NestJS + TypeORM + SQLite + Swagger
- **`shared/`** - Shared TypeScript types and DTOs

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0

### Installation

```bash
# Install all dependencies
npm install
```

### Development

```bash
# Start both frontend and backend in development mode
npm run dev
```

This will start:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- Swagger Docs: http://localhost:3000/docs

### Building

```bash
# Build all packages (shared → backend → frontend)
npm run build
```

### Testing

```bash
# Run all tests
npm run test

# Run tests with coverage (≥80% required)
npm run test:cov
```

### Code Quality

```bash
# Lint all packages
npm run lint

# Format all code
npm run format

# Type check all packages
npm run typecheck
```

## 📦 Package Scripts

### Frontend (`frontend/`)

```bash
npm run dev -w frontend          # Start Vite dev server
npm run build -w frontend        # Build for production
npm run preview -w frontend      # Preview production build
npm run test -w frontend         # Run tests
npm run test:cov -w frontend     # Run tests with coverage
```

### Backend (`backend/`)

```bash
npm run dev -w backend           # Start NestJS in watch mode
npm run build -w backend         # Build for production
npm run start -w backend         # Start production server
npm run test -w backend          # Run tests
npm run test:cov -w backend      # Run tests with coverage
```

### Shared (`shared/`)

```bash
npm run build -w shared          # Compile TypeScript
npm run watch -w shared          # Watch mode for development
```

## 🗂️ Project Structure

```
/
├── frontend/              # React application
│   ├── src/
│   │   ├── api/          # API client and endpoints
│   │   ├── components/   # Reusable React components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── pages/        # Page components
│   │   └── styles/       # Global styles
│   └── tests/            # Test files
│
├── backend/              # NestJS application
│   ├── src/
│   │   ├── config/       # Configuration files
│   │   ├── database/     # Database module
│   │   ├── health/       # Health check module
│   │   └── users/        # Users CRUD module
│   └── test/             # E2E tests
│
└── shared/               # Shared TypeScript package
    └── src/
        └── dtos/         # Shared DTOs and types
```

## 🔌 API Endpoints

### Health Check

**GET** `/health`

Returns the health status of the API and database.

```json
{
  "ok": true,
  "api": { "ok": true },
  "db": { "ok": true },
  "message": "All systems operational",
  "timestamp": "2026-02-10T15:30:00.000Z"
}
```

### Users

**POST** `/users` - Create a new user

Request body:
```json
{
  "email": "user@example.com",
  "name": "John Doe"
}
```

**GET** `/users` - Get all users

**GET** `/users/:id` - Get user by ID

## 🧪 Testing Strategy

### Coverage Requirements

- **Minimum threshold**: 80% across all packages
- **Enforcement**: CI/CD fails if coverage < 80%

### Frontend Testing

- **Framework**: Vitest + Testing Library
- **Test types**: Component tests, hook tests, integration tests
- **Coverage areas**: Rendering, interactions, API calls, error states

### Backend Testing

- **Framework**: Jest + NestJS Testing utilities
- **Test types**: Unit tests, controller tests, integration tests
- **Coverage areas**: Services, controllers, validation, error handling

## ⚙️ Configuration

### Environment Variables

Backend environment variables (create `.env` in `backend/`):

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

> ⚠️ **Development Mode**: `DB_SYNCHRONIZE=true` is enabled for rapid development. This automatically syncs schema changes but **should be disabled in production**. Use migrations for production deployments.

### Vite Proxy

The frontend is configured to proxy `/api/*` requests to the backend during development. See [`frontend/vite.config.ts`](frontend/vite.config.ts).

## 🛠️ Technology Stack

### Frontend
- **React 18** - UI library with concurrent features
- **Vite** - Fast build tool and dev server
- **TypeScript** - Type safety
- **TailwindCSS** - Utility-first CSS framework
- **Vitest** - Vite-native testing framework

### Backend
- **NestJS** - Progressive Node.js framework
- **TypeORM** - ORM with TypeScript support
- **SQLite** - Embedded database (development)
- **Swagger** - API documentation
- **Jest** - Testing framework

### Shared
- **TypeScript** - Shared types and DTOs

## 📋 Quality Standards

### Code Quality
- ✅ TypeScript strict mode enabled
- ✅ ESLint for code linting
- ✅ Prettier for code formatting
- ✅ No unused variables
- ✅ Consistent naming conventions

### Testing
- ✅ ≥80% test coverage
- ✅ Unit tests for all services
- ✅ Component tests for React components
- ✅ Integration tests for critical flows

### Architecture
- ✅ NPM workspaces for monorepo management
- ✅ Shared package for type safety
- ✅ Layered architecture (Controllers → Services → Repositories)
- ✅ Dependency injection
- ✅ Proper error handling

## 🚧 Development Workflow

1. **Make changes** to any package
2. **Run tests** to ensure nothing breaks
3. **Check types** with `npm run typecheck`
4. **Lint code** with `npm run lint`
5. **Format code** with `npm run format`
6. **Commit changes** with descriptive messages

## 🐛 Troubleshooting

### Port already in use

If port 3000 or 5173 is already in use:
- Change `PORT` in `backend/.env`
- Change `server.port` in `frontend/vite.config.ts`

### Database locked error

SQLite may lock the database file. Stop all running processes and restart.

### Workspace dependencies not resolving

```bash
# Clean install
rm -rf node_modules package-lock.json
rm -rf */node_modules
npm install
```

### Tests failing

```bash
# Rebuild shared package
npm run build -w shared

# Clear test cache
npm run test -- --clearCache -w backend
npm run test -- --clearCache -w frontend
```

## 📚 Additional Resources

- [React Documentation](https://react.dev/)
- [NestJS Documentation](https://docs.nestjs.com/)
- [TypeORM Documentation](https://typeorm.io/)
- [Vite Documentation](https://vitejs.dev/)
- [TailwindCSS Documentation](https://tailwindcss.com/)

## 📄 License

MIT

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Ensure tests pass and coverage ≥80%
5. Submit a pull request

---

**Built with ❤️ using modern web technologies**
