# Architecture Plan: API Gestion de Notes de Frais
## NestJS + TypeORM + SQLite

**Version**: 1.0  
**Date**: 2026-02-11  
**Status**: Architecture & Planning Phase  
**Architecte**: Senior Backend Architect  
**Language**: Français

---

## Table des Matières

1. [Executive Summary](#1-executive-summary)
2. [Architecture Applicative NestJS](#2-architecture-applicative-nestjs)
3. [Schéma de Données & Contraintes](#3-schéma-de-données--contraintes)
4. [API Design (Swagger-First)](#4-api-design-swagger-first)
5. [Stratégie Fichiers (Upload)](#5-stratégie-fichiers-upload)
6. [Règles Statuts & Transitions](#6-règles-statuts--transitions)
7. [Stratégie de Tests & Couverture](#7-stratégie-de-tests--couverture)
8. [Plan de Travail (Roadmap)](#8-plan-de-travail-roadmap)
9. [Points à Confirmer](#9-points-à-confirmer)

---

## 1. Executive Summary

### 1.1 Objectif

Concevoir l'architecture complète d'une **API de gestion de notes de frais** en NestJS + TypeORM + SQLite, avec documentation Swagger et stratégie de tests unitaires (≥85% coverage).

**Périmètre V1**:
- ✅ Gestion des utilisateurs (EMPLOYEE uniquement)
- ✅ Gestion des notes de frais (ExpenseReport)
- ✅ Gestion des dépenses (Expense)
- ✅ Gestion des pièces jointes (Attachment)
- ✅ Authentification factice (FakeAuthGuard)
- ✅ Stockage local des fichiers
- ✅ Calcul automatique des totaux
- ✅ Workflow de statuts (CREATED → SUBMITTED → VALIDATED/REJECTED → PAID)

**Hors périmètre V1**:
- ❌ Authentification JWT réelle
- ❌ Gestion des rôles (MANAGER)
- ❌ Validation manager
- ❌ Stockage cloud des fichiers
- ❌ Notifications

### 1.2 Stack Technique (Imposée)

| Composant | Technologie | Version |
|-----------|-------------|---------|
| Framework | NestJS | ^10.3.0 |
| ORM | TypeORM | ^0.3.19 |
| Database | SQLite | ^5.1.7 |
| Documentation | Swagger (@nestjs/swagger) | ^7.1.17 |
| Validation | class-validator | ^0.14.0 |
| Tests | Jest | ^29.7.0 |
| Language | TypeScript | ^5.3.3 |

### 1.3 Principes Architecturaux

- **Modularité**: Chaque domaine métier = 1 module NestJS
- **Séparation des responsabilités**: Controllers → Services → Repositories → Entities
- **Type Safety**: TypeScript strict mode + DTOs validés
- **Documentation-First**: Swagger decorators sur tous les endpoints
- **Testabilité**: Injection de dépendances + mocking facilité
- **Évolutivité**: Structure préparée pour V2 (JWT, rôles, manager workflow)

---

## 2. Architecture Applicative NestJS

### 2.1 Découpage en Modules

**Modules proposés**:
1. **CommonModule**: Enums, DTOs partagés, Guards, Interceptors, Filters
2. **DatabaseModule**: Configuration TypeORM
3. **UsersModule**: Gestion des utilisateurs
4. **ExpenseReportsModule**: Gestion des notes de frais
5. **ExpensesModule**: Gestion des dépenses
6. **AttachmentsModule**: Gestion des pièces jointes

**Structure de fichiers**:

```
backend/src/
├── app.module.ts                    # Module racine
├── main.ts                          # Bootstrap application
│
├── config/                          # Configuration
│   ├── database.config.ts           # TypeORM config
│   ├── app.config.ts                # App-level config
│   └── swagger.config.ts            # Swagger setup
│
├── common/                          # CommonModule (partagé)
│   ├── common.module.ts
│   ├── guards/
│   │   └── fake-auth.guard.ts       # V1: return true
│   ├── interceptors/
│   │   ├── transform.interceptor.ts # Response standardization
│   │   └── logging.interceptor.ts   # Request/response logging
│   ├── filters/
│   │   └── http-exception.filter.ts # Global error handling
│   ├── pipes/
│   │   └── validation.pipe.ts       # Global validation
│   ├── decorators/
│   │   ├── api-paginated-response.decorator.ts
│   │   └── current-user.decorator.ts # V2: extract user from JWT
│   ├── dto/
│   │   ├── pagination.dto.ts        # Query params for pagination
│   │   └── error-response.dto.ts    # Standard error format
│   └── enums/
│       ├── user-role.enum.ts        # EMPLOYEE (V1)
│       ├── report-status.enum.ts    # CREATED, SUBMITTED, etc.
│       ├── expense-status.enum.ts   # CREATED, SUBMITTED, etc.
│       └── expense-category.enum.ts # TRAVEL, MEALS, etc.
│
├── database/                        # DatabaseModule
│   └── database.module.ts           # TypeORM setup
│
├── users/                           # UsersModule
│   ├── users.module.ts
│   ├── users.controller.ts
│   ├── users.service.ts
│   ├── users.controller.spec.ts
│   ├── users.service.spec.ts
│   ├── entities/
│   │   └── user.entity.ts
│   └── dto/
│       ├── create-user.dto.ts
│       ├── update-user.dto.ts
│       └── user-response.dto.ts
│
├── expense-reports/                 # ExpenseReportsModule
│   ├── expense-reports.module.ts
│   ├── expense-reports.controller.ts
│   ├── expense-reports.service.ts
│   ├── expense-reports.controller.spec.ts
│   ├── expense-reports.service.spec.ts
│   ├── entities/
│   │   └── expense-report.entity.ts
│   ├── dto/
│   │   ├── create-expense-report.dto.ts
│   │   ├── update-expense-report.dto.ts
│   │   ├── expense-report-response.dto.ts
│   │   └── expense-report-list.dto.ts
│   └── helpers/
│       └── report-status.helper.ts  # Business rules for status transitions
│
├── expenses/                        # ExpensesModule
│   ├── expenses.module.ts
│   ├── expenses.controller.ts
│   ├── expenses.service.ts
│   ├── expenses.controller.spec.ts
│   ├── expenses.service.spec.ts
│   ├── entities/
│   │   └── expense.entity.ts
│   ├── dto/
│   │   ├── create-expense.dto.ts
│   │   ├── update-expense.dto.ts
│   │   ├── expense-response.dto.ts
│   │   └── expense-list.dto.ts
│   └── helpers/
│       └── expense-status.helper.ts # Business rules for status transitions
│
└── attachments/                     # AttachmentsModule
    ├── attachments.module.ts
    ├── attachments.controller.ts
    ├── attachments.service.ts
    ├── attachments.controller.spec.ts
    ├── attachments.service.spec.ts
    ├── entities/
    │   └── attachment.entity.ts
    ├── dto/
    │   ├── attachment-response.dto.ts
    │   └── upload-response.dto.ts
    └── helpers/
        └── file-storage.helper.ts   # File system operations
```

### 2.2 Responsabilités par Couche

#### Controllers
- Gestion des requêtes HTTP
- Validation des inputs (via DTOs)
- Application des Guards et Interceptors
- Transformation des réponses
- Documentation Swagger

#### Services
- Logique métier
- Orchestration des repositories
- Gestion des transactions
- Calcul des totaux
- Validation des transitions de statuts

#### Repositories (TypeORM)
- Accès aux données
- Requêtes SQL
- Gestion des relations

#### Entities
- Modèle de données
- Mapping ORM
- Définition des contraintes

#### DTOs
- Contrats d'API
- Validation (class-validator)
- Documentation (Swagger)

### 2.3 Conventions de Nommage

**Fichiers**: `<entity>.<type>.ts`
- `user.entity.ts`
- `create-user.dto.ts`
- `users.service.ts`
- `users.controller.ts`
- `users.service.spec.ts`

**Classes**: `<Entity><Type>`
- `User` (entity)
- `CreateUserDto`
- `UsersService`
- `UsersController`

**Routes**: `/api/<resource>/<id?>/<sub-resource?>`
- `GET /api/users`
- `POST /api/expense-reports`
- `GET /api/expense-reports/:id/expenses`

**Prefix global**: `/api`

### 2.4 Configuration

**Variables d'environnement** (`.env`):
```env
# Application
NODE_ENV=development
PORT=3000
API_PREFIX=api

# Database
DB_TYPE=sqlite
DB_DATABASE=./data/expense-management.sqlite
DB_SYNCHRONIZE=true  # false en production
DB_LOGGING=true

# File Upload
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880  # 5MB
ALLOWED_MIME_TYPES=image/jpeg,image/png,application/pdf

# Future (V2)
JWT_SECRET=your-secret-key
JWT_EXPIRATION=1h
```

---

## 3. Schéma de Données & Contraintes

### 3.1 Schéma Relationnel

```
┌─────────────────────────────────────────────────────────────────┐
│                            User                                  │
├─────────────────────────────────────────────────────────────────┤
│ id: uuid (PK)                                                    │
│ firstName: string                                                │
│ lastName: string                                                 │
│ email: string (UNIQUE)                                           │
│ role: UserRole (EMPLOYEE)                                        │
│ managerId: uuid | null (FK → User.id, V2)                        │
│ createdAt: timestamp                                             │
│ updatedAt: timestamp                                             │
└─────────────────────────────────────────────────────────────────┘
                    │
                    │ 1:N
                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                       ExpenseReport                              │
├─────────────────────────────────────────────────────────────────┤
│ id: uuid (PK)                                                    │
│ purpose: string                                                  │
│ reportDate: date                                                 │
│ totalAmount: number (calculated & persisted)                     │
│ status: ReportStatus                                             │
│ paymentDate: date | null                                         │
│ userId: uuid (FK → User.id)                                      │
│ createdAt: timestamp                                             │
│ updatedAt: timestamp                                             │
└─────────────────────────────────────────────────────────────────┘
                    │
                    │ 1:N
                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                          Expense                                 │
├─────────────────────────────────────────────────────────────────┤
│ id: uuid (PK)                                                    │
│ reportId: uuid (FK → ExpenseReport.id)                           │
│ category: ExpenseCategory                                        │
│ expenseName: string | null                                       │
│ description: string | null                                       │
│ amount: number                                                   │
│ expenseDate: date                                                │
│ status: ExpenseStatus                                            │
│ createdAt: timestamp                                             │
│ updatedAt: timestamp                                             │
└─────────────────────────────────────────────────────────────────┘
                    │
                    │ 1:N
                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                        Attachment                                │
├─────────────────────────────────────────────────────────────────┤
│ id: uuid (PK)                                                    │
│ expenseId: uuid (FK → Expense.id)                                │
│ fileName: string                                                 │
│ filePath: string                                                 │
│ mimeType: string                                                 │
│ size: number (bytes)                                             │
│ createdAt: timestamp                                             │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 Cardinalités & Relations

| Relation | Type | Cascade Delete | Eager/Lazy |
|----------|------|----------------|------------|
| User → ExpenseReport | 1:N | CASCADE | Lazy |
| ExpenseReport → Expense | 1:N | CASCADE | Lazy |
| Expense → Attachment | 1:N | CASCADE | Lazy |
| User → User (manager) | 1:N | SET NULL | Lazy (V2) |

**Justification CASCADE**:
- Suppression User → supprime ExpenseReports → supprime Expenses → supprime Attachments
- Garantit l'intégrité référentielle
- Simplifie la gestion des suppressions

**Justification LAZY**:
- Évite les requêtes N+1
- Chargement explicite via `relations: ['expenses']`
- Meilleure performance

### 3.3 Contraintes & Indices

#### User
- `email` UNIQUE (index)
- `role` NOT NULL, default EMPLOYEE
- `managerId` nullable (V2)
- Index sur `email`

#### ExpenseReport
- `userId` NOT NULL, FK → users.id, ON DELETE CASCADE
- `status` NOT NULL
- `totalAmount` DECIMAL(10,2), default 0
- `paymentDate` nullable
- Index sur `userId`, `status`, `reportDate`

#### Expense
- `reportId` NOT NULL, FK → expense_reports.id, ON DELETE CASCADE
- `category` NOT NULL
- `amount` DECIMAL(10,2), NOT NULL
- `expenseDate` NOT NULL
- `status` NOT NULL
- Index sur `reportId`, `status`, `expenseDate`

#### Attachment
- `expenseId` NOT NULL, FK → expenses.id, ON DELETE CASCADE
- `fileName`, `filePath`, `mimeType`, `size` NOT NULL
- Index sur `expenseId`

### 3.4 Gestion des Enums en SQLite

**Problème**: SQLite ne supporte pas les ENUM natifs.

**Solution**: Stockage en VARCHAR + validation applicative

```typescript
export enum UserRole {
  EMPLOYEE = 'EMPLOYEE',
  // V2: MANAGER = 'MANAGER',
}

// Dans l'entity
@Column({ type: 'varchar' })
role: UserRole;
```

**Validation**:
- TypeORM: `type: 'varchar'`
- DTO: `@IsEnum(UserRole)`

### 3.5 Choix UUID vs Auto-Increment

**Choix**: **UUID** (imposé)

**Avantages**:
- Génération côté application (pas de dépendance DB)
- Pas de collision en environnement distribué
- Sécurité (pas de séquence prévisible)
- Migration facilitée entre bases

**Implémentation**:
```typescript
@PrimaryGeneratedColumn('uuid')
id: string;
```

---

## 4. API Design (Swagger-First)

### 4.1 Principes de Design

- **RESTful**: Ressources, verbes HTTP standards
- **Pagination**: `?page=1&limit=10`
- **Filtrage**: `?status=SUBMITTED&userId=xxx`
- **Tri**: `?sortBy=createdAt&order=DESC`
- **Codes HTTP**: 200, 201, 204, 400, 404, 409, 500
- **Format réponse**: JSON standardisé

### 4.2 Format de Réponse Standardisé

#### Succès (Single Resource)
```json
{
  "data": {
    "id": "uuid",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "EMPLOYEE",
    "createdAt": "2026-02-11T08:00:00.000Z",
    "updatedAt": "2026-02-11T08:00:00.000Z"
  }
}
```

#### Succès (Collection)
```json
{
  "data": [
    { "id": "uuid1", "..." },
    { "id": "uuid2", "..." }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 42,
    "totalPages": 5
  }
}
```

#### Erreur
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "email must be a valid email"
    }
  ],
  "timestamp": "2026-02-11T08:00:00.000Z",
  "path": "/api/users"
}
```

### 4.3 Endpoints par Ressource

#### 4.3.1 Users

| Method | Endpoint | Description | Body | Response |
|--------|----------|-------------|------|----------|
| GET | `/api/users` | Liste tous les users | - | 200 + List |
| GET | `/api/users/:id` | Récupère un user | - | 200 + User |
| POST | `/api/users` | Crée un user | CreateUserDto | 201 + User |
| PATCH | `/api/users/:id` | Modifie un user | UpdateUserDto | 200 + User |
| DELETE | `/api/users/:id` | Supprime un user | - | 204 |

**CreateUserDto**:
```typescript
{
  firstName: string;      // @IsString(), @MinLength(2)
  lastName: string;       // @IsString(), @MinLength(2)
  email: string;          // @IsEmail()
  role?: UserRole;        // @IsEnum(UserRole), @IsOptional()
}
```

**Query Params (GET /users)**:
- `page`: number (default: 1)
- `limit`: number (default: 10, max: 100)
- `role`: UserRole
- `search`: string (firstName, lastName, email)

#### 4.3.2 ExpenseReports

| Method | Endpoint | Description | Body | Response |
|--------|----------|-------------|------|----------|
| GET | `/api/expense-reports` | Liste les reports | - | 200 + List |
| GET | `/api/expense-reports/:id` | Récupère un report | - | 200 + Report |
| POST | `/api/expense-reports` | Crée un report | CreateDto | 201 + Report |
| PATCH | `/api/expense-reports/:id` | Modifie un report | UpdateDto | 200 + Report |
| DELETE | `/api/expense-reports/:id` | Supprime un report | - | 204 |
| PATCH | `/api/expense-reports/:id/submit` | Soumet un report | - | 200 + Report |
| PATCH | `/api/expense-reports/:id/validate` | Valide (V2) | - | 200 + Report |
| PATCH | `/api/expense-reports/:id/reject` | Rejette (V2) | - | 200 + Report |
| PATCH | `/api/expense-reports/:id/pay` | Marque payé | - | 200 + Report |
| GET | `/api/expense-reports/:id/expenses` | Liste expenses | - | 200 + List |

**CreateExpenseReportDto**:
```typescript
{
  purpose: string;        // @IsString(), @MinLength(5)
  reportDate: Date;       // @IsDateString()
  userId: string;         // @IsUUID()
}
```

**Query Params (GET /expense-reports)**:
- `page`, `limit`
- `userId`: uuid
- `status`: ReportStatus
- `dateFrom`: date (reportDate >=)
- `dateTo`: date (reportDate <=)
- `sortBy`: 'reportDate' | 'totalAmount' | 'createdAt'
- `order`: 'ASC' | 'DESC'

#### 4.3.3 Expenses

| Method | Endpoint | Description | Body | Response |
|--------|----------|-------------|------|----------|
| GET | `/api/expenses` | Liste expenses | - | 200 + List |
| GET | `/api/expenses/:id` | Récupère expense | - | 200 + Expense |
| POST | `/api/expenses` | Crée expense | CreateDto | 201 + Expense |
| PATCH | `/api/expenses/:id` | Modifie expense | UpdateDto | 200 + Expense |
| DELETE | `/api/expenses/:id` | Supprime expense | - | 204 |

**CreateExpenseDto**:
```typescript
{
  reportId: string;       // @IsUUID()
  category: ExpenseCategory; // @IsEnum(ExpenseCategory)
  expenseName?: string;   // @IsString(), @IsOptional()
  description?: string;   // @IsString(), @IsOptional()
  amount: number;         // @IsNumber(), @Min(0.01)
  expenseDate: Date;      // @IsDateString()
}
```

**Règles métier**:
- Création → recalcul automatique `totalAmount` du report
- Modification → recalcul automatique `totalAmount`
- Suppression → recalcul automatique `totalAmount`
- Modification/suppression autorisée si report parent modifiable

#### 4.3.4 Attachments

| Method | Endpoint | Description | Body | Response |
|--------|----------|-------------|------|----------|
| GET | `/api/attachments/:id` | Récupère metadata | - | 200 + Attachment |
| GET | `/api/attachments/:id/download` | Télécharge fichier | - | 200 + file |
| POST | `/api/expenses/:expenseId/attachments` | Upload fichier | multipart | 201 + Attachment |
| DELETE | `/api/attachments/:id` | Supprime attachment | - | 204 |
| GET | `/api/expenses/:expenseId/attachments` | Liste attachments | - | 200 + List |

**Upload Request**:
```
Content-Type: multipart/form-data
file: <binary>
```

**Limites**:
- Taille max: 5MB
- Types autorisés: image/jpeg, image/png, application/pdf

### 4.4 Codes HTTP

| Code | Signification | Exemples |
|------|---------------|----------|
| 200 | OK | GET, PATCH réussi |
| 201 | Created | POST réussi |
| 204 | No Content | DELETE réussi |
| 400 | Bad Request | Validation échouée, règle métier violée |
| 404 | Not Found | Ressource inexistante |
| 409 | Conflict | Email existant, transition invalide |
| 413 | Payload Too Large | Fichier trop volumineux |
| 500 | Internal Server Error | Erreur serveur |

---

## 5. Stratégie Fichiers (Upload)

### 5.1 Stockage Local

**Répertoire**: `backend/uploads/`

**Structure**:
```
uploads/
├── <expenseId>/
│   ├── <uuid>.pdf
│   ├── <uuid>.jpg
│   └── ...
└── .gitkeep
```

**Convention de nommage**: `<uuid>.<extension>`

**Avantages**:
- Simple à implémenter
- Pas de dépendance externe
- Facile à tester
- Migration cloud facilitée

### 5.2 Métadonnées en Base

**Stockées dans `attachments` table**:
- `fileName`: Nom original (sanitisé)
- `filePath`: Chemin relatif (`uploads/...`)
- `mimeType`: Type MIME
- `size`: Taille en bytes

### 5.3 Stratégie de Suppression

1. **Suppression Attachment**: Supprime DB + fichier physique
2. **Suppression Expense** (cascade): Supprime attachments + fichiers
3. **Suppression ExpenseReport** (cascade): Supprime répertoire complet

**Implémentation**:
```typescript
async deleteFile(filePath: string): Promise<void> {
  try {
    await fs.promises.unlink(filePath);
  } catch (error) {
    Logger.warn(`Failed to delete file: ${error.message}`);
  }
}
```

### 5.4 Validation

**Configuration** (`.env`):
```env
MAX_FILE_SIZE=5242880  # 5MB
ALLOWED_MIME_TYPES=image/jpeg,image/png,application/pdf
```

**Validation**:
1. Taille: NestJS FileInterceptor
2. Type MIME: Validation service layer
3. Nom fichier: Sanitisation

### 5.5 Migration Future (V2)

**Vers Cloud Storage (S3, Azure Blob)**:
- Interface `IFileStorage`
- Implémentation `LocalFileStorage` (V1)
- Implémentation `S3FileStorage` (V2)
- Factory pattern pour instanciation

## 7. Stratégie de Tests & Couverture

### 7.1 Objectif de Couverture

**Target**: **≥85% coverage** (lines, branches, functions, statements)

**Configuration Jest**:
```javascript
// jest.config.js
module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: [
    '**/*.(t|j)s',
    '!**/*.spec.ts',
    '!**/*.module.ts',
    '!**/main.ts',
    '!**/index.ts',
  ],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  coverageThreshold: {
    global: {
      lines: 85,
      branches: 85,
      functions: 85,
      statements: 85,
    },
  },
};
```

### 7.2 Types de Tests

#### 7.2.1 Tests Unitaires (Services)

**Objectif**: Tester la logique métier isolément

**Stratégie de Mocking**:
- Mock des repositories TypeORM
- Mock des services dépendants
- Mock du filesystem

**Exemple - ExpenseReportsService**:
```typescript
describe('ExpenseReportsService', () => {
  let service: ExpenseReportsService;
  let repository: MockType<Repository<ExpenseReport>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExpenseReportsService,
        {
          provide: getRepositoryToken(ExpenseReport),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();

    service = module.get<ExpenseReportsService>(ExpenseReportsService);
    repository = module.get(getRepositoryToken(ExpenseReport));
  });

  describe('create', () => {
    it('should create report with CREATED status and totalAmount 0', async () => {
      const createDto = {
        purpose: 'Business trip',
        reportDate: new Date('2026-02-15'),
        userId: 'user-uuid',
      };

      repository.create.mockReturnValue({ ...createDto, id: 'uuid', status: ReportStatus.CREATED });
      repository.save.mockResolvedValue({ ...createDto, id: 'uuid', status: ReportStatus.CREATED });

      const result = await service.create(createDto);

      expect(result.status).toBe(ReportStatus.CREATED);
      expect(result.totalAmount).toBe(0);
    });
  });

  describe('submitReport', () => {
    it('should transition from CREATED to SUBMITTED', async () => {
      const report = { id: 'uuid', status: ReportStatus.CREATED };
      repository.findOne.mockResolvedValue(report);
      repository.save.mockResolvedValue({ ...report, status: ReportStatus.SUBMITTED });

      const result = await service.submitReport('uuid');

      expect(result.status).toBe(ReportStatus.SUBMITTED);
    });

    it('should throw error if transition invalid', async () => {
      const report = { id: 'uuid', status: ReportStatus.PAID };
      repository.findOne.mockResolvedValue(report);

      await expect(service.submitReport('uuid')).rejects.toThrow(BadRequestException);
    });
  });

  describe('recalculateTotalAmount', () => {
    it('should sum all expense amounts', async () => {
      const expenses = [
        { amount: 100 },
        { amount: 50.5 },
        { amount: 25.25 },
      ];
      
      expensesService.findByReportId.mockResolvedValue(expenses);
      repository.update.mockResolvedValue({});

      await service.recalculateTotalAmount('report-uuid');

      expect(repository.update).toHaveBeenCalledWith('report-uuid', { totalAmount: 175.75 });
    });
  });
});
```

**Couverture attendue**:
- ✅ Création avec valeurs par défaut
- ✅ Transitions de statuts valides
- ✅ Transitions de statuts invalides (erreurs)
- ✅ Calcul du totalAmount
- ✅ Règles de modification selon statut
- ✅ Gestion des erreurs (not found, conflict)

#### 7.2.2 Tests Unitaires (Controllers)

**Objectif**: Tester routes HTTP, validation DTOs, codes HTTP

**Exemple**:
```typescript
describe('ExpenseReportsController', () => {
  let controller: ExpenseReportsController;
  let service: MockType<ExpenseReportsService>;

  describe('create', () => {
    it('should return 201 with created report', async () => {
      const createDto = {
        purpose: 'Business trip',
        reportDate: new Date('2026-02-15'),
        userId: 'user-uuid',
      };

      const expectedResult = { id: 'uuid', ...createDto, status: ReportStatus.CREATED };
      service.create.mockResolvedValue(expectedResult);

      const result = await controller.create(createDto);

      expect(result).toEqual(expectedResult);
      expect(service.create).toHaveBeenCalledWith(createDto);
    });
  });
});
```

#### 7.2.3 Tests des Helpers

**Exemple - ReportStatusHelper**:
```typescript
describe('ReportStatusHelper', () => {
  describe('canModify', () => {
    it('should return true for CREATED status', () => {
      expect(ReportStatusHelper.canModify(ReportStatus.CREATED)).toBe(true);
    });

    it('should return false for VALIDATED status', () => {
      expect(ReportStatusHelper.canModify(ReportStatus.VALIDATED)).toBe(false);
    });
  });

  describe('canTransitionTo', () => {
    it('should allow CREATED -> SUBMITTED', () => {
      expect(ReportStatusHelper.canTransitionTo(ReportStatus.CREATED, ReportStatus.SUBMITTED)).toBe(true);
    });

    it('should not allow CREATED -> PAID', () => {
      expect(ReportStatusHelper.canTransitionTo(ReportStatus.CREATED, ReportStatus.PAID)).toBe(false);
    });

    it('should not allow PAID -> any status', () => {
      expect(ReportStatusHelper.canTransitionTo(ReportStatus.PAID, ReportStatus.CREATED)).toBe(false);
    });
  });
});
```

#### 7.2.4 Tests Upload de Fichiers

**Stratégie**:
- Mock du filesystem
- Mock de Multer file object
- Tester validation (taille, type MIME)

**Exemple**:
```typescript
describe('AttachmentsService', () => {
  describe('uploadAttachment', () => {
    it('should upload file and create attachment record', async () => {
      const mockFile: Express.Multer.File = {
        originalname: 'receipt.pdf',
        mimetype: 'application/pdf',
        size: 1024,
        buffer: Buffer.from('fake-content'),
      };

      const result = await service.uploadAttachment('expense-uuid', mockFile);

      expect(result.fileName).toBe('receipt.pdf');
      expect(result.mimeType).toBe('application/pdf');
      expect(result.size).toBe(1024);
    });

    it('should throw error if file type not allowed', async () => {
      const mockFile: Express.Multer.File = {
        originalname: 'malware.exe',
        mimetype: 'application/x-msdownload',
        size: 1024,
        buffer: Buffer.from('fake-content'),
      };

      await expect(service.uploadAttachment('expense-uuid', mockFile))
        .rejects.toThrow(BadRequestException);
    });

    it('should throw error if file too large', async () => {
      const mockFile: Express.Multer.File = {
        originalname: 'large.pdf',
        mimetype: 'application/pdf',
        size: 10 * 1024 * 1024, // 10MB
        buffer: Buffer.from('fake-content'),
      };

      await expect(service.uploadAttachment('expense-uuid', mockFile))
        .rejects.toThrow(BadRequestException);
    });
  });
});
```

### 7.3 Organisation des Tests

**Structure**: Tests colocalisés avec le code source

```
backend/src/
├── users/
│   ├── users.service.ts
│   ├── users.service.spec.ts       # Colocated
│   ├── users.controller.ts
│   └── users.controller.spec.ts    # Colocated
```

**Naming**: `<file>.spec.ts`

### 7.4 Scripts NPM

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage",
    "test:debug": "node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand"
  }
}
```

### 7.5 Métriques de Couverture par Module

| Module | Target Coverage | Justification |
|--------|----------------|---------------|
| Users | ≥85% | CRUD standard |
| ExpenseReports | ≥90% | Logique métier critique (calcul totaux, transitions) |
| Expenses | ≥90% | Logique métier critique |
| Attachments | ≥85% | Dépendance filesystem |
| Common (Helpers) | ≥95% | Logique pure, facile à tester |

---

## 8. Plan de Travail (Roadmap)

### 8.1 Vue d'Ensemble

**Durée estimée**: 10-12 jours (1 développeur)

**Approche**: Développement itératif par module, avec tests à chaque étape

### 8.2 Phase 1: Bootstrap & Configuration

**Durée**: 1 jour

**Livrables**:
- ✅ Projet NestJS initialisé
- ✅ Configuration TypeORM + SQLite
- ✅ Configuration Swagger
- ✅ Variables d'environnement
- ✅ Scripts npm configurés

**Tâches**:
1. Initialiser projet: `nest new backend`
2. Installer dépendances:
   ```bash
   npm install @nestjs/typeorm typeorm sqlite3
   npm install @nestjs/swagger
   npm install @nestjs/config
   npm install class-validator class-transformer
   ```
3. Configurer `database.config.ts`
4. Configurer Swagger dans `main.ts`
5. Créer `.env.example`
6. Configurer `jest.config.js` avec coverage thresholds
7. Créer répertoires `uploads/` et `data/`
8. Configurer `.gitignore`

**Critères d'acceptation**:
- ✅ `npm run dev` démarre l'application
- ✅ Swagger accessible sur `/docs`
- ✅ Base SQLite créée dans `data/`
- ✅ `npm run test` exécute Jest
- ✅ Variables d'environnement chargées

### 8.3 Phase 2: Common Module & Infrastructure

**Durée**: 1 jour

**Livrables**:
- ✅ CommonModule avec enums, DTOs, guards, interceptors, filters
- ✅ FakeAuthGuard implémenté
- ✅ TransformInterceptor
- ✅ HttpExceptionFilter
- ✅ PaginationDto, ErrorResponseDto

**Tâches**:
1. Créer `common/common.module.ts`
2. Créer enums:
   - `user-role.enum.ts`
   - `report-status.enum.ts`
   - `expense-status.enum.ts`
   - `expense-category.enum.ts`
3. Créer `guards/fake-auth.guard.ts` (return true)
4. Créer `interceptors/transform.interceptor.ts`
5. Créer `filters/http-exception.filter.ts`
6. Créer `dto/pagination.dto.ts`
7. Créer `dto/error-response.dto.ts`
8. Appliquer guard et interceptor globalement dans `main.ts`

**Critères d'acceptation**:
- ✅ FakeAuthGuard appliqué globalement
- ✅ Toutes les réponses au format `{ data, meta? }`
- ✅ Toutes les erreurs au format standardisé
- ✅ Enums exportés et utilisables

### 8.4 Phase 3: Users Module

**Durée**: 1 jour

**Livrables**:
- ✅ UsersModule complet (CRUD)
- ✅ User entity avec relations
- ✅ DTOs (Create, Update, Response)
- ✅ Tests unitaires (≥85% coverage)

**Tâches**:
1. Générer module: `nest g module users`
2. Générer service: `nest g service users`
3. Générer controller: `nest g controller users`
4. Créer `entities/user.entity.ts`
5. Créer DTOs (Create, Update, Response)
6. Implémenter CRUD dans service
7. Implémenter routes dans controller
8. Ajouter decorators Swagger
9. Écrire tests (service + controller)

**Critères d'acceptation**:
- ✅ CRUD complet fonctionnel
- ✅ Email unique validé
- ✅ Swagger docs complètes
- ✅ Tests ≥85% coverage
- ✅ Validation DTOs fonctionnelle

### 8.5 Phase 4: ExpenseReports Module

**Durée**: 2 jours

**Livrables**:
- ✅ ExpenseReportsModule complet
- ✅ ExpenseReport entity avec relations
- ✅ DTOs complets
- ✅ ReportStatusHelper avec règles métier
- ✅ Endpoints de transition de statuts
- ✅ Calcul automatique totalAmount
- ✅ Tests unitaires (≥90% coverage)

**Tâches**:
1. Générer module, service, controller
2. Créer `entities/expense-report.entity.ts`
3. Créer DTOs (Create, Update, Response, List)
4. Créer `helpers/report-status.helper.ts`
5. Implémenter CRUD + règles de modification
6. Implémenter endpoints de transition:
   - `PATCH /expense-reports/:id/submit`
   - `PATCH /expense-reports/:id/pay`
7. Implémenter `recalculateTotalAmount()`
8. Implémenter pagination et filtres
9. Ajouter decorators Swagger
10. Écrire tests (service + controller + helper)

**Critères d'acceptation**:
- ✅ CRUD complet avec règles métier
- ✅ Transitions de statuts fonctionnelles
- ✅ totalAmount calculé automatiquement
- ✅ Pagination fonctionnelle
- ✅ Filtres (userId, status, dates) fonctionnels
- ✅ Tests ≥90% coverage
- ✅ Swagger docs complètes

### 8.6 Phase 5: Expenses Module

**Durée**: 2 jours

**Livrables**:
- ✅ ExpensesModule complet
- ✅ Expense entity avec relations
- ✅ DTOs complets
- ✅ ExpenseStatusHelper
- ✅ Intégration avec ExpenseReports (recalcul totalAmount)
- ✅ Tests unitaires (≥90% coverage)

**Tâches**:
1. Générer module, service, controller
2. Créer `entities/expense.entity.ts`
3. Créer DTOs (Create, Update, Response, List)
4. Créer `helpers/expense-status.helper.ts`
5. Implémenter CRUD avec validation du report parent
6. Implémenter trigger de recalcul totalAmount:
   - Après create
   - Après update (si amount modifié)
   - Après delete
7. Implémenter pagination et filtres
8. Ajouter decorators Swagger
9. Écrire tests (service + controller + helper)

**Critères d'acceptation**:
- ✅ CRUD complet avec validation report parent
- ✅ Recalcul totalAmount automatique
- ✅ Règles de modification respectées
- ✅ Pagination et filtres fonctionnels
- ✅ Tests ≥90% coverage
- ✅ Swagger docs complètes

### 8.7 Phase 6: Attachments Module

**Durée**: 2 jours

**Livrables**:
- ✅ AttachmentsModule complet
- ✅ Attachment entity
- ✅ DTOs (Response, Upload)
- ✅ FileStorageHelper
- ✅ Upload/download/delete fonctionnels
- ✅ Tests unitaires (≥85% coverage)

**Tâches**:
1. Générer module, service, controller
2. Créer `entities/attachment.entity.ts`
3. Créer DTOs (Response, Upload)
4. Créer `helpers/file-storage.helper.ts`
5. Implémenter upload:
   - Validation taille et type MIME
   - Sanitisation nom fichier
   - Stockage filesystem
   - Création enregistrement DB
6. Implémenter download (file stream)
7. Implémenter delete (DB + filesystem)
8. Implémenter liste par expense
9. Ajouter decorators Swagger
10. Écrire tests (service + controller + helper)

**Critères d'acceptation**:
- ✅ Upload fonctionnel avec validation
- ✅ Download fonctionnel (stream)
- ✅ Delete fonctionnel (DB + fichier)
- ✅ Limites (taille, type) respectées
- ✅ Tests ≥85% coverage
- ✅ Swagger docs complètes

### 8.8 Phase 7: Tests & Coverage

**Durée**: 2 jours

**Livrables**:
- ✅ Coverage ≥85% sur tous les modules
- ✅ Tests d'intégration (optionnel)
- ✅ Rapport de coverage

**Tâches**:
1. Exécuter `npm run test:cov`
2. Identifier les zones non couvertes
3. Ajouter tests manquants:
   - Edge cases
   - Error handling
   - Business rules
4. Atteindre threshold 85%
5. Générer rapport HTML
6. Documenter les tests

**Critères d'acceptation**:
- ✅ Coverage global ≥85%
- ✅ Tous les modules ≥85%
- ✅ Rapport de coverage généré
- ✅ Pas de tests flaky

### 8.9 Phase 8: Documentation & Vérifications

**Durée**: 1 jour

**Livrables**:
- ✅ README.md complet
- ✅ Swagger docs finalisées
- ✅ Scripts npm documentés
- ✅ Vérifications finales

**Tâches**:
1. Rédiger README.md:
   - Installation
   - Configuration
   - Lancement
   - Tests
   - API endpoints
2. Vérifier Swagger docs:
   - Tous les endpoints documentés
   - Exemples de requêtes/réponses
   - Codes HTTP documentés
3. Vérifier scripts npm
4. Tester build production: `npm run build`
5. Tester démarrage production: `npm run start:prod`
6. Vérifier .gitignore
7. Créer .env.example complet

**Critères d'acceptation**:
- ✅ README.md complet et clair
- ✅ Swagger docs complètes
- ✅ Build production réussi
- ✅ Tous les tests passent
- ✅ Coverage ≥85%
- ✅ Pas de secrets dans le code

### 8.10 Récapitulatif des Phases

| Phase | Durée | Livrables Clés | Tests |
|-------|-------|----------------|-------|
| 1. Bootstrap | 1j | Config NestJS, TypeORM, Swagger | - |
| 2. Common | 1j | Enums, Guards, Interceptors, Filters | - |
| 3. Users | 1j | CRUD Users | ≥85% |
| 4. ExpenseReports | 2j | CRUD Reports + Transitions + Calcul | ≥90% |
| 5. Expenses | 2j | CRUD Expenses + Recalcul | ≥90% |
| 6. Attachments | 2j | Upload/Download/Delete | ≥85% |
| 7. Tests | 2j | Coverage global ≥85% | ✅ |
| 8. Documentation | 1j | README, Swagger, Vérifications | ✅ |
| **TOTAL** | **12j** | **API complète fonctionnelle** | **≥85%** |

---

## 9. Points à Confirmer

### 9.1 Choix par Défaut Proposés

Les choix suivants sont proposés par défaut, mais peuvent être ajustés selon les besoins:

#### 1. Stratégie de Synchronisation TypeORM

**Choix par défaut**: `synchronize: true` en développement

**Alternatives**:
- Migrations TypeORM dès le début
- Synchronize en dev, migrations en prod

**Recommandation**: Utiliser `synchronize: true` en V1 pour rapidité, prévoir migrations pour V2.

#### 2. Pagination par Défaut

**Choix par défaut**: `page=1, limit=10, max=100`

**Alternatives**:
- Limit 20 ou 50
- Pas de limite max
- Cursor-based pagination

**Recommandation**: Garder limit=10 pour performances, max=100 pour éviter surcharge.

#### 3. Format de Date

**Choix par défaut**: ISO 8601 (`2026-02-11T08:00:00.000Z`)

**Alternatives**:
- Date only (`2026-02-11`)
- Timestamp Unix

**Recommandation**: ISO 8601 pour interopérabilité et timezone support.

#### 4. Gestion des Erreurs de Suppression de Fichiers

**Choix par défaut**: Log warning, ne pas throw

**Alternatives**:
- Throw exception
- Retry mechanism

**Recommandation**: Log warning pour éviter blocage si fichier déjà supprimé.

#### 5. Stratégie de Validation des Fichiers

**Choix par défaut**: Validation MIME type + extension

**Alternatives**:
- Validation extension uniquement
- Validation magic bytes (file-type library)

**Recommandation**: MIME type + extension pour V1, magic bytes pour V2 (sécurité renforcée).

### 9.2 Questions Ouvertes

#### 1. Gestion des Doublons d'Email

**Question**: Que faire si un utilisateur tente de créer un compte avec un email existant?

**Options**:
- A) Retourner 409 Conflict avec message explicite ✅ (recommandé)
- B) Retourner 400 Bad Request
- C) Merger les comptes

**Recommandation**: Option A - 409 Conflict

#### 2. Suppression en Cascade vs Soft Delete

**Question**: Faut-il implémenter le soft delete (marquage deleted au lieu de suppression)?

**Options**:
- A) Hard delete avec cascade ✅ (recommandé V1)
- B) Soft delete avec `deletedAt` timestamp (V2)

**Recommandation**: Hard delete en V1, soft delete en V2 pour audit trail.

#### 3. Validation des Dates

**Question**: Faut-il valider que `expenseDate` n'est pas dans le futur?

**Options**:
- A) Oui, interdire dates futures ✅ (recommandé)
- B) Non, autoriser (pour planification)

**Recommandation**: Interdire dates futures en V1 (notes de frais = dépenses passées).

#### 4. Limite de Taille des Reports

**Question**: Faut-il limiter le nombre d'expenses par report?

**Options**:
- A) Pas de limite ✅ (recommandé V1)
- B) Limite (ex: 50 expenses max)

**Recommandation**: Pas de limite en V1, ajouter si problème de performance.

#### 5. Gestion des Devises

**Question**: Faut-il gérer plusieurs devises?

**Options**:
- A) Non, montants en EUR uniquement ✅ (recommandé V1)
- B) Oui, ajouter champ `currency`

**Recommandation**: EUR uniquement en V1, multi-devises en V2.

---

## 10. Conclusion

Ce document d'architecture fournit une base solide pour l'implémentation de l'API de gestion de notes de frais. Les choix architecturaux privilégient:

- **Simplicité**: Solutions simples et éprouvées (SQLite, stockage local)
- **Évolutivité**: Structure préparée pour V2 (JWT, rôles, cloud storage)
- **Qualité**: Tests ≥85%, validation stricte, documentation complète
- **Maintenabilité**: Code modulaire, séparation des responsabilités

**Prochaines étapes**:
1. Validation de cette architecture
2. Ajustements selon feedback
3. Passage en mode Code pour implémentation

---

**Document rédigé par**: Senior Backend Architect
**Date**: 2026-02-11
**Version**: 1.0

## 6. Règles Statuts & Transitions

### 6.1 Enums de Statuts

#### ReportStatus
```typescript
export enum ReportStatus {
  CREATED = 'CREATED',       // Brouillon
  SUBMITTED = 'SUBMITTED',   // Soumis
  VALIDATED = 'VALIDATED',   // Validé (V2)
  REJECTED = 'REJECTED',     // Rejeté (V2)
  PAID = 'PAID',             // Payé
}
```

#### ExpenseStatus
```typescript
export enum ExpenseStatus {
  CREATED = 'CREATED',
  SUBMITTED = 'SUBMITTED',
  VALIDATED = 'VALIDATED',
  REJECTED = 'REJECTED',
  PAID = 'PAID',
}
```

#### ExpenseCategory
```typescript
export enum ExpenseCategory {
  TRAVEL = 'TRAVEL',                 // Déplacements
  MEALS = 'MEALS',                   // Repas
  ACCOMMODATION = 'ACCOMMODATION',   // Hébergement
  TRANSPORT = 'TRANSPORT',           // Transport local
  OFFICE_SUPPLIES = 'OFFICE_SUPPLIES', // Fournitures
  COMMUNICATION = 'COMMUNICATION',   // Téléphone, internet
  OTHER = 'OTHER',                   // Autres
}
```

### 6.2 Diagramme de Transitions

```
CREATED ──submit()──> SUBMITTED ──validate()──> VALIDATED ──pay()──> PAID
                          │                                            
                          └──reject()──> REJECTED ──reopen()──> CREATED
                          │
                          └──pay()──> PAID (V1 shortcut)
```

### 6.3 Tableau des Transitions

| État Actuel | Action | État Suivant | V1/V2 |
|-------------|--------|--------------|-------|
| CREATED | submit | SUBMITTED | V1 |
| SUBMITTED | validate | VALIDATED | V2 |
| SUBMITTED | reject | REJECTED | V2 |
| SUBMITTED | pay | PAID | V1 |
| VALIDATED | pay | PAID | V1 |
| REJECTED | reopen | CREATED | V2 |

### 6.4 Règles de Modification

#### ExpenseReport

| Statut | Modification | Suppression | Ajout Expense |
|--------|--------------|-------------|---------------|
| CREATED | ✅ Oui | ✅ Oui | ✅ Oui |
| SUBMITTED | ✅ Oui | ❌ Non | ✅ Oui |
| VALIDATED | ❌ Non | ❌ Non | ❌ Non |
| REJECTED | ❌ Non | ❌ Non | ❌ Non |
| PAID | ❌ Non | ❌ Non | ❌ Non |

#### Expense

Modifiable si report parent est modifiable (CREATED ou SUBMITTED).

### 6.5 Positionnement des Règles

**Choix recommandé**: **Service Layer + Helper**

**Implémentation**:
```typescript
// helpers/report-status.helper.ts
export class ReportStatusHelper {
  static canModify(status: ReportStatus): boolean {
    return [ReportStatus.CREATED, ReportStatus.SUBMITTED].includes(status);
  }

  static canDelete(status: ReportStatus): boolean {
    return status === ReportStatus.CREATED;
  }

  static canTransitionTo(from: ReportStatus, to: ReportStatus): boolean {
    const transitions: Record<ReportStatus, ReportStatus[]> = {
      [ReportStatus.CREATED]: [ReportStatus.SUBMITTED],
      [ReportStatus.SUBMITTED]: [ReportStatus.VALIDATED, ReportStatus.REJECTED, ReportStatus.PAID],
      [ReportStatus.VALIDATED]: [ReportStatus.PAID],
      [ReportStatus.REJECTED]: [ReportStatus.CREATED],
      [ReportStatus.PAID]: [],
    };
    return transitions[from]?.includes(to) ?? false;
  }
}
```

### 6.6 Calcul Automatique du totalAmount

**Règle**: `totalAmount` = somme des `amount` de toutes les Expenses

**Déclencheurs**:
- Création Expense
- Modification `amount` Expense
- Suppression Expense

**Implémentation**:
```typescript
async recalculateTotalAmount(reportId: string): Promise<void> {
  const expenses = await this.expenseRepository.find({ where: { reportId } });
  const totalAmount = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
  await this.expenseReportRepository.update(reportId, { totalAmount });
}
```

---