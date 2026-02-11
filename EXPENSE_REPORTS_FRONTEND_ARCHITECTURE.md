# Architecture Frontend - Expense Reports Interface

## 📋 Vue d'ensemble

Implémentation de l'interface "Expense Reports" basée sur la maquette HTML fournie, avec une architecture frontend professionnelle utilisant React, TypeScript, et TailwindCSS.

---

## 🎯 Objectifs

1. **Modéliser la maquette** fournie en composants React réutilisables
2. **Architecture professionnelle** avec séparation des responsabilités
3. **Composants réutilisables** (icônes, boutons, badges) pour d'autres écrans
4. **Hooks personnalisés** pour la logique métier
5. **Script de seed** pour peupler la base de données avec les données de la maquette
6. **Intégration backend** complète avec l'API NestJS existante

---

## 📊 Analyse de la Maquette

### Éléments Visuels Identifiés

#### 1. **Header**
- Titre centré "Expense Reports"
- Bouton "+" (création de rapport)
- Sticky positioning

#### 2. **Barre de Recherche**
- Input avec icône de recherche
- Placeholder "Search reports..."

#### 3. **Filtres & Tri**
- Bouton "Filter & Sort" avec icône tune
- Pills actifs affichant les filtres appliqués :
  - "Status: Submitted"
  - "Amount: High to Low"
- Possibilité de supprimer chaque filtre (icône close)

#### 4. **Liste de Rapports** (4 exemples dans la maquette)

**Rapport 1: Q4 Client On-site**
- Date: Oct 26, 2023
- Montant: $175.00
- Catégories: restaurant (Meals), flight (Travel)
- Status: Submitted (bleu)

**Rapport 2: October Office Supplies**
- Date: Oct 24, 2023
- Montant: $75.00
- Catégories: shopping_cart (Office Supplies)
- Status: Validated (vert lime)

**Rapport 3: Team Offsite Event**
- Date: Oct 22, 2023
- Montant: $215.00
- Catégories: groups (Team Event), local_parking (Parking)
- Status: Paid (vert)

**Rapport 4: Commute & Meals**
- Date: Oct 21, 2023
- Montant: $40.00
- Catégories: local_parking (Parking), restaurant (Meals)
- Status: Created (orange)

#### 5. **Modal de Filtres**
- Overlay semi-transparent
- Panel bottom sheet
- Sections :
  - **Status** : All, Submitted, Approved, Denied, Paid
  - **Date Range** : From/To date pickers
  - **Total Amount** : Range slider (0-1000+)
  - **Categories** : Pills sélectionnables (Meals, Travel, Supplies, Team Event, Parking)
- Boutons : Clear, Apply Filters

#### 6. **Footer Navigation**
- 3 onglets : Reports (actif), Submit, Profile
- Icônes avec labels
- Fixed positioning

### Couleurs de Status
```css
Created: #f59e0b (orange)
Submitted: #3b82f6 (bleu)
Validated: #84cc16 (lime)
Paid: #10b981 (vert)
Denied: #ef4444 (rouge)
```

---

## 🏗️ Architecture Frontend Proposée

### Structure des Dossiers

