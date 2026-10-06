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
