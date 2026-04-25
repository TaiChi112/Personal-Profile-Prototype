# Quick Reference Guide

## Command Cheat Sheet

### Development Commands
```bash
# Install & Setup
npm install                          # Install dependencies
docker compose up -d                 # Start PostgreSQL
npx prisma migrate dev              # Run migrations
npm run prisma:generate             # Generate Prisma Client

# Development Server
npm run dev                          # Start dev server (webpack)
npm run dev:turbo                    # Start with Turbopack (faster)

# Database
npm run db:up                        # Start PostgreSQL container
npm run db:down                      # Stop container
npm run db:logs                      # View logs
npm run prisma:seed                 # Seed database

# Testing & Validation
npm run check:locale-keys           # TypeScript check
npm run lint                        # ESLint

# Build & Deploy
npm run build                       # Build for production
npm start                          # Start production server
```

### Git Workflow
```bash
git clone <repo>
git checkout -b feature/my-feature
git add .
git commit -m "feat: add new feature"
git push origin feature/my-feature
# Open Pull Request
```

---

## Environment Variables

### Required for Development
```env
DATABASE_URL=postgresql://postgres:postgres123@localhost:5432/personal_profile_prototype
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-here-change-in-production
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
ADMIN_TEST_EMAIL=admin@example.com
ADMIN_TEST_PASSWORD=admin123
VIEWER_TEST_PASSWORD=viewer123
```

### Optional
```env
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:3000
```

---

## API Endpoints (Current)

### Authentication
```http
POST /api/auth/signin              # Sign in with provider
POST /api/auth/callback/[provider] # OAuth callback
POST /api/auth/signout             # Sign out
GET  /api/auth/session             # Get current session
```

### Posts (Content)
```http
GET    /api/posts                  # List all posts (authenticated)
POST   /api/posts                  # Create post (admin only)
GET    /api/posts/[id]             # Get single post
DELETE /api/posts/[id]             # Delete post (admin only)

Example POST body:
{
  "title": "My New Post",
  "content": "Post content here...",
  "published": true,
  "authorId": "user-uuid"
}
```

---

## Key Files Location Guide

| Purpose | Location |
|---------|----------|
| Root App Shell | [app/page.tsx](app/page.tsx) |
| Component Library | [app/components/](app/components/) |
| Business Models | [app/models/](app/models/) |
| Services & Facade | [app/services/](app/services/) |
| API Routes | [app/api/](app/api/) |
| Auth Configuration | [app/lib/auth.ts](app/lib/auth.ts) |
| Database Client | [app/lib/prisma.ts](app/lib/prisma.ts) |
| Data Models | [prisma/schema.prisma](prisma/schema.prisma) |
| Migrations | [prisma/migrations/](prisma/migrations/) |
| Mock Data | [app/data/](app/data/) |
| Type Definitions | [app/interfaces/](app/interfaces/) |
| Styling | [app/globals.css](app/globals.css) |
| Documentation | [docs/](docs/), [LIVING_DOCUMENTATION.md](LIVING_DOCUMENTATION.md) |

---

## Common Development Tasks

### Add a New Feed Sort Strategy
1. Create file: `app/models/feed/CustomSortStrategy.ts`
```typescript
import { FeedSortStrategy, FeedItem } from '@/app/interfaces/feed';

export class CustomSortStrategy implements FeedSortStrategy {
  sort(items: FeedItem[]): FeedItem[] {
    return [...items].sort((a, b) => {
      // Your sorting logic
      return 0;
    });
  }
}
```
2. Register in feed section: Add to `SORT_STRATEGIES` array
3. Test: Verify in feed UI

### Add a New Notification Channel
1. Create file: `app/services/system/notification/CustomChannel.ts`
```typescript
import { INotificationChannel } from './NotificationChannel';
import type { NotificationEvent } from './NotificationEvent';

export class CustomChannel implements INotificationChannel {
  send(event: NotificationEvent): void {
    // Custom delivery logic
  }
}
```
2. Use: `notify.setChannel(new CustomChannel())`
3. Test: Trigger notifications

