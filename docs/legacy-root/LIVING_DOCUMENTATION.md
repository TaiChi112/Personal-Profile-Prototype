# 📋 Living Documentation: Personal Profile Prototype
**Version:** 0.1.0  
**Last Updated:** April 2026  
**Status:** MVP Phase (Design Pattern Playground)  
**Audience:** Developers, Maintainers, Contributors  

---

## Executive Summary

**Personal Profile Prototype** is a TypeScript/Next.js full-stack web application designed as an **interactive design pattern playground** for Computer Science students. It combines a dynamic personal portfolio with real-world implementations of Gang of Four (GoF) design patterns using clean architecture and SDLC best practices.

### Key Characteristics
- **Frontend:** React 19, Next.js 16, Tailwind CSS 4
- **Backend:** Node.js + Next.js API routes, PostgreSQL, Prisma ORM
- **Architecture Style:** Pattern-driven UI monolith with modular domain layers
- **MVP Focus:** Portfolio display, content tree navigation, theme customization, guided tours
- **Deployment:** Docker containerization (dev & prod environments)

---

## 1. Business & Planning

### Project Purpose
This project serves two primary goals:
1. **Portfolio Showcase:** Present a CS student's skills, projects, resume, and experience in a professional, interactive manner
2. **Educational Proof-of-Concept:** Demonstrate practical, real-world implementation of software design patterns within a production-like frontend architecture

### Business Goals
- Showcase design pattern expertise to internship/job recruiters
- Provide a working reference for students learning software engineering
- Maintain a flexible, extensible codebase that models SDLC practices
- Support future AI/LLM integration for intelligent content generation

### Target Users
1. **Primary Audience:** Recruiters/hiring managers, CS internship/job seekers
2. **Secondary Audience:** CS students learning design patterns and web development
3. **Tertiary Audience:** Developers extending the portfolio with new features/patterns

### Success Criteria (MVP)
- [ ] Functional portfolio sections (Projects, Blog, Resume, Articles, Podcast)
- [ ] Working authentication (Google OAuth + test credentials)
- [ ] Theme customization (light/dark, multiple styles, languages)
- [ ] Guided tour system for feature discovery
- [ ] Admin dashboard for template cloning
- [ ] Responsive design across devices
- [PLACEHOLDER] Performance benchmarks & accessibility scores
- [PLACEHOLDER] Mobile app version or progressive enhancement metrics

---

## 2. Requirements & Features

### Functional Requirements

#### FR-1: Portfolio Content Management
- **Description:** Display portfolio content (projects, blog posts, articles, videos, podcasts) in a unified interface
- **Priority:** Critical
- **Scope:** 
  - Normalize diverse content models into `UnifiedContentItem`
  - Support multiple layout modes (grid, list, timeline, column, row)
  - Render content trees recursively via Composite pattern
  - Display metadata (date, tech stack, links)

#### FR-2: Feed System with Filtering & Sorting
- **Description:** Provide rich filtering and sorting of portfolio items
- **Priority:** High
- **Scope:**
  - Filter by content type (project, blog, article, video, podcast)
  - Filter by tags/keywords
  - Sort by date, title, or custom criteria
  - Display snapshot statistics bar
  - Preserve filter state (Memento pattern)

#### FR-3: User Authentication & Authorization
- **Description:** Secure access control with role-based features
- **Priority:** Critical
- **Scope:**
  - Google OAuth login
  - Test credential login (admin/viewer roles)
  - JWT session strategy
  - Admin-only features (template cloning, content posting)

#### FR-4: Theme & Localization System
- **Description:** Dynamic theming and multi-language support at runtime
- **Priority:** High
- **Scope:**
  - Dark/light mode toggle
  - Multiple style families (Modern, Minimal, Future, Academic)
  - Multiple font choices (Sans, Serif)
  - English & Thai language packs
  - Persistent theme preferences

#### FR-5: Guided Tour System
- **Description:** Interactive onboarding and feature discovery
- **Priority:** Medium
- **Scope:**
  - Step-by-step tour through major features
  - Tour state persistence
  - Keyboard navigation (next/prev/play/stop)
  - Visual highlighting of tour targets

#### FR-6: Command Palette
- **Description:** Keyboard-driven command execution interface
- **Priority:** Medium
- **Scope:**
  - Register commands (navigate, toggle theme, switch style, etc.)
  - Command history with undo support
  - Fuzzy command search
  - Keyboard shortcuts (Ctrl+K/Cmd+K)

