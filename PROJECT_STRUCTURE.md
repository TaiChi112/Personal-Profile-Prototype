# Project Structure Boundaries

## 1. Purpose

This reference helps AI agents distinguish production project areas from learning,
sandbox, archive, local-only, and generated content. Use it before editing an
unfamiliar folder or proposing a repository reorganization.

## 2. High-Level Rule for AI Agents

Treat a folder as production runtime only when its import, build, deployment, or
rendering relationship has been verified. Do not assume that every tracked
TypeScript file is application code. Do not assume that root `src/` is the main
application source tree for this repository.

Ignore rules are not ownership rules. Some tracked learning files remain under
paths that are ignored for newly added local material, and broad validation tools
may still inspect files outside the production runtime.

## 3. Production/Runtime Areas

| Area | Role | Editing guidance |
|---|---|---|
| `app/` | Primary Next.js App Router application, API routes, UI, services, models, and runtime data | Treat as production application code. |
| `app/data/` | Runtime application data modules imported by application features | Do not confuse this with root `data/`. |
| `lib/`, `auth.ts`, `proxy.ts` | Shared runtime, authentication, and request-handling surfaces | Verify consumers and follow the stricter rules in `AGENTS.md` before editing. |
| `public/` | Static assets served by the application | Confirm references before replacing or removing assets. |
| `package.json`, `bun.lock` | Scripts and dependency source of truth | Bun is canonical. Dependency changes require explicit approval. |
| `next.config.ts`, `source.config.ts`, `tsconfig.json`, styling and lint config files | Framework and build configuration | Verify downstream effects before editing. |

## 4. Documentation Areas

| Area | Role | Editing guidance |
|---|---|---|
| `docs/` | Fumadocs Markdown and MDX content source | Treat as documentation content. Preview affected routes when practical. |
| `app/docs/` | Runtime route and layout that render Fumadocs content | Treat as application code, not prose-only documentation. |
| `source.config.ts` | Fumadocs source configuration | Treat as framework configuration. Run a build after changes. |
| `.source/` | Generated Fumadocs output imported by `app/lib/source.ts` | Do not hand-edit. Regenerate through the normal build workflow. |
| `app/_docs/` | Ignored local reference material | Verify purpose before editing. Do not treat it as rendered docs content. |

## 5. Database Areas

| Area | Role | Editing guidance |
|---|---|---|
| `prisma/schema.prisma` | Database schema | Follow the approved migration workflow in `AGENTS.md`. |
| `prisma/migrations/` | Committed migration history | Do not edit or delete applied migrations. |
| `prisma.config.ts` | Prisma configuration | Verify migration and generation behavior before editing. |

`prisma/migrations/` is excluded from the Docker build context. Inspect the exact
deployment workflow before assuming migrations are delivered or run by a
container image.

## 6. Deployment/Infrastructure Areas

| Area | Role | Editing guidance |
|---|---|---|
| `Dockerfile` | Bun-based application image build and runtime | Treat as deployment-sensitive. |
| `docker-compose.yml` | Local PostgreSQL and application composition | Treat as local runtime infrastructure. |
| `docker-compose.prod.yml` | Production app, Nginx, and Certbot composition | Treat as deployment-sensitive. |
| `.github/workflows/` | GitHub Actions build and deployment automation | Treat as CI/CD-sensitive. |
| `nginx/` | Tracked Nginx configuration mounted by production Compose | Treat as host-side production infrastructure. |
| `certbot/` | Local host-side certificate state mounted by production Compose | Do not expose or modify certificate material without explicit approval. |
| `.dockerignore`, `.gcloudignore` | Build-context exclusions | Review before changing image or deployment assumptions. |

## 7. Learning/Sandbox/Archive Areas

| Area | Classification | Evidence and guidance |
|---|---|---|
| `src/` | Learning sandbox / experimental | Contains standalone design-pattern examples. It is tracked, but inspected runtime surfaces do not import it. Verify build relationships before editing. |
| `demo/` | Learning sandbox / experimental | Contains pattern demos, refactors, diagrams, and tests. It is tracked and excluded from the Docker context. |
| `plan/` | Archive/reference | Contains learning-plan material. It is tracked and excluded from the Docker context. |
| `data/` | Archive/reference, local-only | Root `data/` contains local notes and archive material, is ignored by Git, and is excluded from the Docker context. Do not confuse it with `app/data/`. |
| `Resume/` | Archive/reference, local-only | Contains local resume reference material and is ignored by Git. Verify before editing or publishing. |

The root `.gitignore` also ignores newly added material under `src/`, `demo/`, and
`plan/`, although existing files in those folders remain tracked. Do not move
production code into or out of these areas without explicit approval.

## 8. Sensitive/Local-Only Areas

| Area | Role | Editing guidance |
|---|---|---|
| `.env*` | Local environment configuration and secrets | Never read, expose, or modify real values without a specific security-conscious instruction. |
| `secrets/` | Ignored local secret material | Never inspect contents, publish files, or include values in output. |
| `certbot/` | Local certificate state | Treat as sensitive host-side infrastructure. |

## 9. Generated/Ignored Areas

Do not hand-edit or commit generated output unless a task explicitly requires it:

| Area | Role |
|---|---|
| `.next/` | Next.js build output |
| `.source/` | Generated Fumadocs source modules |
| `node_modules/` | Installed dependencies |
| `out/`, `build/`, `coverage/` | Generated build or test output |
| `*.tsbuildinfo`, `next-env.d.ts` | TypeScript or Next.js generated files |

## 10. Safe Editing Rules by Task Type

| Task type | Start with | Avoid unless explicitly required |
|---|---|---|
| Application feature or bug fix | `app/`, then verify shared imports | Root `src/`, `demo/`, archives, and deployment files |
| Documentation content change | `docs/`, rendered route, and metadata | `app/docs/` unless runtime rendering code must change |
| Database change | `prisma/schema.prisma` and existing migrations | Editing applied migration files or running production migrations |
| Deployment change | Docker, Compose, workflow, and host-side config together | Assuming local scripts or archive material are in the image |
| Learning example change | `src/`, `demo/`, or `plan/` as requested | Folding experiments into runtime code without verified imports |
| Repository cleanup | Ignore rules, tracked status, imports, and build context | Moving, renaming, or deleting top-level folders without approval |

## 11. When to Ask Before Editing

Ask for explicit approval before:

- moving, renaming, deleting, or reorganizing top-level folders
- treating learning, sandbox, or archive content as production runtime
- editing sensitive, authentication, deployment, CI/CD, or framework config
- changing dependency files or lockfiles
- exposing, publishing, or inspecting local-only secret material
- broadening a task across repository boundaries without verified imports or
  build relationships
