# Stellar Integration

The Stellar package uses Horizon Testnet and the Stellar SDK to provide the following capabilities:

- destination address validation
- source account lookup
- balance lookup
- payment transaction construction
- signing with a configured secret key
- transaction submission
- transaction lookup by hash

## Environment

The default network is `testnet` and is configured through environment variables.

## Important

This project does not claim production-grade escrow or mainnet safety.
