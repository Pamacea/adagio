# BLOG POST - Technical Deep-Dive

**Title:** "How I Fixed My Monorepo Builds: A Vercel + Railway Survival Guide"
**Reading Time:** 8-10 minutes
**Published On:** dev.to, Hashnode, Medium

---

## Introduction

If you've ever tried to deploy a monorepo to multiple platforms, you know the pain. Your local build works perfectly. CI passes everything. But when you push to production?

💀 **Build failed.**

In this article, I'll walk you through how I fixed my Adagio music theory platform's deployment pipeline - a Next.js frontend on Vercel, NestJS backend on Railway, shared packages, and the seven deployment failures that taught me everything about production-ready monorepos.

---

## The Setup: What We're Working With

### Architecture Overview

**Adagio** is a harmonic atlas for guitarists - a SaaS platform that makes music theory intuitive through emotional mappings and interactive visualizations.

Here's the stack:

```
Frontend:  Next.js 16 + React 19 → Vercel
Backend:   NestJS + Prisma     → Railway
Mobile:    React Native + Expo → (not deployed yet)
Database:  PostgreSQL (Neon) → Railway
Build:     Turborepo
```

### Monorepo Structure

```
adagio/
├── apps/
│   ├── web/              # Next.js frontend
│   ├── mobile/           # React Native app
│   └── api/              # NestJS backend
├── packages/
│   ├── theory/           # Music theory engine
│   ├── auth/             # Authentication utilities
│   ├── database/         # Prisma schema
│   ├── types/            # Shared TypeScript types
│   ├── ui/               # Shared components
│   └── api-client/       # HTTP client
└── pnpm-workspace.yaml
```

### The Challenge

The `@adagio/theory` package needs to be built BEFORE `apps/web` can import it. The `@adagio/auth` package needs Prisma Client generated. The frontend needs `@adagio/auth/client` (no Prisma) while the backend needs `@adagio/auth` (with Prisma).

**Dependencies everywhere.**

---

## Failure #1: Vercel Schema Validation

**Error:**
```
The `vercel.json` schema validation failed with the following message:
`env.NEXT_PUBLIC_API_URL` should be string
```

**What I Did Wrong:**

My `apps/web/vercel.json` looked like this:

```json
{
  "env": {
    "NEXT_PUBLIC_API_URL": {
      "description": "API URL for production",
      "value": "https://adagio-api.railway.app"
    }
  }
}
```

This format works locally... but Vercel's schema validator expects plain strings.

**The Fix:**

```json
{
  "build": {
    "env": {
      "NEXT_PUBLIC_API_URL": "https://adagio-api.railway.app"
    }
  }
}
```

**Lesson:** Platform configs have schemas. Read them.

---

## Failure #2: Module Not Found - @adagio/theory

**Error:**
```
Module not found: Can't resolve '@adagio/theory'
```

**What Happened:**

Vercel was running `pnpm build` (Next.js build) without first building the workspace packages. `@adagio/theory` didn't have a `dist/` folder.

**The Fix:**

Changed the build command to use Turborepo's dependency graph:

```json
{
  "buildCommand": "cd ../.. && pnpm turbo run build --filter=@adagio/web..."
}
```

This tells Turbo: "Build `@adagio/web` AND all its dependencies first."

**Turbo.json Configuration:**

```json
{
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "dist/**"]
    }
  }
}
```

The `^build` means "run build in all dependencies first."

**Lesson:** In monorepos, build order matters.

---

## Failure #3: Prisma on the Frontend

**Error:**
```
@prisma/client did not initialize yet. Please run "prisma generate"
```

**What Happened:**

I had API routes in `apps/web/app/api/auth/[...all]/route.ts` that imported:

```typescript
import { auth } from '@adagio/auth';
```

But `@adagio/auth/server.ts` uses Prisma:

```typescript
import { prisma } from '@adagio/database';
export const auth = betterAuth({
  database: prismaAdapter(prisma)
});
```

Vercel (frontend deployment) doesn't have Prisma generated.

