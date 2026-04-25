# Architecture Diagrams & Visual References

## System Architecture Diagram

```mermaid
graph TB
    subgraph Browser["🌐 Browser (Client)"]
        App["PersonalWebsiteApp<br/>(Root Component)"]
        Theme["Theme Controls<br/>(Dark, Style, Font, Lang)"]
        Nav["Navigation Shell<br/>(Tab Routing)"]
        Sections["Content Sections<br/>(Projects, Blog, Resume, etc)"]
        Feed["Feed System<br/>(Filter, Sort, View)"]
        Command["Command Palette<br/>(Ctrl+K)"]
        Tour["Guided Tour<br/>(Interactive Onboarding)"]
    end
    
    subgraph Services["📦 Service Layer (React)"]
        NotifService["NotificationService<br/>(Bridge Pattern)"]
        CommandHistory["CommandHistory<br/>(Singleton + Memento)"]
        Facade["AppSystemFacade<br/>(Initialization)"]
        Factories["Theme Factories<br/>(Abstract Factory)"]
    end
    
    subgraph Models["🏗️ Domain Models"]
        TreeBuilder["ContentBuilder<br/>(Builder Pattern)"]
        CompositeTree["CompositeNode/LeafNode<br/>(Composite Pattern)"]
        Adapters["Content Adapters<br/>(Adapter Pattern)"]
        FeedStrategies["Sort/Filter Strategies<br/>(Strategy Pattern)"]
        StateM["AudioPlayerStateMachine<br/>(State Pattern)"]
    end
    
    subgraph NextServer["⚙️ Next.js API Server"]
        AuthAPI["NextAuth<br/>(Session Management)"]
        PostsAPI["GET/POST /api/posts<br/>(Posts CRUD)"]
        UsersAPI["[FUTURE]<br/>/api/users, /api/projects"]
        AuthMiddleware["Authorization Middleware<br/>(Role-based Access)"]
    end
    
    subgraph Database["🗄️ PostgreSQL Database"]
        UserTable["users<br/>(id, email, role)"]
        PostTable["posts<br/>(id, title, authorId)"]
        FutureModels["[FUTURE]<br/>projects, articles, etc"]
    end
    
    App --> Theme
    App --> Nav
    App --> Sections
    App --> Feed
    App --> Command
    App --> Tour
    
    Sections -.->|Use| Services
    Feed -.->|Use| Services
    Command -.->|Use| Services
    
    Services -->|Delegate| Models
    Models -->|Render via| Sections
    
    App -->|HTTP| NextServer
    Sections -->|HTTP| PostsAPI
    Command -->|HTTP| PostsAPI
    
    AuthAPI -->|Validate| UserTable
    PostsAPI -->|ORM| Database
    AuthMiddleware -->|Check| UserTable
    
    PostsAPI --> AuthMiddleware
    
    NextServer -->|SQL| Database
    
    style Browser fill:#e1f5ff
    style Services fill:#fff3e0
    style Models fill:#f3e5f5
    style NextServer fill:#e8f5e9
    style Database fill:#fce4ec
```

---

## Client-Side Data Flow

```mermaid
flowchart TD
    A["🚀 App Initialization"] --> B["AppSystemFacade.initializeSystem"]
    B --> C["Load Theme Preference"]
    B --> D["Set Initial State<br/>(dark, style, font, lang)"]
    B --> E["Register Notification Channel"]
    B --> F["Initialize Analytics"]
    
    G["User Interacts"] --> H{What action?}
    
    H -->|Navigation| I["setActiveTab"]
    H -->|Theme Change| J["setStyleKey/setDark/setFontKey"]
    H -->|Command| K["OpenCommandPalette"]
    H -->|Filter Feed| L["FilterHandler.apply"]
    H -->|Sort Feed| M["SortStrategy.sort"]
    H -->|Tour Control| N["TourIterator.next/prev"]
    H -->|Contact Form| O["ContactFormMediator.submit"]
    H -->|Create Post| P["POST /api/posts"]
    
    I --> Q["Router.push / component re-render"]
    J --> Q
    K --> Q
    L --> Q
    M --> Q
    N --> Q
    
    O --> R["Validate & Submit"]
    P --> S["Check Admin Session"]
    
    R --> T["NotificationService.notify"]
    S --> U{Auth OK?}
    
    U -->|Yes| V["Create in DB"]
    U -->|No| W["Return 403 Forbidden"]
    
    V --> X["Return Success Response"]
    W --> Y["Return Error Response"]
    
    X --> T
    Y --> T
    
    T --> Z["ToastChannel.send"]
    Z --> AA["ToastEventEmitter.emit"]
    AA --> AB["ToastContainer receives event"]
    AB --> AC["Update UI with toast"]
    
    style A fill:#c8e6c9
    style G fill:#fff9c4
    style T fill:#ffccbc
    style AC fill:#b2dfdb
```

