# 🚀 GUIDE DE DÉPLOIEMENT - ADAGIO

> *Comment déployer l'écosystème Adagio en production*

---

## 📊 Architecture de Déploiement

```
┌─────────────────────────────────────────────────────────────┐
│                     UTILISATEURS                              │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────────────────────┐  │
│  │  Vercel  │  │ Railway  │  │        Neon              │  │
│  │  (Web)   │  │  (API)   │  │     (PostgreSQL)          │  │
│  └──────────┘  └────┬────┘  └──────────────┬───────────┘  │
│                        │                     │                   │
│                  ┌─────┴─────┐       ┌─────┴───────┐          │
│                  │   EAS    │       │   Expo    │          │
│                  │  (Mobile) │       │  (Build)   │          │
│                  └───────────┘       └────────────┘          │
└─────────────────────────────────────────────────────────────┘
```

---

## 1. BASE DE DONNÉES - Neon (PostgreSQL)

### Création du projet

1. Allez sur [console.neon.tech](https://console.neon.tech)
2. Connecte-vous avec GitHub (recommandé)
3. Cliquez sur **"New Project"**
4. Remplissez :
   - **Name** : `adagio-db`
   - **Region** : Choisissez la plus proche (`eu-central-paris`, `us-east-1`, etc.)
   - **PostgreSQL Version** : `16`
   - **Pricing** : Starter (Free tier suffisant pour le MVP)

### Récupérer la chaîne de connexion

```bash
# Format Neon
DATABASE_URL="postgresql://adagio-user:password@ep-xxx.aws.neon.tech/adagio?sslmode=require"
```

### Exécuter les migrations

```bash
# Une fois connecté à Neon
pnpm db:generate    # Générer le client Prisma
pnpm db:migrate    # Créer les tables
pnpm db:seed        # Remplir avec les données initiales
```

---

## 2. BACKEND API - Railway.app

### Pourquoi Railway ?
- ✅ Support natif de NestJS/Node.js
- ✅ Intégration PostgreSQL facile
- CI/CD depuis GitHub inclus
- **Free tier généreux** pour les projets open-source

### Processus

#### Étape 1 : Connecter GitHub à Railway
1. Allez sur [railway.app](https://railway.app)
2. Cliquez sur **"New Project"**
3. Sélectionne **"Deploy from GitHub repo"**
4. Autorise Railway et sélectionne le repo `adagio`

#### Étape 2 : Configurer le projet
1. Sélectionnez **"Apps/api"** comme root
2. Railway détectera automatiquement le projet NestJS

#### Étape 3 : Variables d'environnement
Ajoutez les variables suivantes dans Railway :

| Variable | Valeur |
|---------|--------|
| `DATABASE_URL` | `postgresql://user:pass@ep-xxx.aws.neon.tech/adagio?sslmode=require` |
| `JWT_SECRET` | `change-me-with-openssl-rand-base64-32` |
| `NODE_ENV` | `production` |
| `PORT` | `3001` |
| `ALLOWED_ORIGINS` | `https://adagio.vercel.app` |

#### Étape 4 : Deploy
Cliquez sur **"Deploy"** → Railway va :
- Installer les dépendances (`pnpm install`)
- Builder l'application (`pnpm build`)
- Démarrer le serveur

---

## 3. FRONTEND WEB - Vercel

### Pourquoi Vercel ?
- ✅ Créateur de Next.js, support natif du framework
- **Serveur edge** mondial inclus
- Build optimisé automatique
- **Zéro configuration** avec `vercel.json`

### Processus

#### Via Dashboard
1. Allez sur [vercel.com](https://vercel.com)
2. Cliquez **"Add New Project"**
3. Sélectionne le dépôt GitHub `adagio`
4. Importez le projet

#### Configuration
1. **Root Directory** : `apps/web`
2. **Framework Preset** : Next.js (auto-détecté)
3. **Build Command** : `pnpm install && pnpm db:generate`
4. **Output Directory** : `.next`

#### Variables d'environnement

| Variable | Valeur Production |
|---------|-----------------|
| `NEXT_PUBLIC_API_URL` | `https://adagio-api-production.up.railway.app/api/v1` |
| `NEXT_PUBLIC_APP_URL` | `https://adagio.vercel.app` |

#### Domaine Custom (Optionnel)
- Dans le dashboard Vercel → Settings → Domains
- Ajoutez votre domaine : `adagio.com`
- Configurez DNS selon les instructions Vercel

---

## 4. MOBILE - Expo EAS

### Pourquoi EAS ?
- Build cloud d'Expo (pas besoin de Mac)
- Support complet de développement
- Build simultané iOS + Android
- **Essentiel pour React Native / Expo**

### Configuration

Dans `apps/mobile/app.json` :
```json
{
  "expo": {
    "ios": {
      "bundleIdentifier": "com.adagio.app"
    },
    "android": {
      "package": "com.adagio.app"
    }
  }
}
```

### Processus de Build

#### Installation EAS CLI
```bash
npm i -g eas-cli
eas login
```

#### Build iOS
```bash
cd apps/mobile
eas build --platform ios
```

#### Build Android
```bash
eas build --platform android
```

#### Publication

**iOS** :
1. Télécharge le `.ipa` depuis EAS
2. Utilisez [Transporter](https://github.com/expo/eas/tree/main/packages/transporter) pour macOS ou un service comme [AppCenter](https://appcenter.ms)
3. Soumettez à [App Store Connect](https://appstoreconnect.apple.com)

**Android** :
1. Téléchargez le `.aab`
2. Soumettez à [Google Play Console](https://play.google.com/console)

---

## 5. CORS - Communication Frontend ↔ Backend

**IMPORTANT** : Pour autoriser les requêtes Vercel → Railway, configurez CORS dans `apps/api/src/main.ts` :

```typescript
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'https://adagio.vercel.app',
      'https://*.vercel.app', // Pour les previews Vercel
      'http://localhost:3000', // Développement
    ],
    credentials: true,
  });

  // ... reste du code
}
```

---

## 6. DOMAINE DE PRODUCTION

### URLs attendues

| Service | URL |
|--------|-----|
| **Web** | `https://adagio.vercel.app` |
| **API** | `https://adagio-api-production.up.railway.app/api/v1` |
| **API Docs** | `https://adagio-api-production.up.railway.app/api/docs` |

### Configuration DNS

Pour vos propres domaines :
- **Web** : Configurez dans Vercel (Domains → Add Domain)
- **API** : Configurez dans Railway (Settings → Domains)

---

## 7. MONITORING

| Service | Outil |
|--------|------|
| **Neon** | Dashboard → Metrics (performance des requêtes) |
| **Railway** | Métriques en temps réel |
| **Vercel** | Analytics + Realtime Logs |
| **Expo** | EAS Dashboard → Build logs |

---

## 8. CHECKLIST PRÉ-DÉPLOIEMENT

### Backend
- [ ] `DATABASE_URL` connectée à Neon
- [ ] `JWT_SECRET` sécurisé (pas "change-me" !)
- [ ] CORS autorisé pour `adagio.vercel.app`
- [ ] Build local réussi : `pnpm build`
- [ ] Testé localement : `pnpm dev`

### Frontend
- [ ] `NEXT_PUBLIC_API_URL` configuré
- [ ] Build local réussi : `pnpm build`
- [ ] Page d'accueil s'affiche
- [ ] Appels API fonctionnent

### Mobile
- [ ] `EXPO_PUBLIC_API_URL` configuré
- [ ] Expo Go fonctionne en développement
- [ ] Build EAS réussi

---

## 9. WORKFLOW DE DÉPLOIEMENT

```
┌─────────────────────────────────────────────────────────────┐
│                    git push main                             │
└─────────────────────────────────────────────────────────────┘
                          │
          ┌─────────────┴─────────────┐
          │                             │
          ▼                             ▼
    ┌─────────┐                  ┌──────────┐
    │ Vercel  │                  │ Railway  │
    │ (auto)  │                  │ (auto)   │
    └────┬────┘                  └────┬─────┘
         │                            │
         └────────────┬───────────────┘
                         │
                ┌────────────┴──────────┐
                │                           │
                ▼                           ▼
          (Web: auto)              (API: auto)
```

---

## 10. DÉPLOIEMENT INITIAL

```bash
# 1. Cloner le repo (si pas déjà fait)
git clone https://github.com/yanis/adagio.git
cd adagio

# 2. Installer les dépendances
pnpm install

# 3. Configurer l'environnement
cp .env.example .env
# Éditer .env avec vos vraies valeurs

# 4. Pusher sur GitHub
git add .
git commit -m "RELEASE: Adagio - v0.1.0

- Infrastructure complète
- Monorepo Next.js + NestJS + React Native
- Prisma + Neon configuré
- Ready for deployment

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
git push

# 5. Connecter à Railway et Vercel
# Lier le repo et configurer les variables d'environnement
# Les déploiements automatiques se feront au prochain push
```

---

*Guide de déploiement v1.0 — Dernière mise à jour : 2025-03-02*
