# Expense Management API

API de gestion de notes de frais développée avec NestJS, TypeORM et SQLite.

## 🚀 Fonctionnalités

### V1 (Implémentée)
- ✅ Gestion des utilisateurs (CRUD)
- ✅ Gestion des notes de frais (CRUD + transitions de statuts)
- ✅ Gestion des dépenses (CRUD + recalcul automatique des totaux)
- ✅ Gestion des pièces jointes (upload/download/delete)
- ✅ Authentification factice (FakeAuthGuard)
- ✅ Documentation Swagger complète
- ✅ Tests unitaires avec couverture ≥80%
- ✅ Validation des données avec class-validator
- ✅ Gestion des erreurs standardisée

### V2 (Prévu)
- 🔜 Authentification JWT
- 🔜 Gestion des rôles (EMPLOYEE, MANAGER)
- 🔜 Workflow de validation manager
- 🔜 Stockage cloud des fichiers (S3, Azure Blob)
- 🔜 Notifications

## 📋 Prérequis

- Node.js >= 18
- npm >= 9

## 🛠️ Installation

```bash
# Installer les dépendances
npm install

# Copier le fichier d'environnement
cp .env.example .env
```

## 🏃 Démarrage

```bash
# Développement (avec hot-reload)
npm run dev

# Production
npm run build
npm run start:prod
```

L'application sera accessible sur :
- **API**: http://localhost:3000/api
- **Swagger**: http://localhost:3000/docs

## 🧪 Tests

```bash
# Exécuter tous les tests
npm run test

# Tests en mode watch
npm run test:watch

# Tests avec couverture
npm run test:cov

# Vérification TypeScript
npm run typecheck

# Linting
npm run lint
```

## 📚 Documentation API

### Endpoints principaux

#### Users
- `GET /api/users` - Liste des utilisateurs
- `POST /api/users` - Créer un utilisateur
- `GET /api/users/:id` - Détails d'un utilisateur
- `PATCH /api/users/:id` - Modifier un utilisateur
- `DELETE /api/users/:id` - Supprimer un utilisateur

#### Expense Reports
- `GET /api/expense-reports` - Liste des notes de frais
- `POST /api/expense-reports` - Créer une note de frais
- `GET /api/expense-reports/:id` - Détails d'une note de frais
- `PATCH /api/expense-reports/:id` - Modifier une note de frais
- `DELETE /api/expense-reports/:id` - Supprimer une note de frais
- `PATCH /api/expense-reports/:id/submit` - Soumettre une note de frais
- `PATCH /api/expense-reports/:id/validate` - Valider une note de frais (V2)
- `PATCH /api/expense-reports/:id/reject` - Rejeter une note de frais (V2)
- `PATCH /api/expense-reports/:id/pay` - Marquer comme payée
- `GET /api/expense-reports/:id/expenses` - Liste des dépenses d'une note

#### Expenses
- `GET /api/expenses` - Liste des dépenses
- `POST /api/expenses` - Créer une dépense
- `GET /api/expenses/:id` - Détails d'une dépense
- `PATCH /api/expenses/:id` - Modifier une dépense
- `DELETE /api/expenses/:id` - Supprimer une dépense

#### Attachments
- `POST /api/expenses/:expenseId/attachments` - Upload une pièce jointe
- `GET /api/expenses/:expenseId/attachments` - Liste des pièces jointes
- `GET /api/attachments/:id` - Métadonnées d'une pièce jointe
- `GET /api/attachments/:id/download` - Télécharger une pièce jointe
- `DELETE /api/attachments/:id` - Supprimer une pièce jointe

### Documentation Swagger

La documentation complète de l'API est disponible sur http://localhost:3000/docs

## 🗄️ Base de données

### Schéma

```
User (1) ──→ (N) ExpenseReport (1) ──→ (N) Expense (1) ──→ (N) Attachment
```

### Entités

- **User**: Utilisateurs du système
- **ExpenseReport**: Notes de frais
- **Expense**: Dépenses individuelles
- **Attachment**: Pièces jointes (fichiers)

### Migrations

En développement, la synchronisation automatique est activée (`synchronize: true`).

⚠️ **En production**, désactiver `synchronize` et utiliser les migrations TypeORM.

## 📁 Structure du projet

```
backend/
├── src/
│   ├── common/              # Code partagé (enums, DTOs, guards, etc.)
│   ├── config/              # Configuration (database, app, swagger)
│   ├── database/            # Module database
│   ├── health/              # Health check
│   ├── users/               # Module Users
│   ├── expense-reports/     # Module ExpenseReports
│   ├── expenses/            # Module Expenses
│   ├── attachments/         # Module Attachments
│   ├── app.module.ts        # Module racine
│   └── main.ts              # Point d'entrée
├── data/                    # Base de données SQLite
├── uploads/                 # Fichiers uploadés
├── test/                    # Tests e2e
└── coverage/                # Rapports de couverture
```

## 🔒 Règles métier

### Statuts des notes de frais

```
CREATED → SUBMITTED → VALIDATED → PAID
              ↓
          REJECTED → CREATED (reopen)
```

### Règles de modification

- **CREATED**: Modification et suppression autorisées
- **SUBMITTED**: Modification autorisée, suppression interdite
- **VALIDATED/REJECTED/PAID**: Aucune modification autorisée

### Calcul automatique

Le `totalAmount` d'une note de frais est automatiquement recalculé lors de :
- Création d'une dépense
- Modification du montant d'une dépense
- Suppression d'une dépense

### Upload de fichiers

- **Taille max**: 5MB
- **Types autorisés**: image/jpeg, image/png, application/pdf
- **Stockage**: `uploads/<expenseId>/<uuid>.<ext>`

## 🔧 Configuration

### Variables d'environnement

Voir `.env.example` pour la liste complète des variables.

Variables principales :
- `PORT`: Port de l'application (défaut: 3000)
- `DB_DATABASE`: Chemin de la base SQLite
- `UPLOAD_DIR`: Répertoire des uploads
- `MAX_FILE_SIZE`: Taille max des fichiers (bytes)
- `ALLOWED_MIME_TYPES`: Types MIME autorisés

## 📊 Couverture de code

Objectif : **≥80% de couverture**

```bash
npm run test:cov
```

Le rapport de couverture est généré dans `coverage/`.

## 🏗️ Architecture

L'architecture suit les principes NestJS :

- **Modularité**: Chaque domaine métier = 1 module
- **Injection de dépendances**: Services injectés via constructeur
- **Séparation des responsabilités**: Controllers → Services → Repositories
- **Type safety**: TypeScript strict mode
- **Validation**: DTOs avec class-validator
- **Documentation**: Swagger decorators

## 🤝 Contribution

1. Créer une branche feature
2. Implémenter les changements
3. Ajouter/mettre à jour les tests
4. Vérifier la couverture (`npm run test:cov`)
5. Vérifier le linting (`npm run lint`)
6. Créer une Pull Request

## 📝 License

MIT

## 👥 Auteurs

Développé dans le cadre du projet de gestion de notes de frais.

---

**Version**: 1.0.0  
**Date**: 2026-02-11