#### FR-7: Podcast Player
- **Description:** Audio streaming with state management
- **Priority:** Low
- **Scope:**
  - Play/pause/stop controls
  - Progress bar tracking
  - Volume control
  - Finite state machine for player states

#### FR-8: Contact Form with Validation
- **Description:** Visitor contact submission with validation pipeline
- **Priority:** Medium
- **Scope:**
  - Email/name/message input
  - Client-side validation
  - Server-side submission handling
  - Mediator pattern for orchestration

#### FR-9: Admin Dashboard
- **Description:** Administrative interface for content management
- **Priority:** High
- **Scope:**
  - Project metrics (count by type, totals)
  - Tag cloud visualization
  - Template cloning workflow
  - Content tree visualization

#### FR-10: REST API for Content
- **Description:** Backend endpoints for content CRUD operations
- **Priority:** High
- **Scope:**
  - GET /api/posts - retrieve all posts
  - POST /api/posts - create post (admin only)
  - GET /api/posts/[id] - retrieve single post
  - DELETE /api/posts/[id] - remove post (admin only)
  - [PLACEHOLDER] Full content CRUD for all types

### User Roles & Permissions

| Role    | Capabilities                                  |
|---------|-----------------------------------------------|
| Viewer  | View portfolio, filter/sort content, read resume, access tour |
| Admin   | All viewer permissions + clone templates + create/edit posts + manage users |
| Guest   | Limited view of public content only            |

### Non-Functional Requirements

| Requirement | Target | Status |
|------------|--------|--------|
| Performance (FCP) | < 2.5s | [PLACEHOLDER] |
| Performance (LCP) | < 4.0s | [PLACEHOLDER] |
| Accessibility (WCAG) | 2.1 AA | [PLACEHOLDER] |
| Browser Support | Chrome, Firefox, Safari, Edge (latest 2 versions) | [PLACEHOLDER] |
| Mobile Responsiveness | 320px to 2560px width | Partial (needs validation) |
| Uptime | 99.5% | [PLACEHOLDER] |
| Error Rate | < 0.1% | [PLACEHOLDER] |

---

## 3. Architecture & Design

### Technology Stack

#### Frontend
- **Framework:** Next.js 16.1.7 (React 19.2.3)
- **UI Library:** React components (custom + Lucide icons)
- **Styling:** Tailwind CSS 4 with PostCSS
- **State Management:** React Context API + Hooks
- **Type Safety:** TypeScript 5.9
- **Build Tool:** Next.js built-in (Webpack/Turbopack)

#### Backend
- **Framework:** Next.js API routes
- **Runtime:** Node.js 18+
- **Database:** PostgreSQL 16
- **ORM:** Prisma 7.6.0
- **Authentication:** NextAuth.js 4.24.13
- **Validation:** [PLACEHOLDER] Zod or custom validators

#### DevOps & Infrastructure
- **Containerization:** Docker + Docker Compose
- **Databases:** PostgreSQL in container
- **Package Manager:** npm with Bun support
- **Environment:** Development, staging, production

#### Development Tools
- **Linting:** ESLint 9 + Next.js config
- **Type Checking:** TypeScript
- **Version Control:** Git
- **Scripting:** Bash + TypeScript (ts-node)

### System Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                   CLIENT (React)                    │
├─────────────────────────────────────────────────────┤
│  UI Layer                                           │
│  ├─ Navigation Shell (tabs, layout)                 │
│  ├─ Section Renders (Projects, Blog, Resume, etc)  │
│  ├─ Feed UI (cards, filters, sort bar)             │
│  └─ System Controls (theme, tour, command, notify)  │
├─────────────────────────────────────────────────────┤
│  Domain Layer (Models & Services)                   │
│  ├─ Theme Config (factories, locales)              │
│  ├─ Command Models (ICommand, history)             │
│  ├─ Feed Models (sort, filter, state)              │
│  ├─ Content Models (tree nodes, decorators)        │
│  ├─ Tour Models (iterator, steps)                  │
│  └─ Notification Service (channels, bridge)        │
├─────────────────────────────────────────────────────┤
│  App System Facade                                  │
│  └─ Bootstrap & initialization orchestration       │
└─────────────────────────────────────────────────────┘
           ↓ (HTTP/API calls)
