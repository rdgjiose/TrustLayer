Objective

Initialize the TrustLayer MVP project.

Requirements

- Next.js frontend
- Cloudflare Workers backend
- Wrangler configuration
- TypeScript
- Basic project structure

Deliverables

Running homepage

GET /api/health

Returns:

{
    status:"ok"
}

Acceptance Criteria

npm install

npm run dev

opens homepage

/api/health returns JSON

Out of Scope

No login

No database

No blockchain

## References

PROJECT_BIBLE.md

docs/architecture/system-overview.md

docs/api/api-design.md

prompts/codex-system.md


## Constraints

Must follow PROJECT_BIBLE.md

Must use TypeScript

Must keep architecture modular

No business logic

No blockchain implementation

No authentication

No database connection

No payment system

## Success Checklist

[ ] npm install succeeds

[ ] npm run dev succeeds

[ ] Homepage loads

[ ] GET /api/health returns JSON

[ ] TypeScript compiles

[ ] No lint errors

[ ] Project structure matches ROADMAP.md