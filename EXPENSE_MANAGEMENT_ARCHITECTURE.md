# Architecture Plan: API Gestion de Notes de Frais (NestJS + TypeORM + SQLite)

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

#### 2.2.1 Controllers
- **Rôle**: Gestion des requêtes HTTP, validation des inputs, appel des services
- **Responsabilités**:
  - Définir les routes REST
  - Appliquer les decorators Swagger
  - Appliquer les Guards (FakeAuthGuard)
  - Transformer les réponses (DTOs)
  - Gérer les codes HTTP
- **Ne fait PAS**: Logique métier, accès direct aux repositories

#### 2.2.2 Services
- **Rôle**: Logique métier, orchestration, transactions
- **Responsabilités**:
  - Implémenter les règles métier
  - Orchestrer les appels aux repositories
  - Gérer les transactions TypeORM
  - Calculer les totaux (totalAmount)
  - Valider les transitions de statuts
  - Appeler d'autres services si nécessaire
- **Ne fait PAS**: Manipulation HTTP directe, validation des DTOs (fait par pipes)

#### 2.2.3 Repositories (TypeORM)
- **Rôle**: Accès aux données, requêtes SQL
- **Responsabilités**:
  - CRUD operations
  - Requêtes complexes (findOne, findMany avec relations)
  - Gestion des relations (eager/lazy loading)
- **Pattern**: Injection via `@InjectRepository(Entity)`

#### 2.2.4 Entities
- **Rôle**: Modèle de données, mapping ORM
- **Responsabilités**:
  - Définir le schéma de la table
  - Définir les relations
  - Définir les contraintes (unique, nullable, etc.)
  - Hooks TypeORM (@BeforeInsert, @BeforeUpdate)

#### 2.2.5 DTOs
- **Rôle**: Contrats d'API, validation, transformation
- **Types**:
  - **CreateDto**: Payload pour création (POST)
  - **UpdateDto**: Payload pour modification (PATCH/PUT)
  - **ResponseDto**: Format de réponse (GET)
  - **ListDto**: Format pour listes paginées
- **Validation**: Decorators class-validator (`@IsString()`, `@IsEnum()`, etc.)
- **Documentation**: Decorators Swagger (`@ApiProperty()`)

#### 2.2.6 Guards
- **FakeAuthGuard** (V1):
  - Appliqué globalement ou par route
  - Retourne toujours `true`
  - Structure préparée pour V2 (JWT validation)
- **Future Guards** (V2):
  - JwtAuthGuard
  - RolesGuard (EMPLOYEE vs MANAGER)

#### 2.2.7 Interceptors
- **TransformInterceptor**: Standardise les réponses (format `{ data, meta }`)
- **LoggingInterceptor**: Log requêtes/réponses pour debugging

#### 2.2.8 Filters
- **HttpExceptionFilter**: Capture toutes les exceptions, retourne format standardisé

### 2.3 Conventions de Nommage

#### 2.3.1 Fichiers
```
<entity>.<type>.ts

Exemples:
- user.entity.ts
- create-user.dto.ts
- users.service.ts
- users.controller.ts
- users.service.spec.ts
```

#### 2.3.2 Classes
```
<Entity><Type>

Exemples:
- User (entity)
- CreateUserDto
- UsersService
- UsersController
```

#### 2.3.3 Routes
```
/api/<resource>/<id?>/<sub-resource?>

Exemples:
- GET    /api/users
- POST   /api/users
- GET    /api/users/:id
- PATCH  /api/users/:id
- GET    /api/expense-reports
- POST   /api/expense-reports
- GET    /api/expense-reports/:id
- GET    /api/expense-reports/:id/expenses
- POST   /api/expenses
- POST   /api/expenses/:id/attachments
```

**Prefix global**: `/api` (configuré dans `main.ts`)

#### 2.3.4 Variables & Méthodes
- **camelCase**: `totalAmount`, `findAllReports()`
- **PascalCase**: Classes, Interfaces, Enums
- **SCREAMING_SNAKE_CASE**: Enum values (`ExpenseCategory.OFFICE_SUPPLIES`)

### 2.4 Stratégie de Configuration

#### 2.4.1 Variables d'Environnement

**Fichier**: `backend/.env` (gitignored)  
**Template**: `backend/.env.example`

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
MAX_FILE_SIZE=5242880  # 5MB in bytes
ALLOWED_MIME_TYPES=image/jpeg,image/png,application/pdf

