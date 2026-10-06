#!/usr/bin/env bash
# Build and deploy the escrow contract to Stellar Testnet.
# Requires stellar-cli >= 25.2.0 (https://developers.stellar.org/docs/tools/cli).
set -euo pipefail

IDENTITY="${1:-stellatrust-deployer}"

if ! stellar keys address "$IDENTITY" >/dev/null 2>&1; then
  stellar keys generate "$IDENTITY" --network testnet --fund
fi

cd "$(dirname "$0")/../contracts/escrow"
stellar contract build

CONTRACT_ID=$(stellar contract deploy \
  --wasm target/wasm32v1-none/release/stellatrust_escrow.wasm \
  --source "$IDENTITY" --network testnet)

echo "Deployed escrow contract: $CONTRACT_ID"
echo "Explorer: https://stellar.expert/explorer/testnet/contract/$CONTRACT_ID"