---

## Database Schema & Relationships

```mermaid
erDiagram
    USER ||--o{ POST : authors
    USER {
        string id PK
        string email UK
        string name
        string image
        string role
        string provider
        string provider_account_id UK
        timestamp created_at
        timestamp updated_at
    }
    POST {
        string id PK
        string title
        string content
        boolean published
        string author_id FK
        timestamp created_at
        timestamp updated_at
    }
    
    NOTE["[FUTURE MODELS]
    - Project
    - Article
    - Blog
    - Podcast
    - Template
    - Tag
    - Category"]
```

---

## Design Patterns Usage Map

```mermaid
graph LR
    subgraph Creational["Creational Patterns"]
        S1["🔸 Singleton<br/>NotificationService<br/>ToastEventEmitter"]
        F1["🔸 Factory<br/>LocalizationFactory<br/>StyleFactory"]
        B1["🔸 Builder<br/>ContentBuilder"]
        P1["🔸 Prototype<br/>ProjectTemplate"]
    end
    
    subgraph Structural["Structural Patterns"]
        A1["🟠 Adapter<br/>adaptBlogToUnified"]
        C1["🟠 Composite<br/>LayoutNode<br/>CompositeNode"]
        D1["🟠 Decorator<br/>ContentDecorator"]
        F2["🟠 Flyweight<br/>ParticleFactory"]
        Br1["🟠 Bridge<br/>NotificationService<br/>+ INotificationChannel"]
        Fa1["🟠 Facade<br/>AppSystemFacade"]
    end
    
    subgraph Behavioral["Behavioral Patterns"]
        St1["🔵 Strategy<br/>FeedSortStrategy"]
        Ch1["🔵 Chain of Resp<br/>FilterHandler"]
        V1["🔵 Visitor<br/>MetricsVisitor<br/>TagsVisitor"]
        State1["🔵 State<br/>AudioPlayerContext<br/>StoppedState"]
        Med1["🔵 Mediator<br/>ContactFormMediator"]
        Cmd1["🔵 Command<br/>ICommand<br/>NavigateCommand"]
        It1["🔵 Iterator<br/>TourIterator"]
        Mem1["🔵 Memento<br/>FeedStateMemento<br/>FeedStateCaretaker"]
        Obs1["🔵 Observer<br/>ToastEventEmitter"]
    end
    
    style S1 fill:#c8e6c9
    style F1 fill:#c8e6c9
    style B1 fill:#c8e6c9
    style P1 fill:#c8e6c9
    
    style A1 fill:#ffe0b2
    style C1 fill:#ffe0b2
    style D1 fill:#ffe0b2
    style F2 fill:#ffe0b2
    style Br1 fill:#ffe0b2
    style Fa1 fill:#ffe0b2
    
    style St1 fill:#bbdefb
    style Ch1 fill:#bbdefb
    style V1 fill:#bbdefb
    style State1 fill:#bbdefb
    style Med1 fill:#bbdefb
    style Cmd1 fill:#bbdefb
    style It1 fill:#bbdefb
    style Mem1 fill:#bbdefb
    style Obs1 fill:#bbdefb
```

---

## Request/Response Lifecycle

