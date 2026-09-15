# Future GitHub Issues for StellarTrust

This document captures the deferred contributor roadmap for StellarTrust. These are future tasks only. The current MVP remains intentionally limited and is not replaced by any of the items below.

## 1. Implement authentication and session persistence

- Issue title: Implement authentication and session persistence
- Description: Add a real authentication flow for client and freelancer accounts, including sign-up, sign-in, sign-out, secure session creation, and session persistence across requests. The app should support a clear server-side session model that is compatible with the existing Next.js and Express structure.
- Why this matters: The MVP currently has demo-only data and does not model identity or trust boundaries. Authentication is the first requirement for protecting project ownership, milestone updates, and user-specific actions.
- Scope:
  - add a credential-based login/signup flow for the web app
  - create secure server-side session storage and cookie configuration
  - handle session refresh, expiry, and logout
  - integrate session checks into protected API routes
- Acceptance criteria:
  - a user can create an account from the application UI or API endpoint
  - a user can sign in and receive a session that persists across requests
  - an authenticated user can access their own data and is denied access to other users' data
  - signing out invalidates the active session
  - the session flow is documented in the developer setup guide
- Non-goals:
  - OAuth providers, SSO, or social sign-in
  - multi-factor authentication
  - user profile editing beyond login/session basics
- Suggested labels: backend, frontend, security, good first issue
- Suggested difficulty: medium

## 2. Persist projects with Prisma

- Issue title: Persist projects with Prisma
- Description: Move project data from demo in-memory arrays into a Prisma-backed persistent store. Project records should be created, read, updated, and queried using a proper database model with schema validation and indexing.
- Why this matters: The current MVP is demo-only. A contributor should be able to persist real project state so the application can support repeat use beyond local prototype data.
- Scope:
  - define the Prisma Project model and relationship fields
  - add migration setup and schema documentation
  - connect the API project endpoints to Prisma queries instead of demo arrays
  - ensure search and fetch by project ID works reliably
- Acceptance criteria:
  - a project record can be created and stored in the database
  - the project can be retrieved by ID and listed in collection queries
  - the API returns the database-backed object instead of static demo data
  - database migrations can be run in a clean local environment
  - schema and migration details are documented for contributors
- Non-goals:
  - milestone persistence in the same issue
  - real-time sync or multi-tenant data isolation beyond basic ownership rules
  - database seeding for production data
- Suggested labels: backend, database, documentation
- Suggested difficulty: medium

## 3. Persist milestones with Prisma

- Issue title: Persist milestones with Prisma
- Description: Add a durable Prisma data model for milestones and update the API to store milestone state, amounts, dates, and status transitions in a real database rather than in in-memory project objects.
- Why this matters: Milestone data is the core of the escrow UX. Without persistent milestone records, the product cannot safely track funding progress across server restarts or real user sessions.
- Scope:
  - create a Prisma Milestone model with relation to Project
  - add migration and seed assumptions for milestone status values
  - update project creation and milestone creation endpoints to write to the database
  - ensure status transitions are queryable and auditable
- Acceptance criteria:
  - milestone records can be created and linked to a project
  - milestone status values are persisted and returned via the API
  - milestone listing and lookup endpoints work against the database
  - data integrity checks prevent orphaned milestone records
  - docs explain the milestone lifecycle and schema fields
- Non-goals:
  - automated payment release logic
  - Soroban contract integration
  - dispute logic tied to a database model in this issue
- Suggested labels: backend, database, documentation
- Suggested difficulty: medium

## 4. Implement role-based authorization

- Issue title: Implement role-based authorization
- Description: Add authorization logic so that clients, freelancers, and admins have different permissions across project, milestone, and payment operations. The system should reject unauthorized actions before they reach business logic.
- Why this matters: Without role checks, project ownership and milestone release logic can be abused. Clear role boundaries are required to prevent access issues as the MVP becomes more real.
- Scope:
  - define roles and permission rules for client, freelancer, and admin
  - tie authenticated users to project ownership records
  - enforce authorization in API handlers for project and milestone operations
  - provide clear error responses for unauthorized requests