# Future (V2)
JWT_SECRET=your-secret-key
JWT_EXPIRATION=1h
```

#### 2.4.2 ConfigModule

**Utilisation**: `@nestjs/config`

```typescript
// app.module.ts
ConfigModule.forRoot({
  isGlobal: true,
  envFilePath: '.env',
  validationSchema: Joi.object({
    NODE_ENV: Joi.string().valid('development', 'production', 'test'),
    PORT: Joi.number().default(3000),
    DB_DATABASE: Joi.string().required(),
    // ...
  }),
})
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
- Suppression d'un User → supprime ses ExpenseReports
- Suppression d'un ExpenseReport → supprime ses Expenses
- Suppression d'un Expense → supprime ses Attachments (+ fichiers physiques)

**Justification LAZY**:
- Évite les requêtes N+1
- Chargement explicite via `relations: ['expenses']` dans les queries
- Meilleure performance

### 3.3 Contraintes & Indices

#### 3.3.1 User Entity
```typescript
@Entity('users')
@Index(['email'], { unique: true })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ type: 'varchar', default: UserRole.EMPLOYEE })
  role: UserRole;

  @Column({ type: 'uuid', nullable: true })
  managerId: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => ExpenseReport, report => report.user)
  expenseReports: ExpenseReport[];
}
```

**Contraintes**:
- `email` UNIQUE (index)
- `role` NOT NULL, default EMPLOYEE
- `managerId` nullable (V2)

#### 3.3.2 ExpenseReport Entity
```typescript
@Entity('expense_reports')
@Index(['userId'])
@Index(['status'])
@Index(['reportDate'])
export class ExpenseReport {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  purpose: string;

  @Column({ type: 'date' })
  reportDate: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalAmount: number;

  @Column({ type: 'varchar' })
  status: ReportStatus;

  @Column({ type: 'date', nullable: true })
  paymentDate: Date | null;

  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, user => user.expenseReports, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => Expense, expense => expense.report, { cascade: true })
  expenses: Expense[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

**Contraintes**:
- `userId` NOT NULL, FK → users.id, ON DELETE CASCADE
- `status` NOT NULL
- `totalAmount` DECIMAL(10,2), default 0
- `paymentDate` nullable
- Index sur `userId`, `status`, `reportDate`

#### 3.3.3 Expense Entity
```typescript
@Entity('expenses')
@Index(['reportId'])
@Index(['status'])
@Index(['expenseDate'])
export class Expense {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  reportId: string;

  @Column({ type: 'varchar' })
  category: ExpenseCategory;

  @Column({ nullable: true })
  expenseName: string | null;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'date' })
  expenseDate: Date;

  @Column({ type: 'varchar' })
  status: ExpenseStatus;

  @ManyToOne(() => ExpenseReport, report => report.expenses, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'reportId' })
  report: ExpenseReport;

  @OneToMany(() => Attachment, attachment => attachment.expense, { cascade: true })
  attachments: Attachment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

#### 3.3.4 Attachment Entity
```typescript
@Entity('attachments')
@Index(['expenseId'])
export class Attachment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  expenseId: string;

  @Column()
  fileName: string;

  @Column()
  filePath: string;

  @Column()
  mimeType: string;

  @Column({ type: 'integer' })
  size: number;

  @ManyToOne(() => Expense, expense => expense.attachments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'expenseId' })
  expense: Expense;

  @CreateDateColumn()
  createdAt: Date;
}
```

### 3.4 Gestion des Enums en SQLite

**Problème**: SQLite ne supporte pas les ENUM natifs.

**Solution**: Stockage en VARCHAR + validation applicative

```typescript
// common/enums/user-role.enum.ts
export enum UserRole {
  EMPLOYEE = 'EMPLOYEE',
  // V2: MANAGER = 'MANAGER',
  // V2: ADMIN = 'ADMIN',
}

// Dans l'entity
@Column({ type: 'varchar' })
role: UserRole;
```

**Validation**:
- TypeORM: `type: 'varchar'`
- DTO: `@IsEnum(UserRole)`
- Database: Pas de contrainte CHECK (SQLite limitation)

### 3.5 Politique de Cascade

| Action | User | ExpenseReport | Expense | Attachment |
|--------|------|---------------|---------|------------|
| DELETE User | - | CASCADE | CASCADE | CASCADE |
| DELETE ExpenseReport | - | - | CASCADE | CASCADE |
| DELETE Expense | - | - | - | CASCADE + delete file |
| DELETE Attachment | - | - | - | delete file |

---

## 4. API Design (Swagger-First)

### 4.1 Principes de Design

- **RESTful**: Ressources, verbes HTTP standards
- **Pagination**: Query params `?page=1&limit=10`
- **Filtrage**: Query params `?status=SUBMITTED&userId=xxx`
- **Tri**: Query param `?sortBy=createdAt&order=DESC`
- **Codes HTTP**: 200, 201, 204, 400, 404, 409, 500
- **Format réponse**: JSON standardisé

### 4.2 Format de Réponse Standardisé

#### 4.2.1 Succès (Single Resource)
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

