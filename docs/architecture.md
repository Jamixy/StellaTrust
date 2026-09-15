# Architecture

The current MVP keeps concerns deliberately separated:

- Next.js app handles product UI and flows
- Express API exposes application endpoints and orchestrates demo project data
- shared validation package handles address and amount checks
- Stellar package isolates Horizon calls and payment transaction logic
- Prisma schema exists as a future persistence model, but the app is not yet bound to a live database

## Boundary

The UI does not submit secret keys or perform raw blockchain logic. Instead, the browser calls the API and the API calls the Stellar integration service. That keeps the domain rules in one place and prevents private-key leakage.