```
frontend/src/
├── api/
│   ├── client.ts                    # Axios client existant
│   ├── health.api.ts                # Existant
│   └── expense-reports.api.ts       # NOUVEAU - API calls pour reports
│
├── components/
│   ├── common/                      # Composants réutilisables
│   │   ├── Button.tsx               # Bouton générique
│   │   ├── IconButton.tsx           # Bouton avec icône
│   │   ├── SearchInput.tsx          # Input de recherche
│   │   ├── Badge.tsx                # Badge de status
│   │   ├── FilterPill.tsx           # Pill de filtre actif
│   │   ├── CategoryIcon.tsx         # Icône de catégorie
│   │   └── Modal.tsx                # Modal générique
│   │
│   ├── expense-reports/             # Composants spécifiques
│   │   ├── ExpenseReportCard.tsx    # Card d'un rapport
│   │   ├── ExpenseReportList.tsx    # Liste de rapports
│   │   ├── FilterModal.tsx          # Modal de filtres
│   │   ├── ActiveFilters.tsx        # Pills de filtres actifs
│   │   └── ExpenseReportHeader.tsx  # Header avec bouton +
│   │
│   ├── layout/
│   │   ├── Header.tsx               # Header générique
│   │   ├── Footer.tsx               # Footer navigation
│   │   └── Layout.tsx               # Layout principal
│   │
│   ├── LoadingSpinner.tsx           # Existant
│   └── StatusCard.tsx               # Existant
│
├── hooks/
│   ├── useHealth.ts                 # Existant
│   ├── useExpenseReports.ts         # NOUVEAU - Gestion des reports
│   ├── useFilters.ts                # NOUVEAU - Gestion des filtres
│   ├── useSearch.ts                 # NOUVEAU - Recherche
│   └── useDebounce.ts               # NOUVEAU - Debounce pour search
│
├── pages/
│   ├── StatusPage.tsx               # Existant
│   ├── ExpenseReportsPage.tsx       # NOUVEAU - Page principale
│   ├── SubmitExpensePage.tsx        # NOUVEAU - Soumission (placeholder)
│   └── ProfilePage.tsx              # NOUVEAU - Profil (placeholder)
│
├── types/
│   ├── expense-report.types.ts      # NOUVEAU - Types pour reports
│   ├── filter.types.ts              # NOUVEAU - Types pour filtres
│   └── api.types.ts                 # Types API génériques
│
├── utils/
│   ├── date.utils.ts                # NOUVEAU - Formatage dates
│   ├── currency.utils.ts            # NOUVEAU - Formatage montants
│   └── category.utils.ts            # NOUVEAU - Mapping catégories/icônes
│
├── constants/
│   ├── categories.ts                # NOUVEAU - Définition des catégories
│   ├── statuses.ts                  # NOUVEAU - Définition des statuts
│   └── icons.ts                     # NOUVEAU - Mapping icônes Material
│
├── styles/
│   └── index.css                    # Existant (Tailwind)
│
├── App.tsx                          # Router principal
├── main.tsx                         # Entry point
└── vite-env.d.ts
```

---

## 🔧 Composants Détaillés

### 1. **CategoryIcon.tsx** (Réutilisable)

```typescript
interface CategoryIconProps {
  category: ExpenseCategory;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

// Mapping catégorie → icône Material Symbols
const CATEGORY_ICONS = {
  MEALS: 'restaurant',
  TRAVEL: 'flight',
  OFFICE_SUPPLIES: 'shopping_cart',
  TRANSPORT: 'local_parking',
  // ... autres catégories
};
```

**Utilisation** : Affichage des icônes dans les cards, filtres, etc.

---

### 2. **Badge.tsx** (Réutilisable)

```typescript
interface BadgeProps {
  status: ReportStatus;
  size?: 'sm' | 'md';
}

// Couleurs selon le status
const STATUS_COLORS = {
  CREATED: 'text-amber-500',
  SUBMITTED: 'text-blue-500',
  VALIDATED: 'text-lime-500',
  PAID: 'text-emerald-500',
  REJECTED: 'text-red-500',
};
```

**Utilisation** : Affichage du statut dans les cards, listes, détails.

---

### 3. **ExpenseReportCard.tsx**

```typescript
interface ExpenseReportCardProps {
  report: ExpenseReport;
  onClick?: () => void;
}

// Affiche :
// - Titre (purpose)
// - Date (reportDate formatée)
// - Montant (totalAmount formaté)
// - Icônes des catégories (dédupliquées des expenses)
// - Badge de status
```

---

### 4. **FilterModal.tsx**

```typescript
interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onApply: (filters: FilterState) => void;
  onClear: () => void;
}

// Sections :
// - Status (boutons multi-sélection)
// - Date Range (2 inputs date)
// - Amount Range (slider)
// - Categories (pills multi-sélection)
```

---

### 5. **ActiveFilters.tsx**

```typescript
interface ActiveFiltersProps {
  filters: FilterState;
  onRemoveFilter: (filterKey: string) => void;
}

// Affiche les pills pour chaque filtre actif
// Permet de supprimer individuellement
```

---

## 🎣 Hooks Personnalisés

### 1. **useExpenseReports.ts**

```typescript
interface UseExpenseReportsReturn {
  reports: ExpenseReport[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  totalCount: number;
}

// Gère :
// - Fetch des reports depuis l'API
// - Pagination (future)
// - Cache local
// - Refresh
```

---

### 2. **useFilters.ts**

