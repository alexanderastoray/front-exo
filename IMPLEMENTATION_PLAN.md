# Plan d'Implémentation - Interface Expense Reports

## 📋 Résumé Exécutif

Ce document détaille le plan d'implémentation complet pour créer l'interface "Expense Reports" basée sur la maquette HTML fournie. L'architecture complète est documentée dans [`EXPENSE_REPORTS_FRONTEND_ARCHITECTURE.md`](EXPENSE_REPORTS_FRONTEND_ARCHITECTURE.md).

---

## 🎯 Objectifs

1. ✅ **Architecture définie** - Document complet créé
2. 🔄 **Script de seed** - Peupler la base de données avec les 4 rapports de la maquette
3. 🔄 **Composants réutilisables** - Icônes, badges, boutons pour réutilisation
4. 🔄 **Hooks personnalisés** - Logique métier séparée des composants
5. 🔄 **Page principale** - Interface complète avec filtres et recherche
6. 🔄 **Intégration backend** - API client et types TypeScript
7. 🔄 **Tests** - Validation de l'interface complète

---

## 📦 Fichiers à Créer

### Backend (Script de Seed)

```
backend/src/database/seeds/
├── expense-reports.seed.ts          # Fonction de seed principale
└── run-seed.ts                      # Script d'exécution
```

**Commande NPM à ajouter** : `"seed": "ts-node src/database/seeds/run-seed.ts"`

---

### Frontend - Structure Complète

```
frontend/src/
├── types/
│   ├── expense-report.types.ts      # Types pour ExpenseReport, Expense
│   └── filter.types.ts              # Types pour FilterState
│
├── constants/
│   ├── categories.ts                # Enum ExpenseCategory
│   ├── statuses.ts                  # Enum ReportStatus
│   └── icons.ts                     # Mapping catégories → icônes
│
├── utils/
│   ├── date.utils.ts                # formatDate()
│   ├── currency.utils.ts            # formatCurrency()
│   └── category.utils.ts            # getCategoryIcon(), getCategoryLabel()
│
├── api/
│   └── expense-reports.api.ts       # API client pour /expense-reports
│
├── hooks/
│   ├── useDebounce.ts               # Hook générique debounce
│   ├── useExpenseReports.ts         # Fetch et gestion des reports
│   ├── useFilters.ts                # Gestion des filtres et tri
│   └── useSearch.ts                 # Recherche textuelle
│
├── components/
│   ├── common/
│   │   ├── Badge.tsx                # Badge de status (réutilisable)
│   │   ├── CategoryIcon.tsx         # Icône de catégorie (réutilisable)
│   │   ├── SearchInput.tsx          # Input de recherche (réutilisable)
│   │   ├── FilterPill.tsx           # Pill de filtre actif (réutilisable)
│   │   ├── Button.tsx               # Bouton générique (réutilisable)
│   │   ├── IconButton.tsx           # Bouton avec icône (réutilisable)
│   │   └── Modal.tsx                # Modal générique (réutilisable)
│   │
│   ├── expense-reports/
│   │   ├── ExpenseReportCard.tsx    # Card d'un rapport
│   │   ├── ExpenseReportList.tsx    # Liste de rapports
│   │   ├── ActiveFilters.tsx        # Pills de filtres actifs
│   │   ├── FilterModal.tsx          # Modal de filtres
│   │   └── ExpenseReportHeader.tsx  # Header avec bouton +
│   │
│   └── layout/
│       ├── Header.tsx               # Header générique
│       ├── Footer.tsx               # Footer navigation
│       └── Layout.tsx               # Layout principal
│
└── pages/
    ├── ExpenseReportsPage.tsx       # Page principale
    ├── SubmitExpensePage.tsx        # Placeholder pour soumission
    └── ProfilePage.tsx              # Placeholder pour profil
```

**Total** : ~30 fichiers à créer

---

## 🔧 Détails d'Implémentation

### 1. Script de Seed (Backend)

#### Données à Insérer

**Utilisateur** :
- Email: `john.doe@example.com`
- Nom: John Doe
- Rôle: EMPLOYEE

**Rapport 1** : Q4 Client On-site
- Date: 2023-10-26
- Montant: $175.00
- Status: SUBMITTED
- Expenses:
  - Meals ($85) - "Client Lunch"
  - Travel ($90) - "Flight to Client Site"

**Rapport 2** : October Office Supplies
- Date: 2023-10-24
- Montant: $75.00
- Status: VALIDATED
- Expenses:
  - Office Supplies ($75) - "Office Supplies"

