# Guide de démarrage rapide - API Gestion de Notes de Frais

## 🚀 Démarrage en 3 étapes

### 1. Installation

```bash
cd backend
npm install
```

### 2. Configuration

Le fichier `.env` est déjà configuré avec les valeurs par défaut. Pas besoin de modification pour le développement.

### 3. Lancement

```bash
npm run dev
```

✅ L'API est maintenant accessible sur http://localhost:3000

## 📚 Accéder à la documentation

Ouvrez votre navigateur sur : **http://localhost:3000/docs**

Vous verrez l'interface Swagger avec tous les endpoints documentés et testables.

## 🧪 Tester l'API

### Option 1 : Via Swagger UI (Recommandé)

1. Allez sur http://localhost:3000/docs
2. Cliquez sur un endpoint
3. Cliquez sur "Try it out"
4. Remplissez les paramètres
5. Cliquez sur "Execute"

### Option 2 : Via cURL

#### Créer un utilisateur

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com"
  }'
```

#### Créer une note de frais

```bash
curl -X POST http://localhost:3000/api/expense-reports \
  -H "Content-Type: application/json" \
  -d '{
    "purpose": "Déplacement professionnel Paris",
    "reportDate": "2026-02-15",
    "userId": "REMPLACER_PAR_ID_USER"
  }'
```

#### Créer une dépense

```bash
curl -X POST http://localhost:3000/api/expenses \
  -H "Content-Type: application/json" \
  -d '{
    "reportId": "REMPLACER_PAR_ID_REPORT",
    "category": "TRAVEL",
    "expenseName": "Billet de train",
    "description": "Paris - Lyon",
    "amount": 125.50,
    "expenseDate": "2026-02-15"
  }'
```

#### Upload une pièce jointe

```bash
curl -X POST http://localhost:3000/api/expenses/EXPENSE_ID/attachments \
  -F "file=@/chemin/vers/fichier.pdf"
```

#### Soumettre une note de frais

```bash
curl -X PATCH http://localhost:3000/api/expense-reports/REPORT_ID/submit
```

## 📊 Workflow complet

### Scénario : Créer une note de frais complète

1. **Créer un utilisateur**
   ```
   POST /api/users
   ```

2. **Créer une note de frais**
   ```
   POST /api/expense-reports
   ```

3. **Ajouter des dépenses**
   ```
   POST /api/expenses (répéter pour chaque dépense)
   ```

4. **Upload des justificatifs**
   ```
   POST /api/expenses/:expenseId/attachments (pour chaque dépense)
   ```

5. **Vérifier le total**
   ```
   GET /api/expense-reports/:id
   ```
   Le `totalAmount` est calculé automatiquement !

6. **Soumettre la note**
   ```
   PATCH /api/expense-reports/:id/submit
   ```

7. **Marquer comme payée**
   ```
   PATCH /api/expense-reports/:id/pay
   ```

## 🔍 Endpoints utiles

### Health Check
```bash
curl http://localhost:3000/api/health
```

### Lister toutes les notes de frais
```bash
curl http://localhost:3000/api/expense-reports
```

### Lister avec filtres
```bash
# Par utilisateur
curl "http://localhost:3000/api/expense-reports?userId=USER_ID"

# Par statut
curl "http://localhost:3000/api/expense-reports?status=SUBMITTED"

# Par période
curl "http://localhost:3000/api/expense-reports?dateFrom=2026-02-01&dateTo=2026-02-28"

# Avec pagination
curl "http://localhost:3000/api/expense-reports?page=1&limit=10"
```

### Lister les dépenses d'une note
```bash
curl http://localhost:3000/api/expense-reports/REPORT_ID/expenses
```

### Télécharger une pièce jointe
```bash
curl http://localhost:3000/api/attachments/ATTACHMENT_ID/download -o fichier.pdf
```

## 🎯 Statuts et transitions

### Statuts disponibles

- **CREATED**: Brouillon (modifiable)
- **SUBMITTED**: Soumis (modifiable)
- **VALIDATED**: Validé (non modifiable) - V2
- **REJECTED**: Rejeté (non modifiable) - V2
- **PAID**: Payé (non modifiable)

### Transitions autorisées

```
CREATED ──submit()──> SUBMITTED ──pay()──> PAID
                          │
                          └──validate()──> VALIDATED ──pay()──> PAID (V2)
                          │
                          └──reject()──> REJECTED (V2)
```

## 🧪 Lancer les tests

```bash
# Tous les tests
npm run test

# Avec couverture
npm run test:cov

# En mode watch
npm run test:watch
```

## 📁 Base de données

La base de données SQLite est créée automatiquement dans `data/expense-management.sqlite`.

Pour la réinitialiser :
```bash
rm data/expense-management.sqlite
npm run dev  # Recrée la base automatiquement
```

## 🐛 Dépannage

### L'application ne démarre pas

1. Vérifier que le port 3000 est libre
2. Vérifier que Node.js >= 18 est installé
3. Supprimer `node_modules` et réinstaller : `rm -rf node_modules && npm install`

### Erreur de base de données

1. Supprimer le fichier SQLite : `rm data/expense-management.sqlite`
2. Redémarrer l'application

### Les tests échouent

1. Vérifier que toutes les dépendances sont installées
2. Lancer `npm run build` pour vérifier la compilation

## 📖 Documentation complète

- **README.md**: Documentation complète du projet
- **ARCHITECTURE_GESTION_NOTES_FRAIS.md**: Architecture détaillée
- **Swagger**: http://localhost:3000/docs

## 💡 Astuces

### Activer les logs SQL

Dans `.env`, modifier :
```env
DB_LOGGING=true
```

### Changer le port

Dans `.env`, modifier :
```env
PORT=4000
```

### Augmenter la taille max des fichiers

Dans `.env`, modifier :
```env
MAX_FILE_SIZE=10485760  # 10MB en bytes
```

---

**Besoin d'aide ?** Consultez la documentation Swagger ou le README.md