```typescript
interface FilterState {
  status: ReportStatus[];
  dateFrom: Date | null;
  dateTo: Date | null;
  amountMin: number;
  amountMax: number;
  categories: ExpenseCategory[];
  sortBy: 'date' | 'amount';
  sortOrder: 'asc' | 'desc';
}

interface UseFiltersReturn {
  filters: FilterState;
  setFilter: (key: keyof FilterState, value: any) => void;
  clearFilters: () => void;
  applyFilters: (reports: ExpenseReport[]) => ExpenseReport[];
  activeFilterCount: number;
}

// Gère :
// - État des filtres
// - Application des filtres sur les données
// - Tri
// - Comptage des filtres actifs
```

---

### 3. **useSearch.ts**

```typescript
interface UseSearchReturn {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  debouncedSearchTerm: string;
  applySearch: (reports: ExpenseReport[]) => ExpenseReport[];
}

// Gère :
// - Recherche textuelle (purpose, description)
// - Debounce (300ms)
// - Filtrage des résultats
```

---

### 4. **useDebounce.ts**

```typescript
function useDebounce<T>(value: T, delay: number): T {
  // Hook générique pour debounce
}
```

---

## 📦 Types TypeScript

### expense-report.types.ts

```typescript
import { ReportStatus } from '../constants/statuses';
import { ExpenseCategory } from '../constants/categories';

export interface ExpenseReport {
  id: string;
  purpose: string;
  reportDate: string; // ISO date
  totalAmount: number;
  status: ReportStatus;
  paymentDate: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
  expenses?: Expense[]; // Optionnel, chargé avec include
}

export interface Expense {
  id: string;
  reportId: string;
  category: ExpenseCategory;
  expenseName: string | null;
  description: string | null;
  amount: number;
  expenseDate: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExpenseReportWithCategories extends ExpenseReport {
  categories: ExpenseCategory[]; // Calculé côté frontend
}
```

---

### filter.types.ts

```typescript
export interface FilterState {
  status: ReportStatus[];
  dateFrom: Date | null;
  dateTo: Date | null;
  amountMin: number;
  amountMax: number;
  categories: ExpenseCategory[];
  sortBy: 'date' | 'amount';
  sortOrder: 'asc' | 'desc';
}

export type FilterKey = keyof FilterState;
```

---

## 🌐 API Client

### expense-reports.api.ts

```typescript
import { apiClient } from './client';
import { ExpenseReport } from '../types/expense-report.types';

export const expenseReportsApi = {
  // GET /api/expense-reports?include=expenses
  getAll: async (): Promise<ExpenseReport[]> => {
    const response = await apiClient.get('/expense-reports', {
      params: { include: 'expenses' }
    });
    return response.data;
  },

  // GET /api/expense-reports/:id
  getById: async (id: string): Promise<ExpenseReport> => {
    const response = await apiClient.get(`/expense-reports/${id}`);
    return response.data;
  },

  // POST /api/expense-reports
  create: async (data: CreateExpenseReportDto): Promise<ExpenseReport> => {
    const response = await apiClient.post('/expense-reports', data);
    return response.data;
  },

  // PATCH /api/expense-reports/:id
  update: async (id: string, data: UpdateExpenseReportDto): Promise<ExpenseReport> => {
    const response = await apiClient.patch(`/expense-reports/${id}`, data);
    return response.data;
  },

  // DELETE /api/expense-reports/:id
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/expense-reports/${id}`);
  },

  // POST /api/expense-reports/:id/submit
  submit: async (id: string): Promise<ExpenseReport> => {
    const response = await apiClient.post(`/expense-reports/${id}/submit`);
    return response.data;
  },
};
```

---

## 🗄️ Script de Seed pour la Base de Données

### backend/src/database/seeds/expense-reports.seed.ts

```typescript
import { DataSource } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ExpenseReport } from '../../expense-reports/entities/expense-report.entity';
import { Expense } from '../../expenses/entities/expense.entity';
import { ReportStatus } from '../../common/enums/report-status.enum';
import { ExpenseCategory } from '../../common/enums/expense-category.enum';
import { ExpenseStatus } from '../../common/enums/expense-status.enum';

