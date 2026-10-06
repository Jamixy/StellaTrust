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
| `info()` | anyone | Returns the client, freelancer and token fixed at `init` |
| `milestones()` | anyone | Returns every milestone with its status |

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

## Using the escrow page

`/escrow` connects to [Freighter](https://freighter.app) (set to Testnet),
reads milestones from the contract, and signs `submit` / `release` / `claim` /
`refund` with the connected wallet.

The deployed contract must be initialized once before it shows milestones.
The first caller of `init` fixes the client, freelancer and token, so run it
immediately after deploying:

```bash
stellar contract invoke --id <CONTRACT_ID> --source <client-identity> --network testnet \
  -- init --client <CLIENT_G...> --freelancer <FREELANCER_G...> \
  --token CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC \
  --amounts '["30000000","20000000"]' --deadlines '[1893456000,1896134400]'
```

The token above is the native XLM Stellar Asset Contract on Testnet; amounts
are in stroops (1 XLM = 10,000,000), so the example above is 3 XLM and 2 XLM.
The `token` must be the token contract, never the escrow contract's own ID
(that fails with `Contract re-entry is not allowed`).

## Verified on testnet

The full flow has been exercised against the deployed contract: `init` (locks
5 XLM), `submit` (freelancer marks milestone 1 delivered) and `release`
(client pays milestone 1). The call history is public on the
[contract's explorer page](https://stellar.expert/explorer/testnet/contract/CBCI6QFRQHUVZDMLF5NLY4U56PEXHZ7KYCEWTXXJ6XZMGHCY5PG4WZM4).

`claim` is only available after a milestone's deadline, so it is covered by the
unit tests rather than the live deployment.

## Roles in the UI

`EscrowClient.getInfo()` reads `info()` so the escrow page can offer the client
only `release` / `refund` and the freelancer only `submit` / `claim`. Contracts
deployed before `info()` existed (including the first testnet deployment) have
no such function; the page then falls back to status and deadline gating only.
Redeploy to get role gating.
