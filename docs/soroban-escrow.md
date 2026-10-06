# Soroban Escrow Contract

`contracts/escrow` holds the on-chain escrow logic, replacing the
application-controlled flow described in `escrow-flow.md`.

| Function | Caller | Behavior |
| --- | --- | --- |
| `init` | client | Locks the sum of all milestone amounts in the contract |
| `submit(i)` | freelancer | Marks milestone `i` delivered |
| `release(i)` | client | Pays milestone `i` to the freelancer |
| `claim(i)` | freelancer | Pays a *submitted* milestone after its deadline if the client never released |
| `refund(i)` | client | Returns an *undelivered* milestone after its deadline |

Delivered work can never be refunded, and no milestone can be paid twice.

```bash
cd contracts/escrow
cargo test
```

Not yet audited or deployed; testnet deployment and web integration are
tracked in `ROADMAP.md`.

## Deploying to testnet

With [stellar-cli](https://developers.stellar.org/docs/tools/cli) >= 25.2.0
installed:

```bash
./scripts/deploy-escrow.sh
```

The script creates and funds a testnet identity, builds the WASM with
`stellar contract build`, deploys it, and prints the contract ID and explorer
link. Add that link to the README once deployed.

## Testnet deployment

| | |
| --- | --- |
| Network | Stellar Testnet |
| Contract ID | `CBCI6QFRQHUVZDMLF5NLY4U56PEXHZ7KYCEWTXXJ6XZMGHCY5PG4WZM4` |
| Explorer | https://stellar.expert/explorer/testnet/contract/CBCI6QFRQHUVZDMLF5NLY4U56PEXHZ7KYCEWTXXJ6XZMGHCY5PG4WZM4 |

Deployed with the `Deploy escrow to testnet` GitHub Actions workflow.

## TypeScript client

`packages/stellar/src/escrow.ts` exports `EscrowClient`. It reads milestones
by simulation and prepares `submit` / `release` / `claim` / `refund`
transactions as unsigned XDR for a wallet to sign; it never handles secret
keys. Wiring it to the web escrow page (wallet signing) is the next step.