- Acceptance criteria:
  - the API rejects actions from users who are not the assigned client or freelancer
  - project owners can manage their own projects but cannot affect others' records
  - admin access is restricted to explicitly authorized users
  - all unauthorized attempts return consistent 401 or 403 responses
  - authorization rules are documented for contributor onboarding
- Non-goals:
  - granular per-milestone permissions beyond defined roles
  - multi-tenant or enterprise audience support
  - payment, escrow, or dispute logic implementation
- Suggested labels: backend, security, frontend
- Suggested difficulty: medium

## 5. Implement Soroban escrow contract

- Issue title: Implement Soroban escrow contract
- Description: Build a Soroban smart-contract escrow flow that manages milestone funding, release conditions, and recordable state transitions on-chain. The contract should be designed to complement the app’s off-chain project orchestration rather than replace it.
- Why this matters: The current MVP uses the Stellar Testnet SDK for wallet and transaction preparation but does not include a contract-based escrow layer. A real escrow contract would make milestone release and state tracking more robust.
- Scope:
  - define escrow states and release conditions in contract code
  - create a Soroban contract module for project and milestone funding logic
  - add compile and deployment scripts for testnet environments
  - integrate the contract interface with the app’s architecture documentation
- Acceptance criteria:
  - a contract can initialize escrow state for a funded milestone
  - a project owner can trigger a valid release condition after milestone review
  - invalid or unauthorized release attempts fail with clear contract errors
  - deployment instructions work on Stellar Testnet
  - the application’s architecture documentation distinguishes contract logic from app-level orchestration
- Non-goals:
  - full dispute resolution in the contract
  - mainnet deployment
  - automatic payment routing without a review gate
- Suggested labels: soroban, stellar, backend, security
- Suggested difficulty: advanced

## 6. Automate milestone payment release

- Issue title: Automate milestone payment release
- Description: Add a release pipeline that automatically transfers or records milestone funds when a milestone is marked complete, approved, and validated under business rules. This work should connect the application state with the payment service and, if applicable, the escrow contract.
- Why this matters: Manual milestone release is a bottleneck and creates room for inconsistent approval behavior. An automated process will reduce operational friction and make the escrow flow more understandable.
- Scope:
  - define milestone completion and approval state transitions
  - implement a release workflow in the API or service layer
  - validate funding availability and payment destination before release
  - emit a clear status update to the project and milestone record
- Acceptance criteria:
  - a milestone can move from submitted to approved only under valid conditions
  - the system prevents duplicate payment releases for the same milestone
  - a release attempt with insufficient funds or invalid destination is rejected with a clear message
  - status history is persisted or traceable in API responses or logs
  - the flow is documented with example states and failure cases
- Non-goals:
  - dispute adjudication or arbitrator handling
  - user-driven manual withdrawal flows beyond standard release rules
  - Soroban contract implementation in the same issue
- Suggested labels: backend, stellar, security, medium
- Suggested difficulty: advanced

## 7. Build dispute resolution workflow

- Issue title: Build dispute resolution workflow
- Description: Create a structured dispute management flow where a client or freelancer can raise a dispute, attach evidence or notes, and track the dispute through review states until it is resolved. The workflow should be application-friendly and should not claim full decentralized arbitration.
- Why this matters: Escrow flows benefit from a clear and auditable dispute path. Without a workflow, unresolved disagreements become unclear and the product loses trustworthiness.
- Scope:
  - define dispute lifecycle states and required metadata
  - add API endpoints for opening, reviewing, and resolving disputes
  - expose relevant dispute status in project and milestone views
  - write documentation for dispute handling and escalation rules