### Add a New Tab/Section
1. Define route in [app/features/composition/tabRouting.ts](app/features/composition/tabRouting.ts)
2. Create component in [app/features/sections/](app/features/sections/)
3. Update `navItems` in [PersonalWebsiteApp](app/features/composition/PersonalWebsiteApp.tsx)
4. Add case in `renderContent()` function
5. Add icon and label in LOCALES

### Create a New API Endpoint
1. Create file: `app/api/[resource]/route.ts`
```typescript
import { NextResponse } from 'next/server';
import { requireAdminSession } from '@/app/lib/require-admin-session';
import { prisma } from '@/lib/prisma';

export async function GET() {
  // List resources
  return NextResponse.json({ items: [] });
}

export async function POST(request: Request) {
  const authError = await requireAdminSession();
  if (authError) return authError;
  
  const body = await request.json();
  // Create logic
  return NextResponse.json({ item }, { status: 201 });
}
```
2. Add type definitions
3. Add integration tests
4. Update API documentation

---

## Testing Quick Start

### Run Tests (Not yet available - TODO)
```bash
npm test                 # Run all tests
npm test -- --watch    # Watch mode
npm test -- --coverage # Coverage report
npm run test:e2e        # E2E tests (Playwright)
```

### Test Structure (When implemented)
```
tests/
├── unit/
│   ├── models/
│   ├── services/
│   └── utils/
├── integration/
│   └── api/
└── e2e/
    └── user-flows/
```

### Writing Tests
```typescript
describe('MyComponent', () => {
  it('should render correctly', () => {
    const { getByText } = render(<MyComponent />);
    expect(getByText('Hello')).toBeInTheDocument();
  });

  it('should handle click', async () => {
    const onClick = jest.fn();
    const { getByRole } = render(<button onClick={onClick}>Click</button>);
    await userEvent.click(getByRole('button'));
    expect(onClick).toHaveBeenCalled();
  });
});
```

---

## Debugging Tips

### Debug Mode
```bash
NODE_DEBUG=prisma npm run dev    # Debug Prisma
DEBUG=* npm run dev              # Debug everything
```

### Browser DevTools
- F12 or Cmd+Opt+I
- React DevTools extension
- Redux DevTools (if using Redux)
- Network tab for API calls

### Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Prisma Client not generated | Run `npm run prisma:generate` |
| Database connection failed | Check DATABASE_URL and docker-compose |
| Session not working | Verify NEXTAUTH_SECRET is set |
| Component not updating | Check React key props and state closure |
| Styles not applied | Clear `.next` folder and rebuild |
| Port 3000 already in use | `kill -9 $(lsof -t -i:3000)` or change port |

