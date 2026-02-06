# Build Prompt

You are building AgentOptimize, an AI visibility scanner SaaS.

## Context
Read AGENTS.md for project rules. Read IMPLEMENTATION_PLAN.md for current tasks. Read the current chunk spec in specs/ for detailed requirements.

## Process
1. Read the current chunk spec file
2. Implement one task from IMPLEMENTATION_PLAN.md
3. Run scoreboard: npm run typecheck && npm test && npm run build
4. If errors, fix them before moving on
5. Update .ralph/progress.md with what you did
6. When all tasks for the chunk are done, output: <promise>TASK_COMPLETE</promise>

## Guardrails
- Suspense boundaries on useSearchParams
- Lazy client initialization
- Explicit Stripe apiVersion
- No N+1 queries
- try/catch on all API routes