- Acceptance criteria:
  - a user can open a dispute with project and milestone context
  - dispute status transitions are clear and auditable
  - app users can view dispute history and current state
  - the system blocks contradictory or duplicate dispute actions
  - contributor docs describe the dispute escalations and responsibilities
- Non-goals:
  - real arbitrator selection or decentralized governance
  - automatic fund splitting without a human review decision
  - contract-level governance logic outside the app layer
- Suggested labels: backend, frontend, security, documentation
- Suggested difficulty: advanced

## 8. Add notifications

- Issue title: Add notifications
- Description: Add a notification system for milestone updates, approvals, payment events, and dispute actions. Notifications should be visible in the app and should be designed to be extendable for future email or push delivery.
- Why this matters: Users need reliable awareness when important project or payment events occur. This is especially important in milestone-based work where delays or missed approvals can create friction.
- Scope:
  - define notification types and payloads
  - add database or in-memory storage for notification records
  - surface notifications in the web app UI
  - add API endpoints for listing and marking notifications as read
- Acceptance criteria:
  - users receive notifications for milestone status changes and payment events
  - notification records can be marked as read
  - unread count is visible in the UI or API output
  - notification templates and event triggers are documented
- Non-goals:
  - email, SMS, or push delivery providers
  - complex notification preferences or digests
  - real-time websocket infrastructure in the first pass
- Suggested labels: backend, frontend, documentation
- Suggested difficulty: medium

## 9. Add freelancer earnings and payment history

- Issue title: Add freelancer earnings and payment history
- Description: Build a freelancer-focused earnings dashboard that aggregates payment history, milestone payouts, total earned amounts, and pending/cleared balances. This should give users a practical summary of the financial side of the platform without overreaching into complete accounting systems.
- Why this matters: The current app focuses on project creation and milestone status, but not the financial record-keeping needed by freelancers. A contributor should be able to add a transparent earnings view to support trust and usability.
- Scope:
  - define earnings and payment-history data models
  - aggregate milestone payment activity by freelancer and project
  - expose summary cards and transaction history in the web app
  - add API endpoints for earnings summary and payment history
- Acceptance criteria:
  - a freelancer can view total earned, pending payouts, and cleared payments
  - payment history reflects real milestone releases and funding events
  - currency and asset metadata remain visible for each payout or payment event
  - empty and zero-balance states are handled gracefully
- Non-goals:
  - payroll, tax reporting, tax forms, or accounting exports
  - automatic withdrawal or bank transfer processing
  - mainnet financial compliance workflows
- Suggested labels: backend, frontend, database, documentation
- Suggested difficulty: medium

## 10. Add Stellar payment integration tests

- Issue title: Add Stellar payment integration tests
- Description: Add automated tests covering destination validation, account lookup, payment transaction construction, and transaction submission flows against configured Testnet or mock Horizon environments. The tests should focus on the real network-facing contract of the Stellar service package.
- Why this matters: The project already contains a dedicated Stellar service layer, but the integration path between the app, the service, and the Horizon API needs repeatable automated verification. This reduces the risk of regressions in account and payment logic.
- Scope:
  - design integration-test fixtures for Stellar Testnet use or mock Horizon responses
  - cover valid and invalid destination addresses
  - cover source-account lookup, insufficient-balance checks, and transaction construction
  - test happy-path and failure-path responses from the service layer
- Acceptance criteria:
  - network and validation tests are automated and repeatable in CI
  - a failure path is covered for invalid addresses or insufficient balances
  - the service’s transaction construction and submission flow is tested without requiring manual browser operations
  - test instructions are documented for local and CI environments
- Non-goals:
  - mainnet payment execution tests
  - end-to-end UI automation for blockchain flows in the same issue
  - Soroban contract testing
- Suggested labels: testing, stellar, backend, documentation
- Suggested difficulty: medium

## Summary

These issues are intentionally future-facing and complementary. They expand the MVP into a production-ready contributor platform without changing the current functionality or claiming that those features are already implemented.