```mermaid
sequenceDiagram
    participant Browser
    participant NextApp as Next.js App (CSR)
    participant API as API Route Handler
    participant Middleware as Auth Middleware
    participant Prisma as Prisma ORM
    participant DB as PostgreSQL
    
    Browser->>NextApp: 1. User fills contact form & clicks Send
    
    alt Form Validation
        NextApp->>NextApp: Validate email, name, message
        alt Invalid
            NextApp->>Browser: Show validation errors
        else Valid
            NextApp->>API: 2. POST /api/posts {title, content, authorId}
        end
    end
    
    API->>Middleware: 3. requireAdminSession()
    Middleware->>Middleware: 4. getServerSession(authOptions)
    Middleware->>DB: 5. Query user role
    DB->>Middleware: 6. Return user { id, role }
    
    alt User is Admin
        Middleware->>API: 7. Return { session, error: null }
        API->>Prisma: 8. prisma.post.create({ title, content, authorId })
        Prisma->>DB: 9. INSERT INTO posts (...)
        DB->>Prisma: 10. RETURNING { id, title, ... }
        Prisma->>API: 11. Return created post object
        API->>NextApp: 12. NextResponse.json({ post }, { status: 201 })
        NextApp->>Browser: 13. Show success toast
    else User is Viewer or Guest
        Middleware->>API: 7. Return 403 Forbidden
        API->>NextApp: 12. NextResponse.json({ error: 'forbidden' }, { status: 403 })
        NextApp->>Browser: 13. Show error toast
    end
    
    Browser->>NextApp: 14. User dismisses toast
```

---

## Component Hierarchy

```mermaid
graph TD
    PersonalWebsiteApp["<b>PersonalWebsiteApp</b><br/>(Root Shell)"]
    
    PersonalWebsiteApp --> NavigationShell["NavigationShell<br/>(Tab Navigation)"]
    PersonalWebsiteApp --> SystemControls["System Controls<br/>(Theme, Tour, Command, Notify)"]
    PersonalWebsiteApp --> DynamicContent["Dynamic Content Renderer<br/>(renderContent)"]
    
    NavigationShell --> NavItems["Nav Items<br/>(home, projects, blog, etc)"]
    
    SystemControls --> ThemeControls["ThemeControls"]
    SystemControls --> CommandPalette["CommandPalette"]
    SystemControls --> TourControls["TourControls"]
    SystemControls --> ToastContainer["ToastContainer"]
    SystemControls --> ParticleBackground["ParticleBackground"]
    
    DynamicContent --> HomeSection["HomeSection"]
    DynamicContent --> ProjectsSection["ProjectsSection"]
    DynamicContent --> BlogSection["BlogSection"]
    DynamicContent --> ResumeSection["ResumeSection"]
    DynamicContent --> ArticlesSection["ArticlesSection"]
    DynamicContent --> DashboardSection["DashboardSection"]
    DynamicContent --> PodcastSection["PodcastSection"]
    DynamicContent --> ContactSection["ContactSection"]
    
    ProjectsSection --> InteractiveContentNode["InteractiveContentNode<br/>(Composite)"]
    InteractiveContentNode --> InteractiveContentNode
    
    BlogSection --> UnifiedFeedSection["UnifiedFeedSection"]
    UnifiedFeedSection --> FeedSearchFilterControls["FeedSearchFilterControls"]
    UnifiedFeedSection --> FeedSnapshotBar["FeedSnapshotBar"]
    UnifiedFeedSection --> FeedItemCard["FeedItemCard<br/>(with Decorator)"]
    
    DashboardSection --> MetricCard["MetricCard"]
    DashboardSection --> TopicCloud["TopicCloud"]
    
    PodcastSection --> PodcastPlayer["PodcastPlayer<br/>(State Machine)"]
    
    ContactSection --> ContactForm["ContactForm<br/>(Mediator)"]
    
    style PersonalWebsiteApp fill:#e1f5ff,stroke:#01579b,stroke-width:3px
    style SystemControls fill:#fff3e0
    style DynamicContent fill:#f3e5f5
    style InteractiveContentNode fill:#c8e6c9
    style UnifiedFeedSection fill:#ffccbc
    style ContactForm fill:#b2dfdb
```

---

## Feed System Architecture

