# OFFFORM — Technical Architecture

## 1. System Overview

OFFFORM is engineered as a modular TypeScript monolith using Next.js (App Router), React 18, Tailwind CSS, Prisma ORM, and SQLite (migratable to MySQL/Postgres in production).

```
+-------------------------------------------------------------+
|                      OFFFORM Client                         |
|  (Server Components + Interactive Client State Hydration)   |
+-------------------------------------------------------------+
                              |
                     HTTPS / JSON REST
                              |
+-------------------------------------------------------------+
|                   Next.js 14 API Handlers                   |
|  - /api/auth/*          - /api/products/*                   |
|  - /api/seller/*        - /api/orders/*                     |
|  - /api/posts/*         - /api/messages/*                   |
|  - /api/admin/*         - /api/policies/*                   |
+-------------------------------------------------------------+
                              |
             Role & Authorization Guard (Server-Side)
                              |
+-------------------------------------------------------------+
|                       Prisma ORM                            |
+-------------------------------------------------------------+
                              |
+-------------------------------------------------------------+
|                   Relational Database                       |
|           (Users, Posts, Products, Orders, KYC,             |
|            Policies, Audit Logs, Conversations)             |
+-------------------------------------------------------------+
```

---

## 2. Information Architecture & Key Routes

### Public Endpoints
- `/`: Editorial home, manifestos, latest community looks, marketplace previews.
- `/about`: Brand philosophy, 6 product pillars, curation standards.
- `/discover`: Community feed (Following & Discover tabs), look submissions, likes, comments, saves.
- `/posts/[id]`: Dedicated lookbook inspection with author card and inspiration-to-commerce link.
- `/marketplace`: Curated independent marketplace with category filters, availability, and lead times.
- `/marketplace/[id]`: Single garment view, size chart, customisation option configurator.
- `/designers`: Searchable designer catalog with emerging creator spotlight.
- `/designers/[id]`: Verified designer portfolio, collections, and custom commission request route.
- `/collaborate`: Collaboration briefs directory and proposal submission workflow.
- `/events`: Fashion showcases, runway exhibitions, and interactive community challenges.
- `/policies`: Platform governance directory.
- `/policies/[slug]`: Versioned policy reader with interactive cryptographic acceptance.

### Authenticated Endpoints
- `/auth/login`: Credential authentication & 1-click Demo Role Switcher.
- `/auth/register`: Onboarding with 16+ minimum age check & policy consent.
- `/saved`: Personal saved lookbooks, saved garments, and side-by-side product comparison.
- `/messages`: Protected creative inquiries and message requests.
- `/profile`: Member portfolio, personal aesthetic tags, privacy toggles, and account deactivation.

### Seller Endpoints
- `/seller/apply`: Creator verification dossier submission (requires 18+ age).
- `/seller`: Atelier studio workspace (catalog publishing, customisation builder, production queue).

### Administrative Endpoints
- `/admin`: Restricted Curator & Moderation console (seller applications queue, reports triage, audit trail).

---

## 3. State Management & Data Flow

- **Server-First Rendering:** Pages fetch data directly via Prisma in Server Components to guarantee zero client waterfall overhead and maximum SEO.
- **Client Hydration:** Interactive islands (`FeedClient`, `ProductConfigurator`, `SellerWorkspaceClient`, `AdminConsoleClient`, `MessagesClient`) handle optimistic UI updates with immediate feedback.
- **Session Resolution:** Server-side cookie sessions parsed via `getCurrentUser()` in `src/lib/auth.ts`, ensuring permissions cannot be spoofed on the client.

