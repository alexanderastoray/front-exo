# Suite du document EXPENSE_MANAGEMENT_ARCHITECTURE.md

## Sections 5.2 à 9 (Complétion)

### 5.2 à 5.5 - Suite de la Stratégie Fichiers

```
uploads/
├── <expenseId>/
│   ├── <uuid>.<ext>
│   └── <uuid>.<ext>
└── .gitkeep
```

**Nommage**:
- Format: `<uuid>.<extension>`
- UUID généré par l'application
- Extension extraite du MIME type

**Exemple**:
```
uploads/
├── 123e4567-e89b-12d3-a456-426614174000/
│   ├── a1b2c3d4-e5f6-7890-abcd-ef1234567890.pdf
│   └── b2c3d4e5-f6a7-8901-bcde-f12345678901.jpg
└── 234e5678-f90c-23d4-b567-537725285111/
    └── c3d4e5f6-a7b8-9012-cdef-123456789012.png
```

### 5.2 Validation des Fichiers

#### 5.2.1 Règles de Validation

| Critère | Règle | Erreur |
|---------|-------|--------|
| Taille max | 5 MB (5242880 bytes) | 413 Payload Too Large |
| MIME types | image/jpeg, image/png, application/pdf | 400 Bad Request |
| Extension | .jpg, .jpeg, .png, .pdf | 400 Bad Request |
| Nom fichier | Sanitization (remove special chars) | - |

#### 5.2.2 Implémentation

**Multer Configuration**:
```typescript
// attachments/helpers/file-storage.helper.ts
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';

export const multerConfig = {
  storage: diskStorage({
    destination: (req, file, cb) => {
      const expenseId = req.params.expenseId;
      const uploadPath = `./uploads/${expenseId}`;
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const uniqueName = `${uuidv4()}${extname(file.originalname)}`;
      cb(null, uniqueName);
    },
  }),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new BadRequestException('Invalid file type'), false);
    }
  },
};
```

### 5.3 Gestion du Cycle de Vie

#### 5.3.1 Upload (POST)

**Endpoint**: `POST /api/expenses/:expenseId/attachments`

**Flow**:
1. Validation de l'expense (existe, status modifiable)
2. Validation du fichier (taille, type)
3. Création du répertoire `uploads/<expenseId>` si nécessaire
4. Sauvegarde du fichier avec UUID
5. Création de l'entité Attachment en DB
6. Retour des métadonnées

**Controller**:
```typescript
@Post(':expenseId/attachments')
@UseInterceptors(FileInterceptor('file', multerConfig))
async uploadAttachment(
  @Param('expenseId') expenseId: string,
  @UploadedFile() file: Express.Multer.File,
) {
  return this.attachmentsService.create(expenseId, file);
}
```

#### 5.3.2 Download (GET)

**Endpoint**: `GET /api/attachments/:id/download`

**Flow**:
1. Récupération de l'attachment en DB
2. Vérification de l'existence du fichier physique
3. Stream du fichier avec headers appropriés

**Controller**:
```typescript
@Get(':id/download')
async downloadAttachment(
  @Param('id') id: string,
  @Res() res: Response,
) {
  const attachment = await this.attachmentsService.findOne(id);
  res.download(attachment.filePath, attachment.fileName);
}
```

#### 5.3.3 Delete (DELETE)

**Endpoint**: `DELETE /api/attachments/:id`

**Flow**:
1. Récupération de l'attachment en DB
2. Suppression du fichier physique
3. Suppression de l'entité en DB
4. Recalcul du totalAmount du report parent (si nécessaire)

**Service**:
```typescript
async remove(id: string): Promise<void> {
  const attachment = await this.findOne(id);
  
  // Delete physical file
  if (fs.existsSync(attachment.filePath)) {
    fs.unlinkSync(attachment.filePath);
  }
  
  // Delete DB record
  await this.attachmentRepository.delete(id);
  
  // Clean up empty directory
  const dir = path.dirname(attachment.filePath);
  if (fs.readdirSync(dir).length === 0) {
    fs.rmdirSync(dir);
  }
}
```

### 5.4 Gestion des Erreurs