```mermaid
graph LR
    RawItems["Raw Feed Items<br/>(projects, blogs, articles, etc)"]
    
    RawItems --> Adapter["Content Adapters<br/>(Adapter Pattern)<br/>adaptProjectToUnified<br/>adaptBlogToUnified<br/>etc"]
    
    Adapter --> UnifiedItems["UnifiedContentItem[]<br/>(Normalized)"]
    
    UnifiedItems --> FilterChain["FilterChain<br/>(Chain of Responsibility)<br/>1. Type Filter<br/>2. Tag Filter<br/>3. Search Filter"]
    
    FilterChain --> FilteredItems["Filtered Items[]"]
    
    FilteredItems --> SortStrategy["SortStrategy<br/>(Strategy Pattern)<br/>DateSortStrategy<br/>TitleSortStrategy<br/>LengthSortStrategy"]
    
    SortStrategy --> SortedItems["Sorted Items[]"]
    
    SortedItems --> StateSnapshot["FeedStateMemento<br/>(Memento Pattern)<br/>Save snapshot of<br/>filter/sort state"]
    
    SortedItems --> Renderer["Render Cards<br/>+ Snapshot Bar<br/>(UI Update)"]
    
    Renderer --> Display["Display<br/>to User"]
    
    style RawItems fill:#ffebee
    style Adapter fill:#ffe0b2
    style UnifiedItems fill:#e8f5e9
    style FilterChain fill:#bbdefb
    style SortStrategy fill:#f8bbd0
    style StateSnapshot fill:#d1c4e9
    style Renderer fill:#c8e6c9
    style Display fill:#b2dfdb
```

---

## Authentication & Authorization Flow

```mermaid
graph TD
    Login["User clicks Login"]
    
    Login --> Choose{Choose Provider}
    
    Choose -->|Google| GoogleProvider["NextAuth Google Provider<br/>OAuth 2.0 Flow"]
    Choose -->|Test Cred| CredProvider["NextAuth Credentials<br/>Provider"]
    
    GoogleProvider --> GoogleCallback["OAuth Callback<br/>/api/auth/callback/google"]
    CredProvider --> CredAuth["Email/Password<br/>Validation"]
    
    GoogleCallback --> Upsert["Upsert User<br/>in Database"]
    CredAuth --> DbCheck["Check User in DB<br/>Validate credentials"]
    
    Upsert --> JWT["Generate JWT<br/>Token"]
    DbCheck --> JWT
    
    JWT --> SessionCallback["Session Callback<br/>(Add userId, role)"]
    
    SessionCallback --> Session["Return Session<br/>{ user: {..., role} }"]
    
    Session --> Protected["Protected Components<br/>Check session & role"]
    
    Protected --> Admin{Is Admin?}
    
    Admin -->|Yes| AdminUI["Show Admin UI<br/>(Create Post, Clone Template)"]
    Admin -->|No| ViewerUI["Show Viewer UI<br/>(Read Only)"]
    
    style Login fill:#c8e6c9
    style GoogleProvider fill:#ffe0b2
    style CredProvider fill:#ffe0b2
    style JWT fill:#bbdefb
    style AdminUI fill:#ffccbc
    style ViewerUI fill:#b2dfdb
```

---

## Command Palette Execution Flow

```mermaid
graph TD
    User["User presses Ctrl+K"]
    
    User --> OpenPalette["CommandPalette Opens"]
    
    OpenPalette --> UserType["User types search query"]
    
    UserType --> FuzzyMatch["Fuzzy match against<br/>registered commands"]
    
    FuzzyMatch --> ShowMatches["Display matching<br/>commands"]
    
    ShowMatches --> UserSelect["User selects command<br/>& presses Enter"]
    
    UserSelect --> Execute["ICommand.execute()"]
    
    Execute --> CommandType{Command Type}
    
    CommandType -->|Navigate| NavCmd["NavigateCommand<br/>Changes activeTab<br/>Routes to new page"]
    
    CommandType -->|Theme| ThemeCmd["ToggleThemeCommand<br/>setDark(!isDark)"]
    
    CommandType -->|Style| StyleCmd["SwitchStyleCommand<br/>setStyleKey(newStyle)"]
    
    CommandType -->|Role| RoleCmd["ToggleRoleCommand<br/>setIsAdmin(!isAdmin)"]
    
    CommandType -->|Tour| TourCmd["StartTourCommand<br/>startTour()"]
    
    NavCmd --> AddHistory["CommandHistory.add(cmd)"]
    ThemeCmd --> AddHistory
    StyleCmd --> AddHistory
    RoleCmd --> AddHistory
    TourCmd --> AddHistory
    
    AddHistory --> ClosePalette["Close Palette<br/>& re-render"]
    
    ClosePalette --> UndoSupport["User can undo<br/>with Ctrl+Z"]
    
    UndoSupport --> Undo["CommandHistory.undo()<br/>Reverse last command"]
    
    style User fill:#c8e6c9
    style Execute fill:#bbdefb
    style AddHistory fill:#f8bbd0
    style Undo fill:#ffccbc
```