export async function seedExpenseReports(dataSource: DataSource) {
  const userRepo = dataSource.getRepository(User);
  const reportRepo = dataSource.getRepository(ExpenseReport);
  const expenseRepo = dataSource.getRepository(Expense);

  // 1. Créer ou récupérer un utilisateur
  let user = await userRepo.findOne({ where: { email: 'john.doe@example.com' } });
  
  if (!user) {
    user = userRepo.create({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      role: 'EMPLOYEE',
    });
    await userRepo.save(user);
  }

  // 2. Rapport 1: Q4 Client On-site - $175.00 - Submitted
  const report1 = reportRepo.create({
    purpose: 'Q4 Client On-site',
    reportDate: new Date('2023-10-26'),
    totalAmount: 175.00,
    status: ReportStatus.SUBMITTED,
    userId: user.id,
  });
  await reportRepo.save(report1);

  // Expenses pour rapport 1
  const expense1_1 = expenseRepo.create({
    reportId: report1.id,
    category: ExpenseCategory.MEALS,
    expenseName: 'Client Lunch',
    description: 'Business lunch with client',
    amount: 85.00,
    expenseDate: new Date('2023-10-26'),
    status: ExpenseStatus.APPROVED,
  });

  const expense1_2 = expenseRepo.create({
    reportId: report1.id,
    category: ExpenseCategory.TRAVEL,
    expenseName: 'Flight to Client Site',
    description: 'Round trip flight',
    amount: 90.00,
    expenseDate: new Date('2023-10-26'),
    status: ExpenseStatus.APPROVED,
  });

  await expenseRepo.save([expense1_1, expense1_2]);

  // 3. Rapport 2: October Office Supplies - $75.00 - Validated
  const report2 = reportRepo.create({
    purpose: 'October Office Supplies',
    reportDate: new Date('2023-10-24'),
    totalAmount: 75.00,
    status: ReportStatus.VALIDATED,
    userId: user.id,
  });
  await reportRepo.save(report2);

  const expense2_1 = expenseRepo.create({
    reportId: report2.id,
    category: ExpenseCategory.OFFICE_SUPPLIES,
    expenseName: 'Office Supplies',
    description: 'Pens, notebooks, folders',
    amount: 75.00,
    expenseDate: new Date('2023-10-24'),
    status: ExpenseStatus.APPROVED,
  });

  await expenseRepo.save(expense2_1);

  // 4. Rapport 3: Team Offsite Event - $215.00 - Paid
  const report3 = reportRepo.create({
    purpose: 'Team Offsite Event',
    reportDate: new Date('2023-10-22'),
    totalAmount: 215.00,
    status: ReportStatus.PAID,
    paymentDate: new Date('2023-10-30'),
    userId: user.id,
  });
  await reportRepo.save(report3);

  const expense3_1 = expenseRepo.create({
    reportId: report3.id,
    category: ExpenseCategory.OTHER, // Team Event
    expenseName: 'Team Building Activity',
    description: 'Team offsite event',
    amount: 180.00,
    expenseDate: new Date('2023-10-22'),
    status: ExpenseStatus.APPROVED,
  });

  const expense3_2 = expenseRepo.create({
    reportId: report3.id,
    category: ExpenseCategory.TRANSPORT,
    expenseName: 'Parking',
    description: 'Event venue parking',
    amount: 35.00,
    expenseDate: new Date('2023-10-22'),
    status: ExpenseStatus.APPROVED,
  });

  await expenseRepo.save([expense3_1, expense3_2]);

  // 5. Rapport 4: Commute & Meals - $40.00 - Created
  const report4 = reportRepo.create({
    purpose: 'Commute & Meals',
    reportDate: new Date('2023-10-21'),
    totalAmount: 40.00,
    status: ReportStatus.CREATED,
    userId: user.id,
  });
  await reportRepo.save(report4);

  const expense4_1 = expenseRepo.create({
    reportId: report4.id,
    category: ExpenseCategory.TRANSPORT,
    expenseName: 'Parking',
    description: 'Office parking',
    amount: 15.00,
    expenseDate: new Date('2023-10-21'),
    status: ExpenseStatus.PENDING,
  });

  const expense4_2 = expenseRepo.create({
    reportId: report4.id,
    category: ExpenseCategory.MEALS,
    expenseName: 'Lunch',
    description: 'Working lunch',
    amount: 25.00,
    expenseDate: new Date('2023-10-21'),
    status: ExpenseStatus.PENDING,
  });

  await expenseRepo.save([expense4_1, expense4_2]);

  console.log('✅ Expense reports seeded successfully!');
}
```

### Script d'exécution: backend/src/database/seeds/run-seed.ts

```typescript
import { DataSource } from 'typeorm';
import { databaseConfig } from '../../config/database.config';
import { seedExpenseReports } from './expense-reports.seed';