| Scénario | Code HTTP | Message |
|----------|-----------|---------|
| Fichier trop volumineux | 413 | File size exceeds 5MB limit |
| Type MIME invalide | 400 | Invalid file type. Allowed: jpeg, png, pdf |
| Expense inexistant | 404 | Expense not found |
| Expense non modifiable | 400 | Cannot add attachment to expense with status X |
| Fichier physique manquant | 404 | File not found on disk |
| Erreur écriture disque | 500 | Failed to save file |

### 5.5 Sécurité

#### 5.5.1 Mesures Implémentées

- **Validation MIME type**: Vérification côté serveur (pas de confiance au client)
- **Sanitization du nom**: Suppression des caractères spéciaux
- **UUID pour nommage**: Évite les collisions et path traversal
- **Isolation par expense**: Chaque expense a son répertoire
- **Limite de taille**: Protection contre DoS

#### 5.5.2 Mesures Futures (V2)

- **Scan antivirus**: ClamAV ou similaire
- **Stockage cloud**: S3, Azure Blob, GCS
- **CDN**: Distribution des fichiers
- **Signature URLs**: Accès temporaire sécurisé
- **Compression**: Optimisation de l'espace

---

## 6. Règles Statuts & Transitions

### 6.1 Statuts Disponibles

#### 6.1.1 ReportStatus (ExpenseReport)

```typescript
export enum ReportStatus {
  CREATED = 'CREATED',       // Brouillon, éditable
  SUBMITTED = 'SUBMITTED',   // Soumis, en attente validation
  VALIDATED = 'VALIDATED',   // Validé par manager (V2)
  REJECTED = 'REJECTED',     // Rejeté par manager (V2)
  PAID = 'PAID',            // Payé, archivé
}
```

#### 6.1.2 ExpenseStatus (Expense)

```typescript
export enum ExpenseStatus {
  CREATED = 'CREATED',       // Brouillon
  SUBMITTED = 'SUBMITTED',   // Soumis avec le report
  VALIDATED = 'VALIDATED',   // Validé (V2)
  REJECTED = 'REJECTED',     // Rejeté (V2)
  PAID = 'PAID',            // Payé
}
```

### 6.2 Diagramme de Transitions (ExpenseReport)

```
┌─────────┐
│ CREATED │ ◄──────────────────────┐
└────┬────┘                        │
     │                             │
     │ submit()                    │ (V2) reject()
     ▼                             │
┌───────────┐                      │
│ SUBMITTED │ ─────────────────────┤
└─────┬─────┘                      │
      │                            │
      │ (V2) validate()            │
      ▼                            │
┌───────────┐                      │
│ VALIDATED │                      │
└─────┬─────┘                      │
      │                            │
      │ pay()                      │
      ▼                            │
┌──────┐                           │
│ PAID │                           │
└──────┘                           │
                                   │
┌──────────┐                       │
│ REJECTED │ ──────────────────────┘
└──────────┘
```

### 6.3 Règles de Transition (V1)

#### 6.3.1 ExpenseReport

| Transition | From | To | Endpoint | Conditions | Actions |
|------------|------|-----|----------|------------|---------|
| **Submit** | CREATED | SUBMITTED | PATCH /:id/submit | - Au moins 1 expense<br>- totalAmount > 0 | - Update status<br>- Update expenses status |
| **Pay** | SUBMITTED | PAID | PATCH /:id/pay | - Status = SUBMITTED | - Update status<br>- Set paymentDate<br>- Update expenses status |

**Règles métier**:
- Un report CREATED peut être modifié/supprimé librement
- Un report SUBMITTED ne peut plus être modifié (sauf par manager en V2)
- Un report PAID est en lecture seule

#### 6.3.2 Expense

| Transition | From | To | Trigger | Conditions |
|------------|------|-----|---------|------------|
| **Auto-submit** | CREATED | SUBMITTED | Report.submit() | - |
| **Auto-pay** | SUBMITTED | PAID | Report.pay() | - |

**Règles métier**:
- Une expense CREATED peut être modifiée/supprimée
- Une expense SUBMITTED/PAID ne peut plus être modifiée
- Le statut d'une expense suit automatiquement celui de son report

### 6.4 Règles de Modification

#### 6.4.1 ExpenseReport