---

## Visitor Pattern: Dashboard Analytics

```mermaid
graph TD
    Dashboard["DashboardSection"]
    
    Dashboard --> CreateVisitors["Create Visitors<br/>MetricsVisitor<br/>TagsVisitor"]
    
    CreateVisitors --> TraverseTrees["Traverse all trees<br/>Projects, Blogs,<br/>Articles, etc"]
    
    TraverseTrees --> Visit["For each node:<br/>visitor.visit(node)"]
    
    Visit --> MetricsLogic["MetricsVisitor<br/>Accumulates:<br/>- total count<br/>- count by type<br/>- date ranges"]
    
    Visit --> TagsLogic["TagsVisitor<br/>Collects all:<br/>- tech tags<br/>- category tags<br/>- metadata"]
    
    MetricsLogic --> AggregatedMetrics["Aggregated Metrics<br/>{ total: 42,<br/>projects: 15,<br/>blogs: 12,<br/>articles: 15 }"]
    
    TagsLogic --> AggregatedTags["Aggregated Tags<br/>{ React: 8,<br/>TypeScript: 6,<br/>Next.js: 5,<br/>... }"]
    
    AggregatedMetrics --> Render["Render Metric Cards<br/>& Tag Cloud"]
    AggregatedTags --> Render
    
    Render --> Display["Display<br/>Dashboard"]
    
    style Dashboard fill:#c8e6c9
    style CreateVisitors fill:#ffe0b2
    style MetricsLogic fill:#bbdefb
    style TagsLogic fill:#f8bbd0
    style Render fill:#ffccbc
    style Display fill:#b2dfdb
```

---

## Guided Tour State Machine

```mermaid
stateDiagram-v2
    [*] --> NotStarted
    
    NotStarted -->|User clicks Start Tour| Running
    
    Running -->|User clicks Next| Running
    Running -->|User clicks Prev| Running
    Running -->|Reach last step| Completed
    
    Running -->|User clicks Stop| Paused
    Paused -->|User clicks Resume| Running
    Paused -->|User clicks Exit| NotStarted
    
    Completed -->|User clicks Restart| Running
    Completed -->|User clicks Exit| NotStarted
    
    note right of Running
        Current step:
        - Highlight target element
        - Show tooltip/popover
        - Wait for user action
    end
    
    note right of Paused
        Tour suspended:
        - State preserved
        - Can resume later
    end
    
    note right of Completed
        Tour finished:
        - All steps shown
        - Can restart anytime
    end
```

---

## Error Handling Strategy

```mermaid
graph TD
    Error["Error Occurs"]
    
    Error --> Classify{Error Type}
    
    Classify -->|Auth| AuthErr["Unauthorized<br/>(401)"]
    Classify -->|Permission| PermErr["Forbidden<br/>(403)"]
    Classify -->|NotFound| NotFoundErr["Not Found<br/>(404)"]
    Classify -->|Validation| ValErr["Bad Request<br/>(400)"]
    Classify -->|Server| ServerErr["Server Error<br/>(500)"]
    Classify -->|Network| NetErr["Network Error<br/>(timeout)"]
    
    AuthErr --> AuthAction["Redirect to Login"]
    PermErr --> PermAction["Show Permission<br/>Error Message"]
    NotFoundErr --> NotFoundAction["Show 404 Page"]
    ValErr --> ValAction["Show Form Errors<br/>& Highlights"]
    ServerErr --> ServerAction["Show Error Boundary<br/>& Log Error"]
    NetErr --> NetAction["Retry with<br/>Exponential Backoff"]
    
    AuthAction --> Notify["Emit Notification<br/>via NotificationService"]
    PermAction --> Notify
    NotFoundAction --> Notify
    ValAction --> Notify
    ServerAction --> Notify
    NetAction --> Notify
    
    Notify --> Channel{Channel Type}
    
    Channel -->|Toast| Toast["Show Toast<br/>for 5 seconds"]
    Channel -->|Console| Console["Log to console<br/>(dev only)"]
    Channel -->|Alert| Alert["Show modal alert<br/>(critical only)"]
    
    Toast --> UserFeedback["User sees<br/>error message"]
    Console --> UserFeedback
    Alert --> UserFeedback
    
    ServerAction --> Sentry["[FUTURE]<br/>Send to Sentry<br/>Error tracking"]
    
    style Error fill:#ffebee
    style AuthErr fill:#ffcccc
    style ServerErr fill:#ff9999
    style Notify fill:#bbdefb
    style UserFeedback fill:#c8e6c9
    style Sentry fill:#f8bbd0
```

