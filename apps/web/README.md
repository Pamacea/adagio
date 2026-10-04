# Adagio Web App - Structure

## Overview

The Adagio web application has been completely rebuilt with the following structure.

## Pages Created

### Public Pages

- **`/`** - Landing page with hero, features, and CTA sections
- **`/login`** - Authentication page with email/password
- **`/register`** - Registration page with name, email, password

### Protected Pages (require authentication)

- **`/dashboard`** - User dashboard with level progress, stats, and quick actions
- **`/theory`** - Theory hub with navigation to sub-pages
- **`/theory/circle-of-fifths`** - Interactive circle of fifths visualization
- **`/theory/modes`** - Modes explorer with feeling filters
- **`/theory/progressions`** - Chord progression analyzer and common progressions
- **`/compose`** - Chord progression composer with templates
- **`/grimoire`** - Personal library of saved progressions
- **`/user/profile`** - User profile with preferences and settings

## Structure

```
apps/web/
├── app/
│   ├── layout.tsx          # Root layout with providers
│   ├── page.tsx            # Landing page
│   ├── providers.tsx       # TanStack Query provider
│   ├── globals.css         # Global styles and utility classes
│   ├── login/
│   │   └── page.tsx
│   ├── register/
│   │   └── page.tsx
│   ├── dashboard/
│   │   ├── layout.tsx      # Dashboard layout with nav
│   │   └── page.tsx
│   ├── theory/
│   │   ├── page.tsx
│   │   ├── circle-of-fifths/
│   │   │   └── page.tsx
│   │   ├── modes/
│   │   │   └── page.tsx
│   │   └── progressions/
│   │       └── page.tsx
│   ├── compose/
│   │   └── page.tsx
│   ├── grimoire/
│   │   └── page.tsx
│   └── user/
│       └── profile/
│           └── page.tsx
├── components/
│   ├── dashboard-nav.tsx   # Navigation component
│   └── index.ts
├── lib/
│   ├── constants.ts        # App routes and music constants
│   ├── utils.ts            # Utility functions (cn, formatDate, etc.)
│   ├── hooks/
│   │   ├── use-auth.ts     # Authentication hooks (better-auth)
│   │   ├── use-user.ts     # User profile and progress hooks
│   │   └── use-query.ts    # API query hooks
│   └── index.ts
├── middleware.ts           # Auth protection for routes
├── tailwind.config.ts      # Tailwind CSS configuration
└── next.config.ts          # Next.js configuration
```

## Key Features

### Authentication

- Uses `better-auth` for authentication
- Session management via cookies
- Protected routes via middleware
- Sign in/up flows with proper error handling

### State Management

- TanStack Query for server state
- Optimistic updates for mutations
- Proper cache invalidation

### Styling

- Tailwind CSS with custom design system
- Dark mode support
- Responsive design
- Utility-first approach with `cn()` helper

## Build Status

Build successful! All pages compile and generate static HTML where possible.

## Next Steps

1. Add better-auth session server component support
2. Add more interactive visualizations
3. Implement audio playback for chords/scales
4. Add more theory lessons
5. Create mobile companion app screens