**Rapport 3** : Team Offsite Event
- Date: 2023-10-22
- Montant: $215.00
- Status: PAID
- Payment Date: 2023-10-30
- Expenses:
  - Other ($180) - "Team Building Activity"
  - Transport ($35) - "Parking"

**Rapport 4** : Commute & Meals
- Date: 2023-10-21
- Montant: $40.00
- Status: CREATED
- Expenses:
  - Transport ($15) - "Parking"
  - Meals ($25) - "Lunch"

---

### 2. Types TypeScript

#### ExpenseReport Interface

```typescript
interface ExpenseReport {
  id: string;
  purpose: string;
  reportDate: string;
  totalAmount: number;
  status: ReportStatus;
  paymentDate: string | null;
  userId: string;
  expenses?: Expense[];
  createdAt: string;
  updatedAt: string;
}
```

#### FilterState Interface

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
```

---

### 3. Composants Réutilisables

#### Badge.tsx
- Props: `status`, `size`
- Couleurs selon le status (Created, Submitted, Validated, Paid, Rejected)
- Utilisable dans d'autres écrans

#### CategoryIcon.tsx
- Props: `category`, `size`, `className`
- Mapping catégorie → icône Material Symbols
- Utilisable dans filtres, cards, détails

#### SearchInput.tsx
- Props: `value`, `onChange`, `placeholder`
- Icône de recherche intégrée
- Utilisable dans d'autres listes

#### FilterPill.tsx
- Props: `label`, `onRemove`
- Pill avec icône close
- Utilisable pour tous types de filtres

---

### 4. Hooks Personnalisés

#### useExpenseReports()
```typescript
const { reports, loading, error, refetch } = useExpenseReports();
```
- Fetch depuis `/api/expense-reports?include=expenses`
- Gestion du loading et des erreurs
- Fonction de refresh

#### useFilters()
```typescript
const {
  filters,
  setFilter,
  clearFilters,
  applyFilters,
  activeFilterCount
} = useFilters();
```
- État des filtres
- Application sur les données
- Tri (date/amount, asc/desc)

#### useSearch()
```typescript
const {
  searchTerm,
  setSearchTerm,
  debouncedSearchTerm,
  applySearch
} = useSearch();
```
- Recherche textuelle avec debounce
- Filtrage sur `purpose` et `description`

---

### 5. Page Principale

#### ExpenseReportsPage.tsx

**Structure** :
```tsx
<Layout>
  <ExpenseReportHeader onCreateClick={...} />
  
  <SearchInput value={...} onChange={...} />
  
  <Button onClick={openFilterModal}>Filter & Sort</Button>
  
  <ActiveFilters filters={...} onRemove={...} />
  
  {loading ? (
    <LoadingSpinner />
  ) : (
    <ExpenseReportList reports={filteredReports} />
  )}
  
  <FilterModal
    isOpen={...}
    onClose={...}
    filters={...}
    onApply={...}
  />