---

## File Organization & Module Dependencies

```mermaid
graph LR
    subgraph app
        subgraph page["page.tsx (Entry)<br/>(Root Shell)"]
            RootApp["PersonalWebsiteApp"]
        end
        
        subgraph components["components/"]
            Comp1["layout/"]
            Comp2["section/"]
            Comp3["feed/"]
            Comp4["dashboard/"]
            Comp5["system/"]
            Comp6["content/"]
        end
        
        subgraph features["features/"]
            Feat1["composition/"]
            Feat2["sections/"]
        end
        
        subgraph models["models/"]
            Mod1["command/"]
            Mod2["feed/"]
            Mod3["template/"]
            Mod4["theme/"]
            Mod5["tour/"]
            Mod6["podcast/"]
        end
        
        subgraph services["services/"]
            Svc1["system/"]
            Svc2["content/"]
            Svc3["feed/"]
            Svc4["contact/"]
        end
        
        subgraph interfaces["interfaces/"]
            Int1["content-tree.ts"]
            Int2["feed.ts"]
        end
        
        subgraph lib["lib/"]
            Lib1["auth.ts"]
            Lib2["prisma.ts"]
        end
        
        subgraph api["api/"]
            API1["auth/"]
            API2["posts/"]
            API3["users/"]
        end
        
        subgraph data["data/"]
            Data1["content.ts"]
            Data2["resume.ts"]
        end
    end
    
    RootApp --> Feat1
    Feat1 --> Comp1
    Feat1 --> Comp3
    Feat1 --> Models
    
    Comp1 --> Int1
    Comp3 --> Int2
    Comp4 --> Mod1
    Comp5 --> Svc1
    Comp6 --> Svc2
    
    Comp2 --> Data1
    Comp2 --> Data2
    
    Svc1 --> Lib1
    API1 --> Lib1
    API2 --> Lib2
    
    Feat2 --> Comp2
    
    style RootApp fill:#c8e6c9
    style page fill:#e8f5e9
    style components fill:#ffe0b2
    style models fill:#bbdefb
    style services fill:#f8bbd0
    style api fill:#ffccbc
```

---

## Deployment Pipeline (Recommended)

```mermaid
graph LR
    Dev["Local Dev<br/>npm run dev"]
    
    Dev --> Git["Push to<br/>GitHub main"]
    
    Git --> CI["GitHub Actions<br/>Trigger"]
    
    CI --> Lint["1. ESLint"]
    CI --> Test["2. Run Tests"]
    CI --> Build["3. Build<br/>Next.js"]
    
    Lint --> LintPass{Pass?}
    LintPass -->|No| Notify1["Notify Developer<br/>Lint Errors"]
    LintPass -->|Yes| Test
    
    Test --> TestPass{Pass?}
    TestPass -->|No| Notify2["Notify Developer<br/>Test Failures"]
    TestPass -->|Yes| Build
    
    Build --> BuildPass{Pass?}
    BuildPass -->|No| Notify3["Notify Developer<br/>Build Failed"]
    BuildPass -->|Yes| Docker["Build Docker<br/>Image"]
    
    Docker --> Registry["Push to<br/>Docker Registry"]
    
    Registry --> Deploy["Deploy to<br/>Production"]
    
    Deploy --> Health["Health Check<br/>(smoke tests)"]
    
    Health --> HealthPass{All Good?}
    HealthPass -->|No| Rollback["Rollback<br/>to Previous"]
    HealthPass -->|Yes| Success["✓ Deployment<br/>Complete"]
    
    Success --> Notify4["Notify Team<br/>on Slack"]
    
    style Dev fill:#c8e6c9
    style Git fill:#b2dfdb
    style CI fill:#bbdefb
    style LintPass fill:#ffccbc
    style Success fill:#a5d6a7
    style Rollback fill:#ff8a80
```

---

**All diagrams support interactive tooltips and exploration. Open in VS Code with Markdown Preview Enhanced or mermaid.live for full interactivity.**

