# Guide de Test - API Gestion de Notes de Frais

## 🎯 Vue d'Ensemble

Ce guide vous explique comment tester l'application backend NestJS.

---

## 📋 Prérequis

```bash
# Vérifier que les dépendances sont installées
cd backend
npm install
```

---

## 🧪 Tests Unitaires

### 1. Exécuter tous les tests

```bash
cd backend
npm run test
```

**Résultat attendu** :
```
Test Suites: 3 passed, 3 total
Tests:       20 passed, 20 total
```

### 2. Tests avec couverture

```bash
npm run test:cov
```

**Résultat attendu** :
- Coverage ≥ 80% sur tous les modules
- Rapport généré dans `backend/coverage/`

### 3. Tests en mode watch (développement)

```bash
npm run test:watch
```

### 4. Tests d'un module spécifique

```bash
# Tester uniquement le module Users
npm run test -- users

# Tester uniquement le service Users
npm run test -- users.service.spec.ts
```

---

## 🏗️ Build & Compilation

### 1. Build de production

```bash
npm run build
```

**Résultat attendu** :
- Dossier `dist/` créé
- Pas d'erreurs TypeScript

### 2. Vérifier le build

```bash
ls -la dist/
```

---

## 🚀 Démarrage de l'Application

### 1. Mode développement (avec hot-reload)

```bash
npm run start:dev
```

**Résultat attendu** :
```
[Nest] LOG [NestFactory] Starting Nest application...
[Nest] LOG [InstanceLoader] AppModule dependencies initialized
[Nest] LOG [NestApplication] Nest application successfully started
[Nest] LOG Application is running on: http://localhost:3000
```

### 2. Mode production

```bash
npm run build
npm run start:prod
```

### 3. Vérifier que l'API répond

```bash
# Health check
curl http://localhost:3000/api/health

# Swagger docs
curl http://localhost:3000/docs
```

---

## 📊 Swagger UI (Tests Manuels)

### 1. Accéder à Swagger

Ouvrir dans le navigateur :
```
http://localhost:3000/docs
```

### 2. Tester les endpoints Users

**Créer un utilisateur** :
```json
POST /api/users
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "role": "EMPLOYEE"
}
```

**Lister les utilisateurs** :
```
GET /api/users
```

**Récupérer un utilisateur** :
```
GET /api/users/{id}
```

**Modifier un utilisateur** :
```
PATCH /api/users/{id}
{
  "firstName": "Jane"
}
```

**Supprimer un utilisateur** :
```
DELETE /api/users/{id}
```

---

## 🗄️ Base de Données

### 1. Vérifier la base SQLite

```bash
# Localisation
ls -la backend/data/

# Inspecter avec sqlite3
sqlite3 backend/data/expense-management.sqlite

# Commandes SQLite utiles
.tables                    # Lister les tables
.schema users             # Voir le schéma de la table users
SELECT * FROM users;      # Voir les données
.quit                     # Quitter
```

### 2. Réinitialiser la base

```bash
# Supprimer la base
rm backend/data/expense-management.sqlite

# Redémarrer l'app (recrée la base)
npm run start:dev
```

---

## 🧹 Nettoyage

### 1. Nettoyer les fichiers générés

```bash
# Supprimer dist/
rm -rf dist/

# Supprimer coverage/
rm -rf coverage/

# Supprimer node_modules/
rm -rf node_modules/
```

### 2. Réinstaller

```bash
npm install
```

---

## 📈 Rapport de Couverture

### 1. Générer le rapport HTML

```bash
npm run test:cov
```

### 2. Ouvrir le rapport

```bash
# Ouvrir dans le navigateur
open coverage/lcov-report/index.html

# Ou avec xdg-open (Linux)
xdg-open coverage/lcov-report/index.html
```

### 3. Interpréter les résultats

**Métriques** :
- **Statements** : % de lignes exécutées
- **Branches** : % de conditions (if/else) testées
- **Functions** : % de fonctions appelées
- **Lines** : % de lignes de code couvertes

**Objectif** : ≥ 80% sur toutes les métriques

---

## 🐛 Debugging

### 1. Mode debug avec VSCode

Créer `.vscode/launch.json` :
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug NestJS",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "start:debug"],
      "cwd": "${workspaceFolder}/backend",
      "console": "integratedTerminal"
    }
  ]
}
```

### 2. Debug des tests

```bash
npm run test:debug
```

Puis ouvrir Chrome :
```
chrome://inspect
```

---

## ✅ Checklist de Validation

Avant de considérer le code prêt :

- [ ] `npm run test` → Tous les tests passent
- [ ] `npm run test:cov` → Coverage ≥ 80%
- [ ] `npm run build` → Build réussi sans erreurs
- [ ] `npm run start:dev` → Application démarre
- [ ] Swagger accessible sur `/docs`
- [ ] Health check répond sur `/api/health`
- [ ] CRUD Users fonctionnel via Swagger
- [ ] Base SQLite créée dans `data/`
- [ ] Pas d'erreurs dans les logs

---

## 🔍 Tests Avancés (Optionnel)

### 1. Tests d'intégration avec Supertest

```bash
# Créer un fichier de test e2e
# backend/test/app.e2e-spec.ts
npm run test:e2e
```

### 2. Tests de performance

```bash
# Installer autocannon
npm install -g autocannon

# Tester le endpoint health
autocannon -c 100 -d 10 http://localhost:3000/api/health
```

### 3. Linter & Formatage

```bash
# Vérifier le code
npm run lint

# Formater le code
npm run format
```

---

## 📞 Support

**Problèmes courants** :

1. **Port 3000 déjà utilisé** :
   ```bash
   # Changer le port dans .env
   PORT=3001
   ```

2. **Base de données verrouillée** :
   ```bash
   # Arrêter tous les processus Node
   pkill -f node
   ```

3. **Tests échouent** :
   ```bash
   # Nettoyer et réinstaller
   rm -rf node_modules package-lock.json
   npm install
   ```

---

**Dernière mise à jour** : 2026-02-11