</Layout>
```

**Logique** :
1. Fetch des reports avec `useExpenseReports()`
2. Application des filtres avec `useFilters()`
3. Application de la recherche avec `useSearch()`
4. Affichage de la liste filtrée et triée

---

## 🚀 Ordre d'Implémentation Recommandé

### Phase 1 : Backend (30 min)
1. ✅ Créer `expense-reports.seed.ts`
2. ✅ Créer `run-seed.ts`
3. ✅ Ajouter script NPM
4. ✅ Exécuter le seed
5. ✅ Vérifier via Swagger

### Phase 2 : Types & Constants (20 min)
1. ✅ `types/expense-report.types.ts`
2. ✅ `types/filter.types.ts`
3. ✅ `constants/categories.ts`
4. ✅ `constants/statuses.ts`
5. ✅ `constants/icons.ts`

### Phase 3 : Utilitaires (15 min)
1. ✅ `utils/date.utils.ts`
2. ✅ `utils/currency.utils.ts`
3. ✅ `utils/category.utils.ts`

### Phase 4 : API Client (10 min)
1. ✅ `api/expense-reports.api.ts`

### Phase 5 : Hooks (45 min)
1. ✅ `hooks/useDebounce.ts`
2. ✅ `hooks/useExpenseReports.ts`
3. ✅ `hooks/useFilters.ts`
4. ✅ `hooks/useSearch.ts`

### Phase 6 : Composants Réutilisables (1h30)
1. ✅ `components/common/Badge.tsx`
2. ✅ `components/common/CategoryIcon.tsx`
3. ✅ `components/common/SearchInput.tsx`
4. ✅ `components/common/FilterPill.tsx`
5. ✅ `components/common/Button.tsx`
6. ✅ `components/common/IconButton.tsx`
7. ✅ `components/common/Modal.tsx`

### Phase 7 : Composants Spécifiques (1h30)
1. ✅ `components/expense-reports/ExpenseReportCard.tsx`
2. ✅ `components/expense-reports/ExpenseReportList.tsx`
3. ✅ `components/expense-reports/ActiveFilters.tsx`
4. ✅ `components/expense-reports/FilterModal.tsx`
5. ✅ `components/expense-reports/ExpenseReportHeader.tsx`

### Phase 8 : Layout (45 min)
1. ✅ `components/layout/Header.tsx`
2. ✅ `components/layout/Footer.tsx`
3. ✅ `components/layout/Layout.tsx`

### Phase 9 : Pages (1h)
1. ✅ `pages/ExpenseReportsPage.tsx`
2. ✅ `pages/SubmitExpensePage.tsx` (placeholder)
3. ✅ `pages/ProfilePage.tsx` (placeholder)
4. ✅ Mettre à jour `App.tsx` avec routing

### Phase 10 : Tests & Ajustements (1h)
1. ✅ Tester l'affichage de la liste
2. ✅ Tester les filtres
3. ✅ Tester la recherche
4. ✅ Tester le responsive
5. ✅ Tester le dark mode
6. ✅ Ajuster les styles

**Temps total estimé** : ~7-8 heures

---

## 🔍 Points d'Attention

### 1. Mapping Catégories

La maquette utilise des catégories qui ne correspondent pas exactement au backend :

| Maquette | Backend Enum | Solution |
|----------|--------------|----------|
| Team Event | `OTHER` | Mapper sur OTHER |
| Parking | `TRANSPORT` | OK |
| Meals | `MEALS` | OK |
| Travel | `TRAVEL` | OK |
| Supplies | `OFFICE_SUPPLIES` | OK |

### 2. Status "Denied" vs "Rejected"

- Maquette : "Denied"
- Backend : `REJECTED`
- **Solution** : Utiliser `REJECTED` en backend, afficher "Denied" en frontend

### 3. Icônes Material Symbols

La maquette utilise Material Symbols via CDN. Options :
- **Option A** : Utiliser le CDN (déjà dans la maquette)
- **Option B** : Créer des composants SVG custom
- **Option C** : Utiliser `@heroicons/react`

**Recommandation** : Option A (CDN) pour la rapidité

### 4. Calcul des Catégories

Les catégories affichées dans les cards sont extraites des `expenses` :
```typescript
const categories = [...new Set(report.expenses?.map(e => e.category))];
```

### 5. Filtres Initiaux

La maquette affiche 2 filtres actifs par défaut :
- Status: Submitted
- Amount: High to Low

**Solution** : Initialiser `FilterState` avec ces valeurs par défaut

---

## 📝 Checklist de Validation

### Backend
- [ ] Script de seed créé
- [ ] Script exécuté avec succès
- [ ] 4 rapports créés dans la DB
- [ ] Vérification via Swagger `/api/expense-reports`

### Frontend - Types & Utils
- [ ] Types TypeScript créés
- [ ] Constants créés
- [ ] Utilitaires créés et testés

### Frontend - Hooks
- [ ] `useDebounce` fonctionne
- [ ] `useExpenseReports` fetch les données
- [ ] `useFilters` applique les filtres correctement
- [ ] `useSearch` filtre par texte

### Frontend - Composants
- [ ] Badge affiche les bonnes couleurs
- [ ] CategoryIcon affiche les bonnes icônes
- [ ] SearchInput fonctionne
- [ ] FilterPill affiche et supprime
- [ ] Modal s'ouvre et se ferme

### Frontend - Page
- [ ] Liste affiche les 4 rapports
- [ ] Filtres fonctionnent
- [ ] Recherche fonctionne
- [ ] Tri fonctionne
- [ ] Responsive OK
- [ ] Dark mode OK

---

## 🎨 Exemples de Code

### Exemple : ExpenseReportCard.tsx

```tsx
interface ExpenseReportCardProps {
  report: ExpenseReport;
  onClick?: () => void;
}

