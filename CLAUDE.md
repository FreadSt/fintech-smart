@AGENTS.md
# CLAUDE.md

You are working in a React / Next.js TypeScript project.

## Stack
- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- TanStack Query
- Zustand if already present
- React Hook Form / Zod if already present
- lucide-icons
- clsx + tailwind merge for shared reusable components
- recharts for chart and diagrams

## Work style
- Minimal, safe, production-ready edits
- No large rewrites unless explicitly asked
- Preserve existing behavior unless it's broken
- Follow existing conventions first
- Use PascalCase only for components like <UserCard/> (UserCard.tsx)
- Props destructuring directly in function parameters: `{ }: Props`
- Custom hooks for buisiness abstraction
- `'use client'` directive for client components

## Priorities
1. Correctness
2. Type safety
3. Readability
4. Maintainability

## Key rules
- Avoid unnecessary `useEffect`
- Avoid `any`
- Prefer Server Components by default
- Keep components small
- Reuse existing patterns
- No new dependencies unless necessary

## Before finishing
Suggest: lint, typecheck, build