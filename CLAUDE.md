# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # start dev server (http://localhost:3000)
npm run build    # production build (also runs TypeScript type-check)
npm run lint     # ESLint
```

There is no test runner configured yet.

## Architecture

This project uses **Hexagonal Architecture (Ports & Adapters)** with a strict dependency rule:

```
Presentation → Application → Domain ← Infrastructure
```

### Layer locations

| Layer | Path | Responsibility |
|---|---|---|
| Domain | `src/domain/<context>/` | Pure business logic, no framework deps |
| Application | `src/application/<context>/` | Use cases, orchestrates domain services |
| Infrastructure | `src/infrastructure/<context>/` | Concrete adapters (DB, clock, HTTP clients) |
| Presentation | `src/app/` | Next.js App Router — route handlers act as primary adapters |

### Adding a new domain

Follow this pattern for each new bounded context (e.g. `users`):

1. `src/domain/users/User.ts` — entity / value object
2. `src/domain/users/IUserRepository.ts` — output port (interface)
3. `src/domain/users/UserService.ts` — domain service (depends only on ports)
4. `src/infrastructure/users/InMemoryUserRepository.ts` — implements the port
5. `src/application/users/GetUserByIdUseCase.ts` — use case
6. `src/app/api/users/[id]/route.ts` — Next.js route handler with manual DI

Route handlers are the **only** place where all layers are wired together via manual dependency injection (no DI container).

### Key shared types

- `ApiResponse<T>` (`src/types/index.ts`) — standard envelope for all API responses: `{ data?, error?, message? }`

### Installed shadcn/ui components

`button`, `card`, `input`, `label`, `badge`, `separator`, `avatar`, `dropdown-menu`, `sonner`

Add new components with: `npx shadcn add <component>`

### Notes

- `npm run build` fails on the `/_global-error` prerender step due to a Next.js 16 Turbopack internal bug. TypeScript compilation (`✓ Compiled successfully`) is the meaningful signal — that step always runs first and is unaffected.
- Toaster (Sonner) is mounted globally in `src/app/layout.tsx`; import `toast` from `sonner` directly in any component.
