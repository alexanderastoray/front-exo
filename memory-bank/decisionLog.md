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

---

## [2026-02-11 09:02:00] Expense Management API Architecture

**Decision**: Architecture modulaire NestJS avec 6 modules principaux

**Rationale**:
- Séparation claire des responsabilités (Users, ExpenseReports, Expenses, Attachments)
- CommonModule pour code partagé (enums, guards, interceptors)
- DatabaseModule pour configuration TypeORM centralisée
- Facilite la testabilité et la maintenabilité

**Implementation Details**:
- CommonModule: Enums, FakeAuthGuard, TransformInterceptor, HttpExceptionFilter
- UsersModule: CRUD utilisateurs (EMPLOYEE uniquement en V1)
- ExpenseReportsModule: CRUD notes de frais + transitions de statuts + calcul totalAmount
- ExpensesModule: CRUD dépenses + recalcul automatique totalAmount du report parent
- AttachmentsModule: Upload/download/delete fichiers + stockage local
- DatabaseModule: Configuration TypeORM + SQLite

---

## [2026-02-11 09:02:00] Data Model: UUID + Cascade Delete + Lazy Loading

**Decision**: Utiliser UUID pour les IDs, CASCADE pour les suppressions, LAZY pour les relations

**Rationale**:
- UUID: Génération côté application, pas de collision, sécurité
- CASCADE: Garantit intégrité référentielle (User → Reports → Expenses → Attachments)
- LAZY: Évite requêtes N+1, chargement explicite via `relations: []`

**Implementation Details**:
- `@PrimaryGeneratedColumn('uuid')` sur toutes les entities
- `onDelete: 'CASCADE'` sur toutes les relations FK
- Pas de eager loading par défaut
- Indices sur FK et champs fréquemment filtrés (status, dates)

---

## [2026-02-11 09:02:00] Status Transitions: Service Layer + Helper Pattern

**Decision**: Implémenter les règles de transitions de statuts dans Service Layer avec Helpers

**Rationale**:
- Logique métier centralisée et réutilisable
- Testable unitairement (helpers = pure functions)
- Pas de duplication de code
- Séparation claire entre validation et exécution

**Implementation Details**:
- `ReportStatusHelper.canModify(status)`: Vérifie si modification autorisée
- `ReportStatusHelper.canTransitionTo(from, to)`: Vérifie si transition valide
- Service layer appelle helpers avant toute opération
- Throw `BadRequestException` si règle violée

---

## [2026-02-11 09:02:00] File Storage: Local Filesystem (V1) + Cloud-Ready (V2)

**Decision**: Stockage local en V1, abstraction pour migration cloud en V2

**Rationale**:
- Local filesystem: Simple, pas de dépendance externe, facile à tester
- Abstraction IFileStorage: Facilite migration vers S3/Azure Blob en V2
- Convention UUID pour noms de fichiers: Évite collisions et path traversal

**Implementation Details**:
- Répertoire: `backend/uploads/<expenseId>/<uuid>.<ext>`
- Métadonnées en DB: fileName, filePath, mimeType, size
- Validation: Taille max 5MB, types autorisés (jpeg, png, pdf)
- Suppression: DB + fichier physique (log warning si échec fichier)
- Interface IFileStorage pour abstraction future

---

## [2026-02-11 09:02:00] Testing Strategy: ≥85% Coverage + Colocated Tests

**Decision**: Objectif 85% coverage global, tests colocalisés avec le code

**Rationale**:
- 85% coverage: Balance entre qualité et pragmatisme
- Tests colocalisés: Facilite maintenance et découverte
- Mock repositories: Isole logique métier des dépendances DB
- Helpers à 95%: Logique pure, facile à tester exhaustivement

**Implementation Details**:
- Jest avec coverage thresholds dans jest.config.js
- Tests unitaires: Services (≥90%), Controllers (≥85%), Helpers (≥95%)
- Mock TypeORM repositories avec `repositoryMockFactory`
- Mock filesystem pour tests upload/download
- Scripts: `npm run test`, `npm run test:cov`, `npm run test:watch`