**The Fix:**

Removed `apps/web/app/api/` entirely. The frontend should only use `@adagio/auth/client`:

```typescript
import { authClient, useSession } from '@adagio/auth/client';
```

API routes belong on the backend (Railway), not the frontend.

**Lesson:** Frontend = client only. Backend = server + database.

---

## Failure #4: Railway Build Command

**Error:**
```
Command "pnpm --filter @adagio/api build" exited with 1
```

**What Happened:**

Railway's default build command was running the API's build script:

```json
"build": "turbo run build --filter=@adagio/api..."
```

But Railway wasn't finding the workspace dependencies correctly.

**The Fix:**

Created a `railway.json` at the monorepo root:

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "pnpm turbo run build --filter=@adagio/api..."
  },
  "deploy": {
    "startCommand": "cd apps/api && pnpm prisma generate && pnpm start:prod"
  }
}
```

This ensures:
1. Workspace packages build first
2. Prisma generates before starting
3. Start from the correct directory

**Lesson:** Platform-specific config files are your friend.

---

## The Working Solution

After 7 attempts, here's what finally worked:

### Vercel (Frontend)

**`apps/web/vercel.json`:**
```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "buildCommand": "cd ../.. && pnpm turbo run build --filter=@adagio/web...",
  "installCommand": "pnpm install",
  "framework": "nextjs",
  "outputDirectory": ".next"
}
```

### Railway (Backend)

**`railway.json` (root):**
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "pnpm turbo run build --filter=@adagio/api..."
  },
  "deploy": {
    "startCommand": "cd apps/api && pnpm prisma generate && pnpm start:prod"
  }
}
```

### Package Dependencies

**`apps/api/package.json`:**
```json
{
  "scripts": {
    "build": "turbo run build --filter=@adagio/api...",
    "build:nest": "nest build"
  },
  "devDependencies": {
    "turbo": "^2.3.3"
  }
}
```

**`packages/theory/package.json`:**
```json
{
  "scripts": {
    "build": "tsup"
  }
}
```

---

## Key Takeaways

### 1. Dependency Order Matters

In a monorepo, packages depend on each other. Turborepo handles this with `^build` dependencies:

```json
{
  "tasks": {
    "build": {
      "dependsOn": ["^build"]
    }
  }
}
```

### 2. Separation of Concerns

- **Frontend (Vercel)**: UI, client-side auth, NO Prisma
- **Backend (Railway)**: API, database, server-side auth

### 3. Platform Config is Code

`vercel.json`, `railway.json`, `.gitignore` - these are part of your application. Treat them as such.

### 4. Document Everything

Every error I solved, I documented. That's how I wrote this article.

### 5. Keep Trying

7 failed builds. 1 success. Ship it.

---

## What's Next?

Adagio is now live at [adagio.music](https://adagio.music). The deployment pipeline works smoothly, and I can ship updates to both frontend and backend with a single `git push`.

**Current Status:**
- ✅ v0.2.0 released (BetterAuth, achievements, lessons)
- ✅ v0.2.1 released (deployment fixes)
- ✅ v0.2.2 released (analytics, UX improvements)
- 🔄 v0.3.0 in progress (native mobile apps)

---

## Resources

If you're building something similar, check out:

- [Turborepo Documentation](https://turbo.build/repo/docs)
- [Vercel Monorepo Guide](https://vercel.com/docs/concepts/monorepos)
- [Railway Config Files](https://docs.railway.app/deploy/config-as-code)
- [BetterAuth](https://www.better-auth.com)

---

**Have you battled monorepo deployments? Share your war stories in the comments! 🚀**

*Published: March 10, 2026*
*Tags: #nextjs #railway #vercel #monorepo #deployment #fullstack*

---

## PROMOTIONAL BLURB (for social sharing)

🔥 **NEW:** "Fixed my monorepo deployments after 7 failed attempts. Here's everything I learned about Vercel + Railway + Turborepo."

📖 Full guide: [Link to blog post]

💬 What's YOUR worst deployment story?
