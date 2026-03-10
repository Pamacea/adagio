# TWITTER / X THREAD

**Style:** Technical deep-dive + story time
**Structure:** Hook → Problem → Solution → Technical details → CTA
**Optimal Length:** 8-12 tweets

---

## TWEET 1 (THE HOOK)

I spent 7 hours debugging a single deployment.

Here's what building a music theory SaaS taught me about production-ready monorepos:

A thread 🧵👇

---

## TWEET 2 (THE PROBLEM)

Adagio v0.2.0 was supposed to be THE release:
✅ BetterAuth integration
✅ Achievement system (20+ badges)
✅ 18 lessons with XP rewards
✅ Full mobile app + web

Deploy time → Vercel: ❌
Railway: ❌
Vercel again: ❌

Seven attempts. Seven failures.

---

## TWEET 3 (ERROR 1 - VERCEL)

Error: "NEXT_PUBLIC_API_URL should be string"

Issue: I had the env var as an object in vercel.json (with description 🤦)

Fix: Just use a plain string value. Vercel's schema validation is stricter than you'd think.

Lesson: Read the docs. Schema matters.

---

## TWEET 4 (ERROR 2 - MODULE NOT FOUND)

Error: "Cannot find module @adagio/theory"

Issue: Next.js was building before the workspace packages were ready.

Fix: Use Turborepo's dependency graph → `pnpm turbo run build --filter=@adagio/web...`

This builds dependencies FIRST, then the app.

---

## TWEET 5 (ERROR 3 - PRISMA ON FRONTEND)

Error: "@prisma/client did not initialize yet"

Issue: I had API routes in the web app importing Prisma directly.

Fix: Frontend = client only. API routes = backend only. Separation of concerns.

The frontend now uses @adagio/auth/client → HTTP calls to Railway.

---

## TWEET 6 (THE SOLUTION - RAILWAY.JSON)

Created `railway.json`:
```json
{
  "build": {
    "buildCommand": "pnpm turbo run build --filter=@adagio/api..."
  },
  "deploy": {
    "startCommand": "cd apps/api && pnpm prisma generate && pnpm start:prod"
  }
}
```

Config > Magic.

---

## TWEET 7 (THE ARCHITECTURE)

Here's what finally worked:

🌐 Frontend: Next.js 16 on Vercel
⚙️ Backend: NestJS on Railway
🗄️ Database: PostgreSQL (Neon)
📦 Build: Turborepo monorepo
🔐 Auth: BetterAuth (social providers)

Cost? ~$20/month total.

---

## TWEET 8 (THE MONOREPO STRUCTURE)

```
adagio/
├── apps/
│   ├── web/         # Next.js frontend
│   ├── mobile/      # React Native
│   └── api/         # NestJS backend
└── packages/
    ├── theory/      # Music engine
    ├── auth/        # Auth utils
    ├── ui/          # Shared components
    └── database/    # Prisma schema
```

Workspace dependencies FTW.

---

## TWEET 9 (WHAT I LEARNED)

1️⃣ Deployment is part of the product
2️⃣ Monorepos = complexity, but worth it for code sharing
3️⃣ Frontend ≠ Backend. Keep them separate.
4️⃣ Config files (vercel.json, railway.json) are code too
5️⃣ Seven failed builds = Seven lessons learned

---

## TWEET 10 (THE RESULT)

Adagio is now LIVE and fully functional:

✅ Emotional mode mapping (feel the theory)
✅ Interactive fretboard visualization
✅ Smart composition assistant
✅ Achievement system
✅ Cross-platform sync

All because I refused to give up at attempt #7.

---

## TWEET 11 (THE ASK)

If you're building a fullstack app:
- Start with deployment in mind
- Use a monorepo if you share code
- Document EVERYTHING
- Don't give up

And if you're a guitarist who hates theory...

Try Adagio. 🎸

🔗 adagio.music

---

## TWEET 12 (CTA)

What's your worst deployment story?

Best comment gets a free Adagio Pro membership when we launch it. 👇

Follow for more indie dev + music tech content! 🚀

---

## HASHTAGS

#webdev #nextjs #railway #vercel #monorepo #fullstack #deployment #programming #sidproject #buildinpublic

---

## ENGAGEMENT TIPS

**Reply to comments with:**
- Technical clarifications
- Code snippets
- Personal anecdotes
- Encouragement for other devs

**Quote tweets:**
- Share your story
- Tag Vercel, Railway, BetterAuth
- Add your own insights

**Follow-up content:**
- Deep-dive into specific error
- Architecture breakdown video
- Tutorial on Turborepo setup