┌─────────────────────────────────────────────────────┐
│               SERVER (Next.js + Node)               │
├─────────────────────────────────────────────────────┤
│  API Routes                                         │
│  ├─ GET/POST /api/posts                            │
│  ├─ GET /api/posts/[id]                            │
│  ├─ DELETE /api/posts/[id] (admin)                 │
│  ├─ [PLACEHOLDER] /api/users                        │
│  ├─ [PLACEHOLDER] /api/projects                     │
│  └─ /api/auth/* (NextAuth)                         │
├─────────────────────────────────────────────────────┤
│  Services & Database                                │
│  ├─ Prisma ORM                                      │
│  ├─ Database Models (User, Post)                   │
│  └─ [PLACEHOLDER] Advanced models (Project, Blog, etc) │
├─────────────────────────────────────────────────────┤
│  Authentication (NextAuth.js)                       │
│  ├─ Google OAuth Provider                          │
│  ├─ Credentials Provider (test login)              │
│  ├─ Session callbacks (JWT, user role)             │
│  └─ Database persistence                           │
└─────────────────────────────────────────────────────┘
           ↓ (SQL)
┌─────────────────────────────────────────────────────┐
│            PostgreSQL Database                      │
├─────────────────────────────────────────────────────┤
│  Tables                                             │
│  ├─ users (id, email, name, role, provider)       │
│  ├─ posts (id, title, content, authorId)          │
│  └─ [PLACEHOLDER] projects, blogs, articles, etc    │
│                                                     │
│  Migrations (Prisma)                                │
│  └─ Version-controlled schema changes              │
└─────────────────────────────────────────────────────┘
```

### Database Schema (Current)

**Models:**
- `User`
  - id (String, PK)
  - email (String, UNIQUE)
  - name (String, optional)
  - image (String, optional)
  - role (String, default: "viewer")
  - provider (String)
  - providerAccountId (String)
  - posts (Post[])
  - createdAt, updatedAt (Timestamps)

- `Post`
  - id (String, PK)
  - title (String, required)
  - content (String, optional)
  - published (Boolean, default: false)
  - authorId (String, FK → User)
  - author (User)
  - createdAt, updatedAt (Timestamps)

**[PLACEHOLDER] Missing Models:**
- Project (portfolio items)
- Article (blog posts)
- Podcast (episodes)
- Blog (blog metadata)
- Template (admin templates for cloning)
- Tag (categorization)

### Deployment Architecture

#### Development Environment
```bash
docker-compose up           # PostgreSQL + Next.js dev server
npm run dev                 # Webpack dev server (fast refresh)
npm run db:up              # Start database
```

#### Production Environment
```dockerfile
# Multi-stage build
Stage 1: builder
  - Install dependencies
  - Generate Prisma Client
  - Build Next.js app

Stage 2: production
  - Copy built assets
  - Non-root user (nextjs)
  - Exposed port 3000
```

#### Infrastructure Targets
- [PLACEHOLDER] GCP Cloud Run / App Engine
- [PLACEHOLDER] Docker Hub registry
- [PLACEHOLDER] GitHub Container Registry
- [PLACEHOLDER] Kubernetes deployment manifests

---

## 4. Implementation

### Key Components & Services

#### Client Components (React)

| Component | Purpose | Pattern Used |
|-----------|---------|--------------|
| `PersonalWebsiteApp` | Root shell orchestrator | Composition + System Facade |
| `NavigationShell` | Tab-based navigation | State management |
| `UnifiedFeedSection` | Content feed with filter/sort | Chain of Responsibility + Strategy |
| `FeedItemCard` | Individual feed item display | Composite + Decorator |
| `InteractiveContentNode` | Recursive tree node renderer | Composite + Visitor |
| `CommandPalette` | Keyboard command UI | Command pattern |
| `ThemeControls` | Theme switcher interface | Factory + Strategy |
| `TourControls` | Tour navigation UI | Iterator pattern |
| `ContactSection` | Contact form | Mediator pattern |
| `ParticleBackground` | Animated background | Flyweight + Factory |

#### Service Layers

| Service | Responsibility | Implementation |
|---------|-----------------|-----------------|
| `AppSystemFacade` | System bootstrap orchestration | Facade pattern |
| `NotificationService` | Global notification dispatch | Bridge + Observer |
| `ToastEventEmitter` | Toast notification channel | Singleton + Emitter |
| `CommandHistory` | Command undo/redo stack | Singleton + Memento |
| `AuthManager` | Session validation | Static utility |
| `AnalyticsSystem` | Event tracking | Singleton |

#### Data Models & Factories

| Model | Purpose | Pattern |
|-------|---------|---------|
| `ThemeConfig` / `FONTS` / `STYLES` / `LOCALES` | Runtime theme selection | Abstract Factory |
| `ContentBuilder` | Tree construction | Builder |
| `ProjectTemplate` / `ProjectTemplateRegistry` | Template cloning | Prototype + Singleton |
| `UnifiedContentItem` | Normalized content | Adapter |
| `LayoutNode` / `CompositeNode` / `LeafNode` | Tree structure | Composite |
| `FeedStateMemento` / `FeedStateCaretaker` | State snapshots | Memento |
| `AudioPlayerContext` / `StoppedState` etc. | Player state machine | State pattern |

#### API Endpoints (Implemented)

```typescript
// Authentication
POST   /api/auth/signin                    // NextAuth signin
POST   /api/auth/callback/[provider]       // OAuth callback
POST   /api/auth/signout                   // Signout
GET    /api/auth/session                   // Check session

// Posts (Content)
GET    /api/posts                          // List all posts (authenticated)
POST   /api/posts                          // Create post (admin only)
GET    /api/posts/[id]                     // Get single post (authenticated)
DELETE /api/posts/[id]                     // Delete post (admin only)

// [PLACEHOLDER] Missing endpoints:
// Projects CRUD
// Articles CRUD
// Podcast episodes CRUD
// User management
// Template operations
```

### Coding Patterns & Conventions

#### Directory Structure
```
app/
├── api/                      # Next.js API routes
│   ├── auth/                # Authentication endpoints
│   ├── posts/               # Post CRUD endpoints
│   └── users/               # User management endpoints
├── components/              # React UI components
│   ├── content/            # Content-related components
│   ├── dashboard/          # Dashboard components
│   ├── feed/               # Feed UI components
│   ├── layout/             # Layout & structure
│   ├── section/            # Section primitives
│   └── system/             # System controls (theme, tour, etc)
├── features/               # Feature-level compositions
│   ├── composition/        # Root app composition
│   └── sections/           # Section implementations
├── interfaces/             # TypeScript interfaces
│   ├── content-tree.ts    # Tree/node contracts
│   └── feed.ts            # Feed system contracts
├── lib/                    # Utilities & helpers
│   ├── auth.ts            # Auth configuration
│   ├── prisma.ts          # Prisma singleton
│   └── require-admin-session.ts
├── models/                # Domain models
│   ├── command/           # Command pattern implementations
│   ├── feed/              # Feed strategies & state
│   ├── podcast/           # Audio player state machine
│   ├── template/          # Template & prototype patterns
│   ├── theme/             # Theme factories
│   └── tour/              # Tour iterator
├── services/              # Business logic services
│   ├── contact/           # Contact form mediator
│   ├── content/           # Content transformations
│   ├── feed/              # Feed operations
│   └── system/            # System facade & notifications
├── data/                  # Static/mock data
│   ├── content.ts        # Portfolio content seed
│   └── resume.ts         # Resume data
├── globals.css            # Global styles
├── layout.tsx             # Root layout
└── page.tsx              # Root page (main app entry)

prisma/
├── schema.prisma          # Data model definitions
└── migrations/            # Versioned schema changes

lib/
└── prisma.ts             # Prisma client singleton

scripts/
├── deploy-gcp.sh         # GCP deployment script
├── integration-auth-db.ts # Auth/database integration test
├── integration-http-crud.ts # HTTP endpoint tests
└── setup-docker-dev.sh    # Docker dev setup
```

#### Naming Conventions
- **Components:** PascalCase (e.g., `PersonalWebsiteApp`, `FeedItemCard`)
- **Files:** kebab-case for components & pages (e.g., `personal-website-app.tsx`)
- **Interfaces:** PascalCase with `I` prefix or `*Contract` suffix (e.g., `ICommand`, `StyleFactory`)
- **Services:** PascalCase with `Service` suffix (e.g., `NotificationService`, `AuthManager`)
- **Constants:** UPPER_SNAKE_CASE (e.g., `MOCK_PROJECTS`, `LOCALES`)
- **Types:** PascalCase (e.g., `DecorationType`, `LayoutStyleType`)

#### TypeScript Practices
- Strict mode enabled
- Explicit return types on functions
- Generic types for flexibility (e.g., `FeedSortStrategy<T>`, `IIterator<T>`)
- Union types for variants (e.g., `'grid' | 'list' | 'timeline'`)
- Immutability where possible (readonly arrays, getters)

#### Error Handling Strategy
```typescript
// API error responses
NextResponse.json({ error: 'message' }, { status: 401 })

// Session checks
requireAuthenticatedSession() → { session, error }
requireAdminSession() → error | null

// Form validation
[PLACEHOLDER] Zod schemas or custom validators

// Client-side errors
notify.notify(message, 'ERROR') via ToastChannel
console logging via ConsoleChannel
```

#### State Management Pattern
- React Context API for theme/language/admin state
- Local component state for UI state (tabs, modals)
- Closure-based state for command history
- Singleton pattern for global services
- Memento pattern for feed filter state snapshots

---

## 5. Testing

### Current Test Coverage
**Status:** ❌ No automated tests found

### Recommended Testing Strategy (MVP Level)

#### Unit Tests
```typescript
// Models & utilities
- ContentBuilder.test.ts
- ProjectTemplate.test.ts
- FeedStateMemento.test.ts
- AudioPlayerStateMachine.test.ts
- Adapters (adaptBlogToUnified, etc.)

// Services
- NotificationService.test.ts
- AuthManager.test.ts
- CommandHistory.test.ts
```

#### Integration Tests
```typescript
// API routes
- /api/posts.test.ts (GET, POST, DELETE)
- /api/auth.test.ts
- /api/users.test.ts (if implemented)

// End-to-end flows
- Authentication flow (login → session → logout)
- Content feed (filter → sort → display)
- Command execution (keyboard → command → undo)
- Tour workflow (start → next → stop)
```

#### E2E Tests (Recommended Stack: Playwright or Cypress)
```typescript
// Critical user journeys
- Portfolio viewing flow
- Feed filtering & sorting
- Theme switching
- Authentication & admin features
- Contact form submission
```

### Testing Standards
- **Target Coverage:** 80% for critical paths, 60% overall
- **Framework:** Jest for unit/integration, Playwright for E2E
- **CI/CD:** GitHub Actions on pull requests
- **Test Naming:** `describe('ComponentName', () => { it('should...') })`

### Test Data Fixtures
- Mock content items (projects, blogs, articles)
- Fixture users (admin, viewer, unauthenticated)
- Seed database with known state for integration tests

---

## 6. Deployment

### Local Development Setup
```bash
# Prerequisites
- Node 18+, Docker, Docker Compose

# Steps
1. git clone <repo>
2. cd personal-profile-prototype
3. npm install
4. cp .env.example .env.local
5. docker-compose up -d              # Start PostgreSQL
6. npx prisma migrate dev             # Apply migrations
7. npm run dev                        # Start dev server (localhost:3000)
```

### Environment Variables
```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/personal_profile_prototype

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<random-secret>

# Google OAuth
GOOGLE_CLIENT_ID=<client-id>
GOOGLE_CLIENT_SECRET=<client-secret>

# Test Credentials
ADMIN_TEST_EMAIL=admin@example.com
ADMIN_TEST_PASSWORD=admin123
VIEWER_TEST_PASSWORD=viewer123

# App
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### Build & Deployment

#### Docker Build
```bash
docker build -t personal-profile:0.1.0 .
docker run -p 3000:3000 \
  --env-file .env.production \
  personal-profile:0.1.0
```

#### Production Checklist
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] SSL/TLS certificates configured
- [ ] Security headers set (CSRF, CSP, etc.)
- [ ] Analytics tracking configured
- [ ] Error monitoring enabled
- [ ] Backup strategy in place
- [ ] Load testing completed
- [ ] Security audit completed

### Deployment Targets (Recommended)
1. **GCP Cloud Run** (containerized, serverless)
   - High availability
   - Automatic scaling
   - Lower ops overhead

2. **Traditional VPS** (DigitalOcean, Linode, AWS EC2)
   - More control
   - Docker Compose orchestration
   - Manual scaling

3. **Kubernetes** (EKS/GKE)
   - Production-grade
   - Complex but powerful
   - For larger scale

### CI/CD Pipeline (Recommended)
```yaml
# .github/workflows/deploy.yml
- Trigger: on push to main
- Steps:
  1. Checkout
  2. Setup Node & Docker
  3. Run linter (ESLint)
  4. Run tests (Jest)
  5. Build Docker image
  6. Push to registry
  7. Deploy to target (GCP Cloud Run)
  8. Run smoke tests
  9. Notify on Slack
```

---

## 7. Maintenance & Monitoring

### Logging Strategy

#### Client-Side Logging
```typescript
// Current implementation
console.log('[System] Message')
console.log('[Analytics] Event name')
notify.notify(message, level)  // Toast + storage

// Recommended: Centralized logging service
LoggerService.info(category, message, context)
LoggerService.error(category, error, context)
LoggerService.track(eventName, data)
```

#### Server-Side Logging
```typescript
// Recommended structure
logger.info('Component initialized', { userId, timestamp })
logger.warn('Database connection slow', { duration: 5000 })
logger.error('Payment failed', { error, orderId, userId })
```

#### [PLACEHOLDER] Logging Infrastructure
- Centralized logging (ELK Stack, Datadog, or GCP Logging)
- Structured JSON logs
- Log retention policy (30 days development, 90 days production)
- Log levels: INFO, WARN, ERROR, DEBUG

### Error Handling & Recovery

#### Error Categories
| Category | Example | Handling |
|----------|---------|----------|
| Auth Errors | Unauthorized (401) | Redirect to login |
| Permission Errors | Forbidden (403) | Show error message |
| Not Found (404) | Missing resource | Show 404 page |
| Validation Errors (400) | Invalid input | Show form errors |
| Server Errors (500) | Database down | Show error boundary |
| Network Errors | Timeout | Retry + fallback UI |

#### Error Boundary (Client)
```typescript
// Recommended: React Error Boundary component
<ErrorBoundary>
  <App />
</ErrorBoundary>

// Logs to central service and shows user-friendly message
```

#### [PLACEHOLDER] Monitoring & Alerting
- Uptime monitoring (StatusPage.io or similar)
- Error rate tracking (Sentry or equivalent)
- Performance monitoring (PageSpeed, Core Web Vitals)
- Database health checks
- Alert thresholds for critical issues

### Maintenance Tasks

#### Regular (Weekly)
- Review error logs for patterns
- Check database performance metrics
- Validate backup integrity
- Monitor uptime reports

#### Monthly
- Update dependencies (security patches)
- Review analytics & usage metrics
- Analyze failed requests
- Performance regression testing

#### Quarterly
- Major version upgrades
- Security audit & penetration testing
- Load testing & capacity planning
- Documentation review & updates
- Disaster recovery drill

### Disaster Recovery
- **RTO (Recovery Time Objective):** 4 hours
- **RPO (Recovery Point Objective):** 1 hour
- **Backup Strategy:** Daily automated snapshots, weekly offsite backups
- **Failover:** [PLACEHOLDER] Hot standby or multi-region setup

---

## Key Design Patterns Used

### Creational
1. **Singleton** - `NotificationService`, `ToastEventEmitter`, `CommandHistory`
2. **Factory** - `LocalizationFactory`, `StyleFactory`, `TypographyFactory`
3. **Abstract Factory** - Theme factories mapping keys to implementations
4. **Builder** - `ContentBuilder` for tree construction
5. **Prototype** - `ProjectTemplate` for template cloning

### Structural
1. **Adapter** - Content type adapters to `UnifiedContentItem`
2. **Composite** - `LayoutNode`, `CompositeNode`, `LeafNode` tree structure
3. **Decorator** - `ContentDecorator` for badges/overlays
4. **Proxy** - `AccessControlProxy` for premium/admin content
5. **Flyweight** - `ParticleFactory` for background animation
6. **Bridge** - `NotificationService` + `INotificationChannel`
7. **Facade** - `AppSystemFacade` for initialization

### Behavioral
1. **Strategy** - `FeedSortStrategy` for sort algorithms
2. **Chain of Responsibility** - `FilterHandler` for filtering pipeline
3. **Visitor** - `IVisitor` for tree traversal & analytics
4. **State** - `AudioPlayerContext` with state classes
5. **Mediator** - `ContactFormMediator` for form orchestration
6. **Command** - `ICommand` implementations for palette
7. **Iterator** - `TourIterator` for step traversal
8. **Memento** - `FeedStateMemento` for state snapshots
9. **Observer** - Event emitters for notifications

---

## Mermaid System Architecture Diagram

```mermaid
graph TB
    subgraph Client["CLIENT (Browser - React)"]
        UI["UI Layer<br/>(Components)"]
        DM["Domain Layer<br/>(Models/Services)"]
        FS["AppSystemFacade<br/>(Bootstrap)"]
    end
    
    subgraph Server["SERVER (Node.js + Next.js)"]
        API["API Routes<br/>(REST)"]
        AUTH["NextAuth<br/>(Session/JWT)"]
        PRISMA["Prisma ORM<br/>(Data Access)"]
    end
    
    subgraph DB["DATABASE (PostgreSQL)"]
        USERS["Users<br/>(email, role)"]
        POSTS["Posts<br/>(content, author)"]
        FUTURE["[FUTURE]<br/>(projects, blogs,<br/>articles, templates)"]
    end
    
    subgraph Config["CONFIGURATION"]
        ENV["Environment<br/>Variables"]
        THEMES["Theme Factories<br/>(Style, Font, Locale)"]
        SEED["Mock Data<br/>(Content Seed)"]
    end
    
    Client -->|HTTP/JSON| Server
    Server -->|SQL| DB
    Config -->|Inject| Client
    Config -->|Inject| Server
    
    UI -->|Uses| DM
    DM -->|Bootstrap| FS
    FS -->|Initializes| API
    
    API -->|ORM| PRISMA
    API -->|Session| AUTH
    PRISMA -->|Query| DB
    AUTH -->|Validate| USERS
```

---

## Mermaid Data Flow Diagram

```mermaid
sequenceDiagram
    participant User as User (Browser)
    participant React as React Component
    participant Service as Service Layer
    participant API as Next.js API
    participant DB as PostgreSQL
    
    User->>React: 1. Interact (click filter button)
    React->>Service: 2. Call FilterHandler.apply()
    Service->>Service: 3. Chain filters (type→tags→search)
    Service->>React: 4. Return filtered items
    React->>React: 5. Apply sort strategy
    React->>React: 6. Render updated UI
    
    User->>React: 7. Click "Create Post" (admin)
    React->>API: 8. POST /api/posts {title, content}
    API->>API: 9. Check admin session
    API->>DB: 10. INSERT into posts
    DB->>API: 11. Confirm & return created post
    API->>React: 12. Success response
    React->>Service: 13. Emit notification
    Service->>React: 14. Display toast
```

---

## Known Technical Debt & Risks

### Critical Risks
1. **Incomplete Database Models**
   - Only `User` and `Post` implemented
   - Missing: Project, Article, Blog, Podcast, Template, Tag models
   - **Impact:** Cannot persist portfolio content; mock data only
   - **Mitigation:** Expand schema.prisma and create migrations

2. **No Test Coverage**
   - Zero automated tests
   - Critical paths untested
   - **Impact:** Regression bugs, refactoring hazards
   - **Mitigation:** Implement Jest + Playwright test suite

3. **API Endpoints Incomplete**
   - Only posts CRUD implemented
   - Missing endpoints for projects, articles, podcasts, templates
   - **Impact:** Admin features non-functional
   - **Mitigation:** Implement remaining API routes with role-based access

### High Priority
1. **Authentication Hardening**
   - Test credentials in environment variables
   - No multi-factor authentication
   - **Mitigation:** Use secure secret management (HashiCorp Vault, AWS Secrets Manager)

2. **Security Headers & CSRF Protection**
   - [PLACEHOLDER] CSRF tokens
   - [PLACEHOLDER] Content Security Policy
   - [PLACEHOLDER] X-Frame-Options
   - **Mitigation:** Add helmet.js or manual headers

3. **Performance Optimization**
   - No code splitting analysis
   - Image optimization missing
   - No caching strategy
   - **Mitigation:** Implement Next.js Image component, analyze bundle size

4. **Error Handling**
   - Limited error boundaries
   - No graceful degradation
   - **Mitigation:** Comprehensive error boundary tree + fallback UI

### Medium Priority
1. **Documentation Gaps**
   - Component storybook missing
   - API documentation incomplete
   - Architecture decision records (ADRs) missing
   - **Mitigation:** Add MDX documentation, Storybook setup

2. **Accessibility**
   - WCAG 2.1 compliance untested
   - Missing ARIA labels
   - Keyboard navigation gaps
   - **Mitigation:** Run axe audits, add focus management

3. **Logging & Monitoring**
   - No centralized logging
   - No error tracking service
   - Analytics events hardcoded
   - **Mitigation:** Integrate Sentry, structured logging

---

## TODO: Essential Tasks for Production Readiness

### 🚨 Critical Path Items (Block Release)

- [ ] **Expand Database Schema**
  - Create models for: Project, Article, Blog, Podcast, Template, Tag, Category
  - Update Prisma schema.prisma
  - Generate new migrations
  - Seed database with sample data

- [ ] **Complete API Implementation**
  - Implement GET/POST/DELETE for projects
  - Implement GET/POST/DELETE for articles
  - Implement GET/POST/DELETE for podcasts
  - Add role-based authorization middleware
  - Add input validation (Zod or equivalent)
  - Add response formatting standard

- [ ] **Implement Test Suite**
  - Jest configuration for unit/integration tests
  - Playwright setup for E2E tests
  - GitHub Actions CI pipeline
  - Achieve 60% coverage minimum for MVP

- [ ] **Security Hardening**
  - Replace test credentials with secure auth flow
  - Implement CSRF protection
  - Add security headers (CSP, X-Frame-Options, HSTS)
  - Add rate limiting on API endpoints
  - Implement input sanitization

### ✅ High Priority (Needed Before MVP Launch)

- [ ] **Complete Admin Dashboard Features**
  - Implement template cloning API endpoint
  - Add template management UI
  - Add content editor interface
  - Add user management interface

- [ ] **Error Handling & Logging**
  - Implement error boundary component
  - Add centralized logging service (Sentry/LogRocket)
  - Add structured error responses
  - Implement retry logic for failed requests

- [ ] **Performance Optimization**
  - Analyze bundle size (next/bundle-analyzer)
  - Implement code splitting for sections
  - Optimize images with next/image
  - Implement caching strategy (client & server)
  - Run Core Web Vitals audit

- [ ] **Documentation**
  - Create API documentation (Swagger/OpenAPI)
  - Create component storybook
  - Write architecture decision records (ADRs)
  - Create deployment runbook
  - Document environment setup

- [ ] **Accessibility**
  - Run axe accessibility audit
  - Fix WCAG 2.1 AA violations
  - Add ARIA labels to interactive elements
  - Test keyboard navigation
  - Test with screen reader

### 📋 Medium Priority (Before General Availability)

- [ ] **Monitoring & Observability**
  - Set up error tracking (Sentry)
  - Implement performance monitoring
  - Create dashboard for metrics
  - Set up alerts for critical errors
  - Implement distributed tracing

- [ ] **Infrastructure & DevOps**
  - Create deployment scripts (GCP, AWS, or traditional VPS)
  - Set up CI/CD pipeline (GitHub Actions)
  - Implement database backup strategy
  - Create disaster recovery procedures
  - Load test at expected scale

- [ ] **Feature Completeness**
  - Implement advanced feed features (saved items, sharing)
  - Add comments/discussion system
  - Implement search functionality
  - Add notifications (email, in-app)
  - Implement analytics dashboard

- [ ] **Localization & i18n**
  - Complete Thai language packs
  - Add more language support (French, Spanish)
  - Implement RTL layout support if needed
  - Translate all user-facing strings

### 🎯 Nice-to-Have (Roadmap)

- [ ] Mobile app (React Native or Flutter)
- [ ] Progressive Web App (PWA) capabilities
- [ ] AI-powered resume matching
- [ ] LLM integration for content generation
- [ ] Real-time collaboration features
- [ ] Advanced analytics & user insights
- [ ] Payment integration (if monetization planned)
- [ ] Plugin/extension system for custom patterns

---

## Recommended Reading Order for New Contributors

1. **Quick Start (5 min):** This document - Executive Summary & Requirements
2. **Architecture Overview (15 min):** Section 3 - Architecture & Design
3. **Code Deep Dive (30 min):** Section 4 - Implementation & Patterns
4. **Dev Environment (20 min):** Section 6 - Development Setup & API Routes
5. **Existing Documentation:** Check [docs/](docs/) folder for detailed pattern guides

---

## Glossary

| Term | Definition |
|------|-----------|
| **MVP** | Minimum Viable Product - feature set for initial launch |
| **Pattern** | Gang of Four (GoF) design pattern or SDLC practice |
| **Composite Node** | Tree node that contains children |
| **Leaf Node** | Tree node without children (terminal node) |
| **Memento** | Pattern for saving/restoring object state |
| **Visitor** | Pattern for traversing tree and applying operations |
| **Mediator** | Pattern for centralizing complex interactions |
| **Facade** | Pattern for simplifying complex subsystem interfaces |
| **ORM** | Object-Relational Mapping (Prisma in this project) |
| **JWT** | JSON Web Token for stateless authentication |
| **WCAG** | Web Content Accessibility Guidelines |
| **CSP** | Content Security Policy (HTTP header) |
| **Flyweight** | Pattern for sharing common object data |

---

## Contact & Support

**Project Owner:** TaiChi (Anothai)  
**Email:** anothai.0978452316@gmail.com  
**GitHub:** https://github.com/TaiChi112/Personal-Profile-Prototype  

**For Issues & Questions:**
- Open GitHub Issues for bugs
- Start Discussions for feature requests
- Contact owner for architectural guidance

---

**Document Status:** ✅ LIVING DOCUMENT  
**Next Review:** 2026-05-23  
**Version History:**
- v0.1.0 (2026-04-23) - Initial comprehensive documentation