| Opération | CREATED | SUBMITTED | VALIDATED | REJECTED | PAID |
|-----------|---------|-----------|-----------|----------|------|
| UPDATE (purpose, reportDate) | ✅ | ❌ | ❌ | ✅ (V2) | ❌ |
| DELETE | ✅ | ❌ | ❌ | ✅ (V2) | ❌ |
| ADD Expense | ✅ | ❌ | ❌ | ✅ (V2) | ❌ |
| SUBMIT | ✅ | ❌ | ❌ | ❌ | ❌ |
| PAY | ❌ | ✅ | ❌ | ❌ | ❌ |

#### 6.4.2 Expense

| Opération | CREATED | SUBMITTED | VALIDATED | REJECTED | PAID |
|-----------|---------|-----------|-----------|----------|------|
| UPDATE | ✅ | ❌ | ❌ | ✅ (V2) | ❌ |
| DELETE | ✅ | ❌ | ❌ | ✅ (V2) | ❌ |
| ADD Attachment | ✅ | ❌ | ❌ | ✅ (V2) | ❌ |

### 6.5 Implémentation des Règles

#### 6.5.1 Helper: report-status.helper.ts

```typescript
export class ReportStatusHelper {
  static canModify(status: ReportStatus): boolean {
    return [ReportStatus.CREATED].includes(status);
  }

  static canSubmit(status: ReportStatus): boolean {
    return status === ReportStatus.CREATED;
  }

  static canPay(status: ReportStatus): boolean {
    return status === ReportStatus.SUBMITTED;
  }

  static validateTransition(from: ReportStatus, to: ReportStatus): void {
    const validTransitions = {
      [ReportStatus.CREATED]: [ReportStatus.SUBMITTED],
      [ReportStatus.SUBMITTED]: [ReportStatus.PAID],
      [ReportStatus.VALIDATED]: [ReportStatus.PAID], // V2
      [ReportStatus.REJECTED]: [ReportStatus.CREATED], // V2
    };

    if (!validTransitions[from]?.includes(to)) {
      throw new BadRequestException(
        `Invalid transition from ${from} to ${to}`
      );
    }
  }
}
```

#### 6.5.2 Service: expense-reports.service.ts

```typescript
async submit(id: string): Promise<ExpenseReport> {
  const report = await this.findOne(id);

  // Validate status
  if (!ReportStatusHelper.canSubmit(report.status)) {
    throw new BadRequestException('Report cannot be submitted');
  }

  // Validate has expenses
  if (!report.expenses || report.expenses.length === 0) {
    throw new BadRequestException('Report must have at least one expense');
  }

  // Validate totalAmount
  if (report.totalAmount <= 0) {
    throw new BadRequestException('Report total must be greater than 0');
  }

  // Update report status
  report.status = ReportStatus.SUBMITTED;

  // Update all expenses status
  await this.expensesRepository.update(
    { reportId: id },
    { status: ExpenseStatus.SUBMITTED }
  );

  return this.reportRepository.save(report);
}
```

### 6.6 Calcul Automatique du totalAmount

#### 6.6.1 Triggers de Recalcul

Le `totalAmount` d'un ExpenseReport est recalculé automatiquement lors de :

1. **Création d'une expense** (POST /api/expenses)
2. **Modification d'une expense** (PATCH /api/expenses/:id)
3. **Suppression d'une expense** (DELETE /api/expenses/:id)

#### 6.6.2 Implémentation

**Service: expenses.service.ts**
```typescript
async create(createDto: CreateExpenseDto): Promise<Expense> {
  const expense = this.expenseRepository.create(createDto);
  const saved = await this.expenseRepository.save(expense);
  
  // Recalculate report total
  await this.recalculateReportTotal(createDto.reportId);
  
  return saved;
}

private async recalculateReportTotal(reportId: string): Promise<void> {
  const expenses = await this.expenseRepository.find({
    where: { reportId },
  });

  const total = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);

  await this.reportRepository.update(reportId, {
    totalAmount: total,
  });
}
```

#### 6.6.3 Précision des Calculs

