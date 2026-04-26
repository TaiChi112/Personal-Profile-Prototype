# Personal Profile Prototype

> **Version:** 0.1.0 (MVP) &nbsp;|&nbsp; **Status:** Active Development &nbsp;|&nbsp; **License:** Private

A full-stack TypeScript/Next.js web application that serves as both an **interactive personal portfolio** and an **educational design pattern playground**. The system demonstrates all 23 Gang of Four (GoF) design patterns implemented within a production-grade architecture, targeting CS students, recruiters, and software engineering educators.

---

## Table of Contents

1. [Planning](#1-planning)
2. [Analysis](#2-analysis)
3. [Design](#3-design)
4. [Implementation](#4-implementation)
5. [Testing](#5-testing)
6. [Deployment](#6-deployment)
7. [Maintenance](#7-maintenance)

---

## 1. Planning

### 1.1 Problem Statement

Traditional developer portfolios are static, single-purpose pages that fail to demonstrate **depth of software engineering knowledge**. Simultaneously, CS curricula often teach design patterns in isolation — without grounding them in real, working systems. This project resolves both problems by merging portfolio functionality with a living, interactive pattern showcase.

### 1.2 Project Objectives

| Objective | Description |
|-----------|-------------|
| **Portfolio Showcase** | Present projects, blog posts, resume, articles, and podcast content in a unified, dynamic interface |
| **Pattern Playground** | Implement all 23 GoF design patterns as first-class, observable features of the running application |
| **Educational Reference** | Provide a production-grade codebase that CS students and educators can study and extend |
| **Future AI Integration** | Architect the system to support LLM-powered content generation and intelligent assistants |

### 1.3 Technology Stack Rationale

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| **Frontend Framework** | Next.js 16 + React 19 | App Router support, SSR/CSR flexibility, API routes co-location |
| **Language** | TypeScript 5.9 (strict) | Type safety essential for pattern demonstrations; generics power Strategy/Iterator/Composite |
| **Styling** | Tailwind CSS 4 + PostCSS | Utility-first enables rapid theme switching; supports Abstract Factory theme families |
| **Runtime Scripting** | Bun | Fast script execution for seeding, integration tests, and CI pipelines |
| **ORM** | Prisma 7 | Type-safe database access; migration management for schema evolution |
| **Database** | PostgreSQL 16 | ACID compliance; relational model suits User→Post ownership graph |
| **Authentication** | NextAuth.js 4 | Pluggable OAuth providers; JWT session strategy with role augmentation |
| **Containerization** | Docker + Docker Compose | Environment parity; isolates PostgreSQL; enables GCP Cloud Run deployment |
| **CI/CD** | GitHub Actions | Automated lint → integration test → build → GCP deploy pipeline |

### 1.4 Success Criteria (MVP)

- [x] All 23 GoF patterns implemented in `src/patterns/` with 140+ test cases
- [x] Functional portfolio sections: Projects, Blog, Resume, Articles, Podcast, Contact, Dashboard
- [x] Working authentication (Google OAuth + test credentials)
- [x] Theme customization (dark/light, 4 style families, 2 font families, EN/TH i18n)
- [x] Guided tour system with iterator-driven step navigation
- [x] Command palette (Ctrl+K) with undo/redo history
- [x] Docker-containerized development and production environments
- [x] GitHub Actions CI/CD with GCP Cloud Run deployment target
- [ ] Performance benchmarks (FCP < 2.5s, LCP < 4.0s) — *In Progress*
- [ ] Full WCAG 2.1 AA accessibility audit — *In Progress*

---

## 2. Analysis

### 2.1 Functional Requirements

| ID | Feature | Priority | Status |
|----|---------|----------|--------|
| FR-1 | Portfolio Content Management (Composite tree, multi-layout) | Critical | ✅ Implemented |
| FR-2 | Unified Feed with Filter Chain + Sort Strategy | High | ✅ Implemented |
| FR-3 | Role-Based Authentication (Google OAuth + Credentials) | Critical | ✅ Implemented |
| FR-4 | Runtime Theme & Localization System (Abstract Factory) | High | ✅ Implemented |
| FR-5 | Guided Tour System (Iterator + State Machine) | Medium | ✅ Implemented |
| FR-6 | Command Palette with Undo/Redo (Command + Memento) | Medium | ✅ Implemented |
| FR-7 | Podcast Player (Finite State Machine) | Low | ✅ Implemented |
| FR-8 | Contact Form with Mediator Validation | Medium | ✅ Implemented |
| FR-9 | Admin Dashboard (Visitor analytics, Prototype cloning) | High | ✅ Implemented |
| FR-10 | REST API for Posts CRUD | High | ✅ Implemented |
| FR-11 | Full CRUD for Projects, Articles, Podcasts | Medium | 🔲 Planned |
| FR-12 | AI/LLM Content Generation | Low | 🔲 Planned |

### 2.2 Non-Functional Requirements

| Requirement | Target | Status |
|-------------|--------|--------|
| First Contentful Paint (FCP) | < 2.5s | To be defined |
| Largest Contentful Paint (LCP) | < 4.0s | To be defined |
| Accessibility (WCAG) | 2.1 AA | To be defined |
| Browser Support | Chrome, Firefox, Safari, Edge (latest 2) | Partial |
| Mobile Responsiveness | 320px – 2560px | Partial |
| Uptime Target | ≥ 99.5% | To be defined |
| API Error Rate | < 0.1% | To be defined |
| TypeScript Strict Mode | 100% | ✅ Enforced |

### 2.3 Stakeholders & User Roles

| Role | Capabilities |
|------|-------------|
| **Guest** | View public portfolio sections, browse content feed |
| **Viewer** | All guest permissions + filter/sort feed, access guided tour, use command palette |
| **Admin** | All viewer permissions + create/delete posts, clone project templates, view dashboard analytics |

---

## 3. Design

### 3.1 Architectural Style

The system follows a **Pattern-Driven UI Monolith** with a **Layered Architecture** within a single Next.js application:

```mermaid
block-beta
  columns 1

  block:client["Client (Browser)"]
    columns 1
    ui["🖥️ UI Layer — React Components\nNavigationShell · Sections · Feed · System Controls"]
    domain["⚙️ Domain Layer — Models & Services\nTheme · Command · Feed · Content · Tour"]
    facade["🏛️ Application Facade\nAppSystemFacade (Bootstrap)"]
  end

  arrow["HTTP / JSON"]

  block:server["Server (Next.js)"]
    columns 1
    api["🌐 Server Layer — Next.js API Routes\n/api/auth · /api/posts · Auth Middleware"]
    dal["🔗 Data Access Layer — Prisma ORM"]
    db["🗄️ Database — PostgreSQL 16\nusers · posts · future models"]
  end

  ui --> domain
  domain --> facade
  facade --> arrow
  arrow --> api
  api --> dal
  dal --> db
```

### 3.2 Design Patterns Implemented

All **23 Gang of Four** patterns are implemented and observable in the running application.

#### Creational (5)

| Pattern | Implementation | Location |
|---------|---------------|----------|
| **Singleton** | `NotificationService`, `ToastEventEmitter`, `CommandHistory` | `app/services/system/` |
| **Factory Method** | `LocalizationFactory` — creates EN/TH locale objects | `app/models/theme/` |
| **Abstract Factory** | `StyleFactory` — creates Modern/Minimal/Future/Academic theme families | `app/models/theme/` |
| **Builder** | `ContentBuilder` — fluent API for constructing nested content trees | `app/models/` |
| **Prototype** | `ProjectTemplate` + `ProjectTemplateRegistry` — admin template cloning | `app/models/template/` |

#### Structural (7)

| Pattern | Implementation | Location |
|---------|---------------|----------|
| **Adapter** | `adaptBlogToUnified`, `adaptProjectToUnified` — normalize diverse content types | `app/services/content/` |
| **Bridge** | `NotificationService` + `INotificationChannel` — decouple notification logic from delivery | `app/services/system/` |
| **Composite** | `LayoutNode` / `CompositeNode` / `LeafNode` — recursive content tree | `app/interfaces/content-tree.ts` |
| **Decorator** | `ContentDecorator` — dynamically adds badges/overlays to feed cards | `app/components/feed/` |
| **Facade** | `AppSystemFacade` — single entry point for app bootstrap and initialization | `app/services/system/` |
| **Flyweight** | `ParticleFactory` — shared intrinsic state for animated background particles | `app/components/system/` |
| **Proxy** | `AccessControlProxy` — gate premium/admin content behind session checks | `app/models/` |

#### Behavioral (11)

| Pattern | Implementation | Location |
|---------|---------------|----------|
| **Chain of Responsibility** | `FilterHandler` pipeline — Type → Tag → Search filters | `app/services/feed/` |
| **Command** | `ICommand` + `NavigateCommand`, `ToggleThemeCommand`, etc. | `app/models/command/` |
| **Iterator** | `TourIterator` — sequential step traversal for guided tour | `app/models/tour/` |
| **Observer** | `ToastEventEmitter` — event-driven toast notification dispatch | `app/services/system/` |
| **Strategy** | `FeedSortStrategy` — `DateSortStrategy`, `TitleSortStrategy`, `LengthSortStrategy` | `app/models/feed/` |
| **State** | `AudioPlayerContext` with `StoppedState`, `PlayingState`, `PausedState` | `app/models/podcast/` |
| **Template Method** | Content export algorithm with pluggable format steps | `src/patterns/` |
| **Mediator** | `ContactFormMediator` — orchestrates form validation and submission | `app/services/contact/` |
| **Memento** | `FeedStateMemento` + `FeedStateCaretaker` — snapshot/restore filter state | `app/models/feed/` |
| **Interpreter** | Grammar evaluator for expression parsing | `src/patterns/` |
| **Visitor** | `MetricsVisitor`, `TagsVisitor` — analytics traversal of content trees | `app/components/dashboard/` |

### 3.3 Data Model

```mermaid
erDiagram
    USER {
        string id PK "cuid"
        string email UK
        string name
        string image
        string role
        string provider
        string providerAccountId
        datetime createdAt
        datetime updatedAt
    }

    POST {
        string id PK "cuid"
        string title
        string content
        boolean published
        string authorId FK
        datetime createdAt
        datetime updatedAt
    }

    USER ||--o{ POST : "authors"
```

| Entity | Fields | Notes |
|--------|--------|-------|
| `User` | `id` (cuid PK), `email` (unique), `name`, `image`, `role`, `provider`, `providerAccountId`, `createdAt`, `updatedAt` | Composite unique on `[provider, providerAccountId]` |
| `Post` | `id` (cuid PK), `title`, `content`, `published`, `authorId` (FK → User), `createdAt`, `updatedAt` | Index on `authorId` |

**Planned models:** `Project`, `Article`, `Podcast`, `Blog`, `Template`, `Tag`, `Category`

### 3.4 Authentication & Authorization Flow

```mermaid
flowchart TD
    A(["🔑 Login"]) --> B{"Choose Provider"}
    B -- "Google OAuth" --> C["NextAuth OAuth Callback"]
    B -- "Credentials" --> D["Credential Validation"]
    C --> E["Upsert User in PostgreSQL"]
    D --> E
    E --> F["Generate JWT\n(userId + role)"]
    F --> G["Session Callback\naugments session object"]
    G --> H{"Access Protected Route?"}
    H -- "Yes" --> I["requireAdminSession()"]
    H -- "No" --> K["Render Viewer UI"]
    I -- "Admin role" --> J["Render Admin UI"]
    I -- "Insufficient role" --> L(["401 Unauthorized"])
```

---

## 4. Implementation

### 4.1 Directory Structure

```
personal-profile-prototype/
├── app/                        # Next.js App Router root
│   ├── api/                    # Server-side API route handlers
│   │   ├── auth/               # NextAuth.js endpoints
│   │   ├── posts/              # Posts CRUD (GET, POST, DELETE)
│   │   └── users/              # User management [planned]
│   ├── components/             # Reusable React UI components
│   │   ├── content/            # Content node renderers
│   │   ├── dashboard/          # Metrics, tag cloud, analytics
│   │   ├── feed/               # Feed cards, filters, sort bar
│   │   ├── layout/             # Navigation shell, page structure
│   │   ├── section/            # Section primitive wrappers
│   │   └── system/             # Theme controls, tour, command palette, particles
│   ├── features/               # Feature-level compositions
│   │   ├── composition/        # Root app assembly (PersonalWebsiteApp)
│   │   └── sections/           # Full section implementations
│   ├── interfaces/             # TypeScript interface contracts
│   │   ├── content-tree.ts     # IContentNode, IVisitor, IComponent
│   │   └── feed.ts             # IFeedItem, IFeedState, ISortStrategy
│   ├── lib/                    # Server-side utilities
│   │   ├── auth.ts             # NextAuth configuration
│   │   ├── prisma.ts           # Prisma singleton client
│   │   └── require-admin-session.ts  # Auth middleware helper
│   ├── models/                 # Domain model implementations
│   │   ├── command/            # ICommand + concrete commands
│   │   ├── feed/               # Sort strategies, Memento, FilterHandler
│   │   ├── podcast/            # AudioPlayerContext + State classes
│   │   ├── template/           # ProjectTemplate, registry (Prototype)
│   │   ├── theme/              # Style/Font/Locale factories
│   │   └── tour/               # TourIterator, tour steps
│   ├── services/               # Business logic & orchestration
│   │   ├── contact/            # ContactFormMediator
│   │   ├── content/            # Content adapters, decorators
│   │   ├── feed/               # Feed operations
│   │   └── system/             # AppSystemFacade, NotificationService
│   ├── data/                   # Static/mock data
│   │   ├── content.ts          # Portfolio content seed
│   │   └── resume.ts           # Resume data model
│   ├── [tab]/                  # Dynamic tab routing
│   ├── globals.css             # Global base styles
│   ├── layout.tsx              # Root layout (Geist fonts, Providers)
│   ├── page.tsx                # Root entry point
│   └── providers.tsx           # React context providers (NextAuth SessionProvider)
├── src/                        # Standalone pattern library
│   ├── patterns/               # All 23 GoF patterns (standalone TypeScript)
│   │   ├── 01_singleton_notifications.ts
│   │   ├── ...
│   │   ├── 24_visitor_operations.ts
│   │   ├── TESTS.ts            # 30+ creational tests (Bun:test)
│   │   ├── STRUCTURAL_TESTS.ts # 50+ structural tests
│   │   ├── BEHAVIORAL_TESTS.ts # 60+ behavioral tests
│   │   └── index.ts            # Central pattern exports
│   ├── main.ts                 # Pattern library entry
│   ├── interface.ts            # Shared type contracts
│   └── data.ts                 # Shared mock data
├── prisma/
│   ├── schema.prisma           # Prisma data model
│   └── migrations/             # Versioned schema migrations
├── scripts/
│   ├── integration-auth-db.ts  # Auth + DB integration test
│   ├── integration-http-crud.ts        # HTTP CRUD integration test
│   ├── integration-http-admin-users.ts # Admin endpoint integration test
│   ├── prisma-crud-example.ts  # Prisma CRUD reference
│   ├── deploy-gcp.sh           # Manual GCP deploy script
│   └── setup-docker-dev.sh     # Docker dev environment setup
├── lib/
│   └── prisma.ts               # Root Prisma singleton (for scripts)
├── .github/workflows/
│   ├── ci.yml                  # CI: lint → migrate → seed → integration tests → build
│   ├── deploy-gcp.yml          # CD: Docker build → GCR push → Cloud Run deploy
│   └── codeql.yml              # CodeQL security scanning
├── Dockerfile                  # Multi-stage production build
├── docker-compose.yml          # Dev: PostgreSQL + Next.js app
├── docker-compose.prod.yml     # Production compose configuration
└── package.json                # Dependencies + npm scripts
```

### 4.2 Core API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/auth/session` | Public | Check active session |
| `POST` | `/api/auth/signin` | Public | NextAuth sign-in |
| `POST` | `/api/auth/signout` | Session | Sign out |
| `GET` | `/api/posts` | Session | List all posts |
| `POST` | `/api/posts` | Admin | Create a new post |
| `GET` | `/api/posts/[id]` | Session | Get single post |
| `DELETE` | `/api/posts/[id]` | Admin | Delete a post |

### 4.3 Naming Conventions

| Construct | Convention | Example |
|-----------|-----------|---------|
| React Components | PascalCase | `UnifiedFeedSection`, `CommandPalette` |
| Files | kebab-case | `feed-item-card.tsx` |
| Interfaces | PascalCase (prefixed `I`) | `ICommand`, `IVisitor` |
| Services | PascalCase + `Service` suffix | `NotificationService` |
| Constants | UPPER_SNAKE_CASE | `MOCK_PROJECTS`, `LOCALES` |
| Types | PascalCase | `DecorationType`, `LayoutStyleType` |

### 4.4 Key Design Decisions

- **React Context API** is used for global state (theme, language, admin role) rather than a third-party store — keeping the pattern surface visible without framework magic.
- **Singleton services** are instantiated once at module load, ensuring pattern correctness is observable at runtime.
- **Bun** is used as the script runner for seeding and integration tests in CI, while `npm`/Node.js remains the primary application runtime for Docker compatibility.
- **Static mock data** (`app/data/`) drives the portfolio sections in the MVP; the REST API layer is designed to replace this data source as database models are added.

---

## 5. Testing

### 5.1 Current Coverage

| Layer | Framework | Status |
|-------|-----------|--------|
| **Pattern Unit Tests** | Bun (`bun:test`) | ✅ 140+ test cases across all 23 patterns |
| **Integration — Auth + DB** | Bun script (`scripts/integration-auth-db.ts`) | ✅ Automated in CI |
| **Integration — HTTP CRUD** | Bun script (`scripts/integration-http-crud.ts`) | ✅ Automated in CI |
| **Integration — Admin Users** | Bun script (`scripts/integration-http-admin-users.ts`) | ✅ Automated in CI |
| **Unit Tests — React Components** | Jest / React Testing Library | 🔲 To be defined |
| **E2E Tests** | Playwright | 🔲 To be defined |

### 5.2 Running Pattern Tests

```bash
# Creational patterns
bun test src/patterns/TESTS.ts

# Structural patterns
bun test src/patterns/STRUCTURAL_TESTS.ts

# Behavioral patterns
bun test src/patterns/BEHAVIORAL_TESTS.ts

# All patterns
bun test src/patterns/
```

### 5.3 Running Integration Tests

```bash
# Prerequisites: database running and migrations applied
npm run db:up
npx prisma migrate deploy

# Auth + database
npm run integration:auth-db

# HTTP CRUD endpoints
npm run integration:http-crud

# Admin user management
npm run integration:http-admin-users
```

### 5.4 Recommended Future Testing Strategy

```
Unit Tests (Jest + RTL)
├── ContentBuilder.test.ts
├── FeedStateMemento.test.ts
├── AudioPlayerStateMachine.test.ts
├── NotificationService.test.ts
└── Adapters (adaptBlogToUnified, etc.)

E2E Tests (Playwright)
├── Portfolio viewing flow
├── Feed filter → sort → display
├── Theme switching (dark/light, styles)
├── Authentication + admin feature gates
└── Contact form submission
```

**Target coverage:** 80% for critical paths, 60% overall.

---

## 6. Deployment

### 6.1 Prerequisites

- Node.js 18+
- Docker & Docker Compose
- Bun (for scripts and CI)
- Google Cloud SDK (for GCP deployment)

### 6.2 Local Development

```bash
# 1. Clone the repository
git clone <repository-url>
cd personal-profile-prototype

# 2. Install dependencies (Bun lock file present)
bun install
# or: npm install

# 3. Configure environment
cp .env.example .env

# 4. Start PostgreSQL
npm run db:up               # docker compose up -d

# 5. Apply database migrations
npx prisma migrate dev

# 6. Seed the database
npm run prisma:seed

# 7. Start development server
npm run dev                 # Webpack dev server → http://localhost:3000
# or: npm run dev:turbo     # Turbopack (faster, experimental)
```

### 6.3 Required Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/personal_profile_prototype

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<random-256-bit-secret>

# Google OAuth (optional for dev)
GOOGLE_CLIENT_ID=<gcp-oauth-client-id>
GOOGLE_CLIENT_SECRET=<gcp-oauth-client-secret>

# Test credentials (dev/staging only)
ADMIN_TEST_EMAIL=admin@example.com
ADMIN_TEST_PASSWORD=admin123
VIEWER_TEST_PASSWORD=viewer123

# App
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 6.4 Docker Production Build

```bash
# Build image
docker build -t personal-profile:0.1.0 .

# Run with production env
docker run -p 3000:3000 --env-file .env.production personal-profile:0.1.0

# Or use production compose
docker compose -f docker-compose.prod.yml up -d
```

The Dockerfile uses a **multi-stage build**:
- **Stage 1 (builder):** `node:18-alpine` — installs deps, generates Prisma client, builds Next.js
- **Stage 2 (production):** `node:18-alpine` — copies built assets only, runs as non-root user `nextjs`

### 6.5 CI/CD Pipeline

```mermaid
flowchart TD
    A(["📦 Push to main / PR Opened"]) --> B

    subgraph CI ["🔄 ci.yml — GitHub Actions"]
        direction TB
        B["1. Setup Bun"] --> C["2. bun install --frozen-lockfile"]
        C --> D["3. prisma generate"]
        D --> E["4. prisma migrate deploy\n(ephemeral PostgreSQL service)"]
        E --> F["5. prisma seed"]
        F --> G["6. integration:auth-db"]
        G --> H["7. bun run build"]
        H --> I["8. Start dev server\n→ wait for /api/auth/session"]
        I --> J["9. integration:http-crud"]
        J --> K["10. integration:http-admin-users"]
    end

    K --> L{"Push to\nmain / staging?"}
    L -- "No" --> M(["✅ CI Complete"])
    L -- "Yes" --> N

    subgraph CD ["🚀 deploy-gcp.yml — GitHub Actions"]
        direction TB
        N["1. Authenticate to GCP\n(Workload Identity Federation)"] --> O["2. docker build\n→ tag with git SHA + latest"]
        O --> P["3. docker push\n→ Google Container Registry (gcr.io)"]
        P --> Q["4. gcloud run deploy\n→ Cloud Run (us-central1)\n--set-secrets from Secret Manager"]
        Q --> R["5. gcloud run services describe\n→ output live URL"]
    end

    R --> S(["🌐 Live on Cloud Run"])
```

### 6.6 Deployment Targets

| Environment | Platform | Trigger |
|-------------|----------|---------|
| **Development** | Local Docker Compose | Manual |
| **Staging** | GCP Cloud Run (`staging` branch) | Push to `staging` |
| **Production** | GCP Cloud Run (`prod`) | Push to `main` |

---

## 7. Maintenance

### 7.1 Scalability

- **Horizontal scaling:** GCP Cloud Run auto-scales container instances based on request load; stateless Next.js design supports this natively.
- **Database scaling:** Migrate from single PostgreSQL container to GCP Cloud SQL with read replicas as traffic grows.
- **Content volume:** The Composite tree and Adapter pattern ensure new content types can be added without modifying existing rendering logic.

### 7.2 Monitoring & Logging

| Area | Current | Planned |
|------|---------|---------|
| Client errors | `console.log` + Toast notifications | Sentry / GCP Error Reporting |
| Server errors | Next.js default | Structured JSON logs → GCP Cloud Logging |
| Performance | Manual | Core Web Vitals via Vercel Analytics or GCP |
| Uptime | None | StatusPage.io / GCP Uptime Checks |
| Analytics | `AnalyticsSystem` singleton (client-side) | Google Analytics / Plausible |

### 7.3 Maintenance Schedule

| Cadence | Task |
|---------|------|
| **Weekly** | Review CI failures; check error logs for patterns |
| **Monthly** | `npm audit` + dependency security patches; analyze failed API requests |
| **Quarterly** | Major framework version upgrades; security audit; load testing; DR drill |

### 7.4 Disaster Recovery

| Metric | Target |
|--------|--------|
| **RTO** (Recovery Time Objective) | 4 hours |
| **RPO** (Recovery Point Objective) | 1 hour |
| **Backup Strategy** | Daily automated PostgreSQL snapshots; weekly offsite |
| **Rollback** | Cloud Run revision rollback via `gcloud run services update-traffic` |

### 7.5 Future Enhancements

- **AI-Native Content Generation:** Integrate an LLM API to auto-generate blog post drafts, project descriptions, and resume bullet points
- **Database-backed portfolio:** Migrate static `data/content.ts` to Prisma-managed `Project`, `Article`, `Podcast`, and `Template` models
- **Full-text search:** Add PostgreSQL full-text search or Algolia for the content feed
- **Accessibility audit:** Complete WCAG 2.1 AA remediation and add automated axe-core checks to CI
- **Progressive Web App (PWA):** Add service worker and offline support via `next-pwa`
- **Kubernetes manifests:** Add Helm chart for multi-region, production-scale deployment

---

## Quick Reference: npm Scripts

```bash
npm run dev                         # Start Webpack dev server
npm run dev:turbo                   # Start Turbopack dev server
npm run build                       # Type-check + Next.js production build
npm run start                       # Start production server
npm run lint                        # ESLint

npm run db:up                       # docker compose up -d (PostgreSQL)
npm run db:down                     # docker compose down
npm run db:logs                     # Follow PostgreSQL container logs

npm run prisma:generate             # Generate Prisma client
npm run prisma:migrate:dev          # Apply migrations (dev)
npm run prisma:seed                 # Seed database via Bun

npm run integration:auth-db         # Auth + database integration test
npm run integration:http-crud       # HTTP CRUD integration test
npm run integration:http-admin-users # Admin users integration test
```

---

*Generated from codebase analysis · April 2026 · Personal Profile Prototype v0.1.0*