<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# AGENTS.md

## Project overview
This is a frontend project built with React / Next.js, TypeScript, Tailwind CSS, and modern data-fetching patterns.
The codebase should stay maintainable, production-oriented, and easy to extend.

## Main goals for agents
- Write clear, minimal, typed code.
- Avoid overengineering.
- Preserve existing behavior unless explicitly asked to change it.
- Prefer small safe edits over broad rewrites.
- Keep architecture understandable for human developers.

## Stack
- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- TanStack Query
- Zustand if already present
- React Hook Form / Zod if already present

## Commands
- Install: `npm install`
- Dev: `npm dev`
- Lint: `npm lint`
- Typecheck: `npm typecheck`
- Test: `npm test`
- Build: `npm build`

## Core rules
- Do not change unrelated files.
- Do not rename public APIs without clear reason.
- Do not introduce new dependencies unless necessary.
- Prefer existing project patterns over inventing new ones.
- Keep components small and focused.
- Extract logic when duplication is real, not hypothetical.
- Avoid `any`. If unavoidable, explain why.
- Keep server/client component boundaries explicit.
- Prefer derived state over duplicated state.
- Prefer composition over deeply nested prop drilling when practical.

## React rules
- Avoid unnecessary `useEffect`.
- Do not use `useEffect` for pure derivations.
- Memoization only when there is a real render/perf reason.
- Keep UI components presentational when possible.
- Move business logic to hooks, services, or utils when it improves clarity.

## Next.js rules
- Default to Server Components unless interactivity is needed.
- Use Client Components only for browser APIs, handlers, local state, or hooks requiring client execution.
- Keep data fetching close to the server boundary when possible.
- Avoid unnecessary client-side fetching if the data can be prepared on the server.
- Be careful with hydration mismatches.

## TypeScript rules
- Prefer explicit types at boundaries.
- Infer types internally when readable.
- Use discriminated unions for variant-heavy UI/state.
- Do not silence errors with casts unless justified.

## Styling rules
- Use Tailwind consistently.
- Reuse existing utility patterns before creating new abstractions.
- Preserve spacing and visual consistency.
- Keep accessibility in mind for interactive elements.

## Testing and checks
Before finishing a task, always check:
- lint
- typecheck
- build

If tests already exist around the changed code, run or update them.

## Response style
When making changes:
1. Briefly explain what will change.
2. Make minimal safe edits.
3. Summarize changed files.
4. Mention risks or follow-up only if relevant.

## Forbidden behavior
- No giant rewrites unless explicitly requested.
- No fake implementations hidden behind TODOs unless asked.
- No invented APIs.
- No silent breaking changes.