### Useful Links
- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [NextAuth.js Docs](https://next-auth.js.org)
- [React Docs](https://react.dev)
- [TypeScript Docs](https://www.typescriptlang.org/docs)

---

## Code Style & Conventions

### TypeScript
```typescript
// ✅ Good
export interface ComponentProps {
  title: string;
  onClick?: (id: string) => void;
  children?: React.ReactNode;
}

export function MyComponent({ title, onClick }: Readonly<ComponentProps>) {
  // Component body
}

// ❌ Avoid
export function MyComponent(props: any) {
  // Using 'any'
}
```

### React Components
```typescript
// ✅ Good - Functional with hooks
export function MyComponent() {
  const [state, setState] = useState(initialState);
  
  useEffect(() => {
    // Setup
    return () => {
      // Cleanup
    };
  }, [dependencies]);
  
  return <div>{/* JSX */}</div>;
}

// ❌ Avoid - Class components
class MyComponent extends React.Component {
  // Old pattern
}
```

### Naming
```typescript
// Components: PascalCase
export function MyComponent() {}

// Files: kebab-case
my-component.tsx

// Functions: camelCase
function handleClick() {}
const calculateTotal = () => {}

// Constants: UPPER_SNAKE_CASE
const MAX_ITEMS = 100;
const DEFAULT_LANGUAGE = 'en';

// Private/Internal: _prefix or private keyword
private _internalState = {};
const _helperFunction = () => {};
```

---

## Troubleshooting Database

### Reset Database
```bash
# Full reset (destructive)
npx prisma migrate reset

# View current state
npx prisma migrate status

# View data
npx prisma studio

# Create new migration
npx prisma migrate dev --name add_new_model
```

### Common DB Issues

| Issue | Solution |
|-------|----------|
| Migration failed | Check migration files and resolve conflicts |
| Foreign key constraint | Ensure referenced record exists |
| Unique constraint violated | Check for duplicate values |
| Table doesn't exist | Run migrations: `npx prisma migrate deploy` |

---

## Deployment Checklist

### Pre-Deployment
- [ ] Tests pass
- [ ] Linting passes
- [ ] Environment variables configured
- [ ] Database migrations created and tested
- [ ] Security audit completed
- [ ] Performance tested
- [ ] Accessibility tested
- [ ] Documentation updated

### Deployment Steps
```bash
# 1. Build application
npm run build

# 2. Run migrations on production DB
npx prisma migrate deploy --skip-generate

# 3. Deploy to target
docker build -t app:version .
docker push <registry>/app:version
# Deploy to GCP Cloud Run, K8s, etc.

# 4. Run smoke tests
npm run test:smoke

# 5. Monitor logs and metrics
# Check error tracking service
# Check uptime monitoring
```

### Post-Deployment
- [ ] Verify all endpoints working
- [ ] Check database connectivity
- [ ] Monitor error logs
- [ ] Verify analytics tracking
- [ ] Run performance tests
- [ ] Notify team/stakeholders

---

## Performance Tips

### Bundle Analysis
```bash
npm install --save-dev @next/bundle-analyzer
# See next.config.ts for setup
npm run build  # Analyze automatically
```

### Image Optimization
```typescript
import Image from 'next/image';

<Image
  src="/image.jpg"
  alt="Description"
  width={800}
  height={600}
  priority  // For above-fold images
/>
```

### Code Splitting
```typescript
// Automatic: Next.js automatically splits per route
// Manual: Use dynamic imports
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <div>Loading...</div>,
});
```

---

## Security Checklist

### Frontend
- [ ] No sensitive data in client-side code
- [ ] Input validation before submission
- [ ] CSRF tokens on forms (if needed)
- [ ] CSP headers configured
- [ ] XSS protection enabled

### Backend
- [ ] Session validation on every protected endpoint
- [ ] Input sanitization
- [ ] SQL injection prevention (Prisma handles this)
- [ ] Rate limiting on APIs
- [ ] Secure headers (helmet.js)
- [ ] HTTPS enforced

### Database
- [ ] Strong passwords
- [ ] Encrypted connections
- [ ] Backups automated
- [ ] Access logs enabled
- [ ] Principle of least privilege

---

## Useful VS Code Extensions

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-typescript-next",
    "ms-vscode-remote.remote-containers",
    "GitHub.copilot",
    "ms-mssql.mssql",
    "Prisma.prisma"
  ]
}
```

---

## Resources & Documentation

### Official Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [TypeScript Docs](https://www.typescriptlang.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [NextAuth.js](https://next-auth.js.org)

### Learning Resources
- [Design Patterns](https://refactoring.guru/design-patterns)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)
- [Clean Code](https://www.oreilly.com/library/view/clean-code-a/9780136083238/)

### Project Documentation
- [LIVING_DOCUMENTATION.md](LIVING_DOCUMENTATION.md) - Full SDLC documentation
- [ARCHITECTURE_DIAGRAMS.md](ARCHITECTURE_DIAGRAMS.md) - Visual architecture
- [docs/](docs/) - Detailed guides and patterns
- [README.v2.md](README.v2.md) - Original project overview

---

## Support & Contact

**Questions or Issues?**
- 📧 Email: anothai.0978452316@gmail.com
- 🐙 GitHub: https://github.com/TaiChi112/Personal-Profile-Prototype
- 📋 Issues: Open a GitHub issue
- 💬 Discussions: Start a GitHub discussion

**Code Review Process**
1. Create feature branch: `feature/description`
2. Make changes
3. Run tests & linting
4. Create Pull Request
5. Request review
6. Address feedback
7. Merge after approval

---

**Last Updated:** April 2026  
**Version:** 1.0.0
