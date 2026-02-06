# Guardrails

1. **Suspense Boundaries**: Every useSearchParams() MUST be in a Suspense boundary
2. **Lazy Client Init**: No top-level Prisma/Stripe/Redis clients — use lazy getters
3. **Stripe API Version**: Always pass explicit apiVersion: '2024-12-18.acacia'
4. **N+1 Prevention**: Use Prisma include/select for related data, never lazy-load in loops
5. **Error Handling**: All API routes need try/catch with structured JSON errors

## Signs Found

### Sign: Windows file casing
- **Trigger**: Creating new .tsx files
- **Instruction**: Windows filesystem is case-insensitive. If a file already exists as Button.tsx, writing button.tsx overwrites it but may keep old casing. Always check ls -la for actual filenames before creating barrel exports.
- **Added after**: Chunk 1 - TypeScript error TS1261 due to casing mismatch

### Sign: Prisma 7 breaks datasource url
- **Trigger**: Using Prisma v7+
- **Instruction**: Prisma 7 removed url from datasource block. Use Prisma 6.x for traditional schema format.
- **Added after**: Chunk 1 - npx prisma generate failed with P1012
