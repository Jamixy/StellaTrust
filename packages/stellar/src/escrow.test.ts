import { describe, expect, it } from "vitest";
import { Keypair, nativeToScVal, xdr } from "@stellar/stellar-sdk";
import { EscrowClient, decodeMilestones, isValidContractId } from "./escrow";

const CONTRACT_ID = "CBCI6QFRQHUVZDMLF5NLY4U56PEXHZ7KYCEWTXXJ6XZMGHCY5PG4WZM4";

describe("EscrowClient", () => {
  it("accepts the deployed testnet contract id and rejects junk", () => {
    expect(isValidContractId(CONTRACT_ID)).toBe(true);
    expect(isValidContractId("nope")).toBe(false);
    expect(isValidContractId(Keypair.random().publicKey())).toBe(false);
  });

  it("builds an unsigned invoke call for the target contract", () => {
    const client = new EscrowClient({ contractId: CONTRACT_ID });
    const tx = client.buildInvocation(
      "release",
      Keypair.random().publicKey(),
      [nativeToScVal(1, { type: "u32" })],
    );
    const op = tx.operations[0] as any;
    expect(op.type).toBe("invokeHostFunction");
    expect(client.contractId).toBe(CONTRACT_ID);
    expect(tx.signatures).toHaveLength(0);
  });

  it("decodes milestones returned by the contract", () => {
    const entry = (k: string, v: xdr.ScVal) =>
      new xdr.ScMapEntry({ key: xdr.ScVal.scvSymbol(k), val: v });
    const milestone = xdr.ScVal.scvMap([
      entry("amount", nativeToScVal(300n, { type: "i128" })),
      entry("deadline", nativeToScVal(2000n, { type: "u64" })),
      entry("status", xdr.ScVal.scvVec([xdr.ScVal.scvSymbol("Submitted")])),
    ]);
    const decoded = decodeMilestones(xdr.ScVal.scvVec([milestone]));
    expect(decoded).toEqual([{ amount: 300n, deadline: 2000n, status: "Submitted" }]);
  });
});