async function runSeed() {
  const dataSource = new DataSource(databaseConfig);

  try {
    await dataSource.initialize();
    console.log('📦 Database connected');

    await seedExpenseReports(dataSource);

    console.log('✅ All seeds completed!');
  } catch (error) {
    console.error('❌ Seed failed:', error);
  } finally {
    await dataSource.destroy();
  }
}

runSeed();
```

### Commande NPM: backend/package.json

```json
{
  "scripts": {
    "seed": "ts-node src/database/seeds/run-seed.ts"
  }
}
```

**Exécution** : `npm run seed` depuis le dossier backend

---

## 🎨 Utilitaires

### date.utils.ts

```typescript
export const formatDate = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  // Output: "Oct 26, 2023"
};
```

---

### currency.utils.ts

```typescript
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
  // Output: "$175.00"
};
```

---

### category.utils.ts

```typescript
import { ExpenseCategory } from '../constants/categories';

export const getCategoryIcon = (category: ExpenseCategory): string => {
  const icons: Record<ExpenseCategory, string> = {
    MEALS: 'restaurant',
    TRAVEL: 'flight',
    OFFICE_SUPPLIES: 'shopping_cart',
    TRANSPORT: 'local_parking',
    ACCOMMODATION: 'hotel',
    COMMUNICATION: 'phone',
    OTHER: 'groups', // Team events, etc.
  };
  return icons[category] || 'receipt';
};

export const getCategoryLabel = (category: ExpenseCategory): string => {
  const labels: Record<ExpenseCategory, string> = {
    MEALS: 'Meals',
    TRAVEL: 'Travel',
    OFFICE_SUPPLIES: 'Supplies',
    TRANSPORT: 'Parking',
    ACCOMMODATION: 'Hotel',
    COMMUNICATION: 'Phone',
    OTHER: 'Team Event',
  };
  return labels[category] || category;
};
```

---

## 🔄 Flux de Données

### 1. Chargement Initial

```
ExpenseReportsPage
  ↓
useExpenseReports() → API GET /expense-reports?include=expenses
  ↓
État local: reports[]
  ↓
useFilters() → Filtrage & tri
  ↓
useSearch() → Recherche textuelle
  ↓
ExpenseReportList → Affichage des cards
```

---

### 2. Application de Filtres

```
User clique "Filter & Sort"
  ↓
FilterModal s'ouvre
  ↓
User sélectionne filtres
  ↓
User clique "Apply Filters"
  ↓
useFilters().applyFilters(reports)
  ↓
Liste mise à jour
  ↓
ActiveFilters affiche les pills
```

---

### 3. Recherche

```
User tape dans SearchInput
  ↓
useDebounce(searchTerm, 300ms)
  ↓
useSearch().applySearch(filteredReports)
  ↓
