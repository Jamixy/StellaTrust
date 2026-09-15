# Contributing

Thanks for helping build StellarTrust.

## Workflow

1. read the current docs and roadmap
2. open a small issue or feature proposal
3. keep the MVP scope oriented toward testnet-only functionality
4. avoid implementing mainnet, production escrow, or persistent authorization without design discussion

## Coding Rules

- keep Stellar logic in the dedicated service package
- validate inputs before using them in payment flows
- keep demo state separate from blockchain-backed functionality
- document intentionally deferred features clearly