- **Type**: DECIMAL(10, 2) en DB
- **Précision**: 2 décimales
- **Arrondi**: Pas d'arrondi automatique (erreur si > 2 décimales)
- **Validation**: `@IsNumber({ maxDecimalPlaces: 2 })` dans les DTOs

---

## 7. Stratégie de Tests & Couverture

### 7.1 Objectifs de Couverture

| Type de Test | Couverture Cible | Outil |
|--------------|------------------|-------|
| Unit Tests | ≥ 85% | Jest |
| Integration Tests | ≥ 70% | Jest + Supertest |
| E2E Tests | Hors scope V1 | - |

### 7.2 Structure des Tests

```
backend/src/
├── users/
│   ├── users.service.spec.ts        # Unit tests
│   └── users.controller.spec.ts     # Controller tests
├── expense-reports/
│   ├── expense-reports.service.spec.ts
│   └── expense-reports.controller.spec.ts
├── expenses/
│   ├── expenses.service.spec.ts
│   └── expenses.controller.spec.ts
└── attachments/
    ├── attachments.service.spec.ts
    └── attachments.controller.spec.ts
```

### 7.3 Stratégie par Couche

#### 7.3.1 Services (Unit Tests)

**Objectif**: Tester la logique métier isolément

**Mocking**:
- Repository (TypeORM)
- Autres services
- File system (pour attachments)

**Exemple: expense-reports.service.spec.ts**
```typescript
describe('ExpenseReportsService', () => {
  let service: ExpenseReportsService;
  let repository: MockType<Repository<ExpenseReport>>;
  let expensesRepository: MockType<Repository<Expense>>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ExpenseReportsService,
        {
          provide: getRepositoryToken(ExpenseReport),
          useFactory: repositoryMockFactory,
        },
        {
          provide: getRepositoryToken(Expense),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();

    service = module.get(ExpenseReportsService);
    repository = module.get(getRepositoryToken(ExpenseReport));
    expensesRepository = module.get(getRepositoryToken(Expense));
  });

  describe('submit', () => {
    it('should submit a report with CREATED status', async () => {
      const report = {
        id: 'uuid',
        status: ReportStatus.CREATED,
        expenses: [{ amount: 100 }],
        totalAmount: 100,
      };

      repository.findOne.mockResolvedValue(report);
      repository.save.mockResolvedValue({
        ...report,
        status: ReportStatus.SUBMITTED,
      });

      const result = await service.submit('uuid');

      expect(result.status).toBe(ReportStatus.SUBMITTED);
      expect(expensesRepository.update).toHaveBeenCalledWith(
        { reportId: 'uuid' },
        { status: ExpenseStatus.SUBMITTED }
      );
    });

    it('should throw if report has no expenses', async () => {
      const report = {
        id: 'uuid',
        status: ReportStatus.CREATED,
        expenses: [],
        totalAmount: 0,
      };

      repository.findOne.mockResolvedValue(report);

      await expect(service.submit('uuid')).rejects.toThrow(
        'Report must have at least one expense'
      );
    });

    it('should throw if status is not CREATED', async () => {
      const report = {
        id: 'uuid',
        status: ReportStatus.SUBMITTED,
      };

      repository.findOne.mockResolvedValue(report);

      await expect(service.submit('uuid')).rejects.toThrow(
        'Report cannot be submitted'
      );
    });
  });
});
```

**Cas de test à couvrir**:
- ✅ Happy path (création, lecture, modification, suppression)
- ✅ Validation des DTOs
- ✅ Règles métier (transitions de statuts)
- ✅ Calcul du totalAmount
- ✅ Gestion des erreurs (404, 400, 409)
- ✅ Cascade delete

### 7.4 Mocking Patterns

#### 7.4.1 Repository Mock Factory

```typescript
export type MockType<T> = {
  [P in keyof T]?: jest.Mock<any>;
};

export const repositoryMockFactory: () => MockType<Repository<any>> = jest.fn(
  () => ({
    findOne: jest.fn(),
    find: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  })
);
```

#### 7.4.2 File System Mock (Attachments)

```typescript
jest.mock('fs', () => ({
  existsSync: jest.fn(),
  unlinkSync: jest.fn(),
  mkdirSync: jest.fn(),
  readdirSync: jest.fn(),
  rmdirSync: jest.fn(),
}));
```