Liste mise à jour en temps réel
```

---

## 🎯 Mapping Catégories (Maquette → Backend)

| Maquette | Icône Material | Backend Enum | Label |
|----------|----------------|--------------|-------|
| Meals | `restaurant` | `MEALS` | Meals |
| Travel | `flight` | `TRAVEL` | Travel |
| Supplies | `shopping_cart` | `OFFICE_SUPPLIES` | Supplies |
| Team Event | `groups` | `OTHER` | Team Event |
| Parking | `local_parking` | `TRANSPORT` | Parking |

**Note** : La catégorie "Team Event" sera mappée sur `OTHER` dans le backend, car elle n'existe pas dans l'enum actuel.

---

## 📱 Responsive & Dark Mode

### Tailwind Classes Utilisées

- **Dark Mode** : `dark:bg-background-dark`, `dark:text-foreground-dark`
- **Responsive** : Mobile-first (défaut), breakpoints pour tablet/desktop si nécessaire
- **Sticky Elements** : Header (`sticky top-0`), Footer (`fixed bottom-0`)
- **Transitions** : `transition-colors`, `hover:bg-primary/10`

---

## 🧪 Tests (Future)

### Tests Unitaires (Vitest)

- **Composants** : ExpenseReportCard, Badge, CategoryIcon
- **Hooks** : useFilters, useSearch, useDebounce
- **Utils** : formatDate, formatCurrency, getCategoryIcon

### Tests d'Intégration

- **Page complète** : ExpenseReportsPage avec filtres et recherche
- **API mocking** : Mock des appels API avec MSW

---

## 📦 Dépendances Supplémentaires

Aucune dépendance externe nécessaire ! Tout est réalisable avec :
- ✅ React (existant)
- ✅ TypeScript (existant)
- ✅ TailwindCSS (existant)
- ✅ Axios (existant)
- ✅ Material Symbols (via CDN dans la maquette, ou icônes SVG custom)

**Option** : Installer `@heroicons/react` pour des icônes React natives au lieu de Material Symbols.

---

## 🚀 Plan d'Implémentation

### Phase 1 : Backend - Script de Seed
1. Créer `backend/src/database/seeds/expense-reports.seed.ts`
2. Créer `backend/src/database/seeds/run-seed.ts`
3. Ajouter script NPM `"seed": "ts-node src/database/seeds/run-seed.ts"`
4. Exécuter le seed : `npm run seed`
5. Vérifier les données via Swagger `/api/expense-reports`

### Phase 2 : Frontend - Types & API
1. Créer `types/expense-report.types.ts`
2. Créer `types/filter.types.ts`
3. Créer `constants/categories.ts`
4. Créer `constants/statuses.ts`
5. Créer `api/expense-reports.api.ts`

### Phase 3 : Frontend - Utilitaires
1. Créer `utils/date.utils.ts`
2. Créer `utils/currency.utils.ts`
3. Créer `utils/category.utils.ts`

### Phase 4 : Frontend - Hooks
1. Créer `hooks/useDebounce.ts`
2. Créer `hooks/useExpenseReports.ts`
3. Créer `hooks/useFilters.ts`
4. Créer `hooks/useSearch.ts`

### Phase 5 : Frontend - Composants Réutilisables
1. Créer `components/common/Badge.tsx`
2. Créer `components/common/CategoryIcon.tsx`
3. Créer `components/common/SearchInput.tsx`
4. Créer `components/common/FilterPill.tsx`
5. Créer `components/common/Button.tsx`
6. Créer `components/common/IconButton.tsx`
7. Créer `components/common/Modal.tsx`

### Phase 6 : Frontend - Composants Spécifiques
1. Créer `components/expense-reports/ExpenseReportCard.tsx`
2. Créer `components/expense-reports/ExpenseReportList.tsx`
3. Créer `components/expense-reports/ActiveFilters.tsx`
4. Créer `components/expense-reports/FilterModal.tsx`
5. Créer `components/expense-reports/ExpenseReportHeader.tsx`

### Phase 7 : Frontend - Layout
1. Créer `components/layout/Header.tsx`
2. Créer `components/layout/Footer.tsx`
3. Créer `components/layout/Layout.tsx`

### Phase 8 : Frontend - Pages
1. Créer `pages/ExpenseReportsPage.tsx` (page principale)
2. Créer `pages/SubmitExpensePage.tsx` (placeholder)
3. Créer `pages/ProfilePage.tsx` (placeholder)
4. Mettre à jour `App.tsx` avec le routing

### Phase 9 : Intégration & Tests
1. Tester l'affichage de la liste
2. Tester les filtres
3. Tester la recherche
4. Tester le responsive
5. Tester le dark mode
6. Ajuster les styles si nécessaire

---

## 📝 Notes Importantes

### Différences Maquette vs Backend

1. **Catégorie "Team Event"** : N'existe pas dans `ExpenseCategory` backend
   - **Solution** : Mapper sur `OTHER` ou ajouter `TEAM_EVENT` dans l'enum backend

2. **Status "Denied"** : Existe dans la maquette mais s'appelle `REJECTED` dans le backend
   - **Solution** : Utiliser `REJECTED` et afficher "Denied" dans l'UI

3. **Icônes Material Symbols** : Utilisées dans la maquette HTML
   - **Solution** : Soit utiliser Material Symbols via CDN, soit créer des composants SVG custom

### Améliorations Futures

1. **Pagination** : Ajouter pagination côté backend et frontend
2. **Infinite Scroll** : Alternative à la pagination
3. **Détail d'un rapport** : Page de détail avec liste des expenses
4. **Création/Édition** : Formulaires pour créer/modifier des rapports
5. **Upload de fichiers** : Intégration avec le module Attachments
6. **Notifications** : Toast pour les actions (submit, delete, etc.)
7. **Optimistic Updates** : Mise à jour UI avant confirmation backend
8. **Cache** : React Query ou SWR pour le cache et la synchronisation

---

## ✅ Checklist de Validation

- [ ] Script de seed exécuté avec succès
- [ ]