export const ExpenseReportCard: React.FC<ExpenseReportCardProps> = ({
  report,
  onClick
}) => {
  const categories = [...new Set(report.expenses?.map(e => e.category) || [])];

  return (
    <div
      className="bg-white dark:bg-background-dark/50 p-4 rounded-xl shadow-sm space-y-3 cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-foreground-light dark:text-foreground-dark font-semibold">
            {report.purpose}
          </p>
          <p className="text-sm text-muted-light dark:text-muted-dark">
            {formatDate(report.reportDate)}
          </p>
        </div>
        <p className="text-lg font-bold text-primary">
          {formatCurrency(report.totalAmount)}
        </p>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {categories.map(category => (
            <CategoryIcon key={category} category={category} />
          ))}
        </div>
        <Badge status={report.status} />
      </div>
    </div>
  );
};
```

---

### Exemple : useFilters Hook

```tsx
export const useFilters = () => {
  const [filters, setFilters] = useState<FilterState>({
    status: [ReportStatus.SUBMITTED], // Filtre par défaut
    dateFrom: null,
    dateTo: null,
    amountMin: 0,
    amountMax: 1000,
    categories: [],
    sortBy: 'amount',
    sortOrder: 'desc', // High to Low par défaut
  });

  const setFilter = (key: keyof FilterState, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      status: [],
      dateFrom: null,
      dateTo: null,
      amountMin: 0,
      amountMax: 1000,
      categories: [],
      sortBy: 'date',
      sortOrder: 'desc',
    });
  };

  const applyFilters = (reports: ExpenseReport[]): ExpenseReport[] => {
    let filtered = [...reports];

    // Filtre par status
    if (filters.status.length > 0) {
      filtered = filtered.filter(r => filters.status.includes(r.status));
    }

    // Filtre par date
    if (filters.dateFrom) {
      filtered = filtered.filter(r => new Date(r.reportDate) >= filters.dateFrom!);
    }
    if (filters.dateTo) {
      filtered = filtered.filter(r => new Date(r.reportDate) <= filters.dateTo!);
    }

    // Filtre par montant
    filtered = filtered.filter(
      r => r.totalAmount >= filters.amountMin && r.totalAmount <= filters.amountMax
    );

    // Filtre par catégories
    if (filters.categories.length > 0) {
      filtered = filtered.filter(r =>
        r.expenses?.some(e => filters.categories.includes(e.category))
      );
    }

    // Tri
    filtered.sort((a, b) => {
      const aValue = filters.sortBy === 'date' ? new Date(a.reportDate).getTime() : a.totalAmount;
      const bValue = filters.sortBy === 'date' ? new Date(b.reportDate).getTime() : b.totalAmount;
      return filters.sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    });

    return filtered;
  };

  const activeFilterCount = [
    filters.status.length > 0,
    filters.dateFrom !== null,
    filters.dateTo !== null,
    filters.amountMin > 0 || filters.amountMax < 1000,
    filters.categories.length > 0,
  ].filter(Boolean).length;

  return {
    filters,
    setFilter,
    clearFilters,
    applyFilters,
    activeFilterCount,
  };
};
```

---

## 🚦 Prochaines Étapes

1. **Valider l'architecture** avec vous
2. **Passer en mode Code** pour l'implémentation
3. **Commencer par le script de seed** (backend)
4. **Implémenter le frontend** phase par phase
5. **Tester et ajuster** l'interface

---

## ❓ Questions pour Vous

Avant de commencer l'implémentation, j'ai quelques questions :

1. **Catégorie "Team Event"** : Voulez-vous que j'ajoute `TEAM_EVENT` dans l'enum backend, ou mapper sur `OTHER` ?

2. **Icônes** : Préférez-vous Material Symbols (CDN), Heroicons, ou des SVG custom ?

3. **Routing** : Voulez-vous utiliser React Router, ou simplement des états pour naviguer entre les pages ?

4. **Tests** : Voulez-vous que je crée des tests unitaires pour les composants et hooks ?

5. **Autres écrans** : Voulez-vous que je crée des placeholders fonctionnels pour "Submit" et "Profile", ou juste des pages vides ?

---

## 📚 Ressources

- **Architecture complète** : [`EXPENSE_REPORTS_FRONTEND_ARCHITECTURE.md`](EXPENSE_REPORTS_FRONTEND_ARCHITECTURE.md)
- **Backend existant** : [`backend/src/expense-reports/`](backend/src/expense-reports/)
- **Frontend existant** : [`frontend/src/`](frontend/src/)
- **Maquette HTML** : Fournie dans votre message

---

**Prêt à passer en mode Code pour l'implémentation !** 🚀