### 7.5 Configuration Jest

**jest.config.js**
```javascript
module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: [
    '**/*.(service|controller|helper).ts',
    '!**/*.spec.ts',
    '!**/node_modules/**',
    '!**/dist/**',
  ],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  coverageThreshold: {
    global: {
      branches: 85,
      functions: 85,
      lines: 85,
      statements: 85,
    },
  },
};
```

### 7.6 Scripts de Test

**package.json**
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

### 7.7 Checklist de Couverture

Pour chaque module, vérifier :

- [ ] **Services**:
  - [ ] CRUD operations (create, findAll, findOne, update, remove)
  - [ ] Business rules (status transitions, validations)
  - [ ] Error handling (404, 400, 409)
  - [ ] Edge cases (empty lists, null values)

- [ ] **Controllers**:
  - [ ] All endpoints (GET, POST, PATCH, DELETE)
  - [ ] DTO validation (required fields, formats, enums)
  - [ ] HTTP status codes (200, 201, 204, 400, 404)
  - [ ] Query params (pagination, filters)

- [ ] **Helpers**:
  - [ ] All public methods
  - [ ] All branches (if/else, switch)
  - [ ] Error cases

---

## 8. Plan de Travail (Roadmap)

### 8.1 Vue d'Ensemble

**Durée estimée**: 12 jours ouvrés  
**Effort**: ~80-100 heures  
**Phases**: 8 phases séquentielles

### 8.2 Phases Détaillées

#### Phase 1: Bootstrap & Configuration (Jour 1)
**Durée**: 1 jour  
**Objectif**: Préparer l'environnement de développement

**Tâches**:
- [ ] Installer les dépendances NestJS
  ```bash
  npm install --save @nestjs/typeorm typeorm sqlite3
  npm install --save @nestjs/swagger swagger-ui-express
  npm install --save @nestjs/config joi
  npm install --save class-validator class-transformer
  npm install --save @nestjs/platform-express multer
  npm install --save-dev @types/multer
  ```
- [ ] Créer `.env` et `.env.example`
- [ ] Configurer `database.config.ts` (TypeORM + SQLite)
- [ ] Configurer `app.config.ts` (validation Joi)
- [ ] Configurer `swagger.config.ts`
- [ ] Mettre à jour `main.ts` (global prefix, pipes, filters)
- [ ] Créer `data/` et `uploads/` directories
- [ ] Tester le démarrage de l'application

**Livrables**:
- ✅ Application démarre sur port 3000
- ✅ Swagger accessible sur `/docs`
- ✅ Base SQLite créée dans `data/`

---

#### Phase 2: Common Module (Jour 2)
**Durée**: 1 jour  
**Objectif**: Créer les composants partagés

**Tâches**:
- [ ] Créer les enums:
  - [ ] `user-role.enum.ts`
  - [ ] `report-status.enum.ts`
  - [ ] `expense-status.enum.ts`
  - [ ] `expense-category.enum.ts`
- [ ] Créer `fake-auth.guard.ts` (return true)
- [ ] Créer `transform.interceptor.ts`
- [ ] Créer `logging.interceptor.ts`
- [ ] Créer `http-exception.filter.ts`
- [ ] Créer `validation.pipe.ts`
- [ ] Créer `pagination.dto.ts`
- [ ] Créer `error-response.dto.ts`
- [ ] Créer `common.module.ts` (exports)
- [ ] Écrire tests unitaires pour les helpers

**Livrables**:
- ✅ CommonModule exporté et importable
- ✅ Enums disponibles globalement
- ✅ Guards/Interceptors/Filters fonctionnels

---

#### Phase 3: Users Module (Jours 3-4)
**Durée**: 2 jours  
**Objectif**: Implémenter la gestion des utilisateurs

**Jour 3**:
- [ ] Créer `user.entity.ts` (avec relations)
- [ ] Créer DTOs:
  - [ ] `create-user.dto.ts`
  - [ ] `update-user.dto.ts`
  - [ ] `user-response.dto.ts`
- [ ] Créer `users.service.ts` (CRUD)
- [ ] Créer `users.controller.ts` (endpoints + Swagger)
- [ ] Créer `users.module.ts`

