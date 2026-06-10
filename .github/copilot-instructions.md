# Copilot Instructions

React / Next.js TypeScript project.

## Style
- Simple, readable code
- No overengineering
- No `any`
- Follow existing patterns
- No rewriting unrelated files
- Small focused components
- Consistent Tailwind

## React
- No unnecessary `useEffect`
- Clear props and composition
- Memoize only when needed

## Next.js
- Server Components by default
- Client Components only when required
- Watch hydration

## Changes
- Minimal diffs
- No new dependencies unless needed
- Preserve behavior unless asked
- Use PascalCase only for components like <UserCard/> (UserCard.tsx)
- Props destructuring directly in function parameters: `{ }: Props`
- Custom hooks for buisiness abstraction
- `'use client'` directive for client components

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