# Escrow Flow

The MVP escrow flow is intentionally application-controlled.

## Current flow

1. client creates a project and defines milestones
2. freelancer reviews milestone requirements
3. client selects a milestone and confirms funding
4. the API validates the destination and source account
5. a Stellar payment transaction is built and submitted on Testnet if configured
6. the application records the funded milestone status and transaction metadata

## Not implemented

- Soroban smart-contract escrow
- automated milestone release
- on-chain dispute resolution
- decentralized escrow enforcement