#### 4.2.2 Succès (Collection)
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

#### 4.2.3 Erreur
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

| Method | Endpoint | Description | Auth | Body | Response |
|--------|----------|-------------|------|------|----------|
| GET | `/api/users` | Liste tous les users | FakeAuth | - | 200 + UserListDto |
| GET | `/api/users/:id` | Récupère un user | FakeAuth | - | 200 + UserResponseDto |
| POST | `/api/users` | Crée un user | FakeAuth | CreateUserDto | 201 + UserResponseDto |
| PATCH | `/api/users/:id` | Modifie un user | FakeAuth | UpdateUserDto | 200 + UserResponseDto |
| DELETE | `/api/users/:id` | Supprime un user | FakeAuth | - | 204 |

**CreateUserDto**:
```typescript
{
  firstName: string;      // @IsString(), @MinLength(2)
  lastName: string;       // @IsString(), @MinLength(2)
  email: string;          // @IsEmail()
  role?: UserRole;        // @IsEnum(UserRole), @IsOptional(), default: EMPLOYEE
}
```

**UpdateUserDto**:
```typescript
{
  firstName?: string;     // @IsString(), @MinLength(2), @IsOptional()
  lastName?: string;      // @IsString(), @MinLength(2), @IsOptional()
  email?: string;         // @IsEmail(), @IsOptional()
}
```

#### 4.3.2 ExpenseReports

| Method | Endpoint | Description | Auth | Body | Response |
|--------|----------|-------------|------|------|----------|
| GET | `/api/expense-reports` | Liste les reports | FakeAuth | - | 200 + List |
| GET | `/api/expense-reports/:id` | Récupère un report | FakeAuth | - | 200 + ResponseDto |
| POST | `/api/expense-reports` | Crée un report | FakeAuth | CreateDto | 201 + ResponseDto |
| PATCH | `/api/expense-reports/:id` | Modifie un report | FakeAuth | UpdateDto | 200 + ResponseDto |
| DELETE | `/api/expense-reports/:id` | Supprime un report | FakeAuth | - | 204 |
| PATCH | `/api/expense-reports/:id/submit` | Soumet un report | FakeAuth | - | 200 + ResponseDto |
| PATCH | `/api/expense-reports/:id/pay` | Marque comme payé | FakeAuth | - | 200 + ResponseDto |
| GET | `/api/expense-reports/:id/expenses` | Liste les expenses | FakeAuth | - | 200 + List |

**CreateExpenseReportDto**:
```typescript
{
  purpose: string;        // @IsString(), @MinLength(5)
  reportDate: Date;       // @IsDateString()
  userId: string;         // @IsUUID()
}
```

#### 4.3.3 Expenses

| Method | Endpoint | Description | Auth | Body | Response |
|--------|----------|-------------|------|------|----------|
| GET | `/api/expenses` | Liste toutes les expenses | FakeAuth | - | 200 + List |
| GET | `/api/expenses/:id` | Récupère une expense | FakeAuth | - | 200 + ResponseDto |
| POST | `/api/expenses` | Crée une expense | FakeAuth | CreateDto | 201 + ResponseDto |
| PATCH | `/api/expenses/:id` | Modifie une expense | FakeAuth | UpdateDto | 200 + ResponseDto |
| DELETE | `/api/expenses/:id` | Supprime une expense | FakeAuth | - | 204 |

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

#### 4.3.4 Attachments

| Method | Endpoint | Description | Auth | Body | Response |
|--------|----------|-------------|------|------|----------|
| GET | `/api/attachments/:id` | Récupère metadata | FakeAuth | - | 200 + ResponseDto |
| GET | `/api/attachments/:id/download` | Télécharge le fichier | FakeAuth | - | 200 + file stream |
| POST | `/api/expenses/:expenseId/attachments` | Upload une pièce jointe | FakeAuth | multipart | 201 + ResponseDto |
| DELETE | `/api/attachments/:id` | Supprime une attachment | FakeAuth | - | 204 |
| GET | `/api/expenses/:expenseId/attachments` | Liste les attachments | FakeAuth | - | 200 + List |

**Règles métier**:
- Taille max: 5MB (configurable)
- Types autorisés: image/jpeg, image/png, application/pdf
- Stockage: `uploads/<expenseId>/<uuid>.<ext>`

### 4.4 Codes HTTP & Gestion d'Erreurs

| Code | Signification | Exemples |
|------|---------------|----------|
| 200 | OK | GET, PATCH réussi |
| 201 | Created | POST réussi |
| 204 | No Content | DELETE réussi |
| 400 | Bad Request | Validation DTO échouée, règle métier violée |
| 404 | Not Found | Ressource inexistante |
| 409 | Conflict | Email déjà existant, transition invalide |
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
│   ├── <uuid>.