**Jour 4**:
- [ ] Écrire `users.service.spec.ts` (≥85% coverage)
- [ ] Écrire `users.controller.spec.ts`
- [ ] Tester manuellement via Swagger
- [ ] Vérifier la couverture de tests

**Livrables**:
- ✅ CRUD Users fonctionnel
- ✅ Tests ≥85% coverage
- ✅ Documentation Swagger complète

---

#### Phase 4: ExpenseReports Module (Jours 5-6)
**Durée**: 2 jours  
**Objectif**: Implémenter la gestion des notes de frais

**Jour 5**:
- [ ] Créer `expense-report.entity.ts`
- [ ] Créer DTOs (Create, Update, Response, List)
- [ ] Créer `report-status.helper.ts`
- [ ] Créer `expense-reports.service.ts`:
  - [ ] CRUD operations
  - [ ] `submit()` method
  - [ ] `pay()` method
  - [ ] Status validation
- [ ] Créer `expense-reports.controller.ts`
- [ ] Créer `expense-reports.module.ts`

**Jour 6**:
- [ ] Écrire tests services (transitions, validations)
- [ ] Écrire tests controllers
- [ ] Tester manuellement via Swagger
- [ ] Vérifier la couverture

**Livrables**:
- ✅ CRUD ExpenseReports fonctionnel
- ✅ Workflow submit/pay opérationnel
- ✅ Tests ≥85% coverage

---

#### Phase 5: Expenses Module (Jours 7-8)
**Durée**: 2 jours  
**Objectif**: Implémenter la gestion des dépenses

**Jour 7**:
- [ ] Créer `expense.entity.ts`
- [ ] Créer DTOs (Create, Update, Response, List)
- [ ] Créer `expense-status.helper.ts`
- [ ] Créer `expenses.service.ts`:
  - [ ] CRUD operations
  - [ ] `recalculateReportTotal()` method
  - [ ] Integration avec ExpenseReports
- [ ] Créer `expenses.controller.ts`
- [ ] Créer `expenses.module.ts`

**Jour 8**:
- [ ] Écrire tests services (calcul totalAmount)
- [ ] Écrire tests controllers
- [ ] Tester le recalcul automatique
- [ ] Vérifier la couverture

**Livrables**:
- ✅ CRUD Expenses fonctionnel
- ✅ Recalcul automatique totalAmount
- ✅ Tests ≥85% coverage

---

#### Phase 6: Attachments Module (Jours 9-10)
**Durée**: 2 jours  
**Objectif**: Implémenter la gestion des pièces jointes

**Jour 9**:
- [ ] Créer `attachment.entity.ts`
- [ ] Créer DTOs (Response, Upload)
- [ ] Créer `file-storage.helper.ts`:
  - [ ] Multer configuration
  - [ ] File validation
  - [ ] Directory management
- [ ] Créer `attachments.service.ts`:
  - [ ] Upload logic
  - [ ] Download logic
  - [ ] Delete logic (file + DB)
- [ ] Créer `attachments.controller.ts`
- [ ] Créer `attachments.module.ts`

**Jour 10**:
- [ ] Écrire tests services (mock fs)
- [ ] Écrire tests controllers
- [ ] Tester upload/download/delete
- [ ] Vérifier la couverture

**Livrables**:
- ✅ Upload/Download/Delete fonctionnel
- ✅ Validation fichiers (taille, type)
- ✅ Tests ≥85% coverage

---

#### Phase 7: Tests & Documentation (Jour 11)
**Durée**: 1 jour  
**Objectif**: Finaliser les tests et la documentation

**Tâches**:
- [ ] Exécuter `npm run test:cov` sur tous les modules
- [ ] Corriger les tests manquants pour atteindre ≥85%
- [ ] Compléter la documentation Swagger:
  - [ ] Descriptions des endpoints
  - [ ] Exemples de requêtes/réponses
  - [ ] Tags et groupes
- [ ] Créer un fichier `QUICK_START.md`
- [ ] Mettre à jour le `README.md`
- [ ] Vérifier tous les endpoints via Swagger

**Livrables**:
- ✅ Couverture de tests ≥85% globale
- ✅ Documentation Swagger complète
-